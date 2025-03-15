
from datetime import datetime, date
from rest_framework import serializers
from .models import Patient, Diagnosis, Prescription, LabRequest, LabResult

from datetime import datetime, date
from rest_framework import serializers
from .models import Patient  # Your Patient model

from datetime import datetime, date
from rest_framework import serializers
from .models import Patient  # Adjust as needed
from medicine.serializers import MedicineSerializer

class PatientSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=8)
    first_name = serializers.CharField(max_length=200, allow_blank=True, required=False)
    middle_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=11)
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    street_address = serializers.CharField(max_length=100, allow_blank=True, required=False)
    barangay = serializers.CharField(max_length=100, allow_blank=True, required=False)
    municipal_city = serializers.CharField(max_length=100, allow_blank=True, required=False)
    age = serializers.SerializerMethodField()
    queue_data = serializers.SerializerMethodField()  # full list of queue entries
    latest_queue = serializers.SerializerMethodField()  # only the most recent queue entry
    complaint = serializers.ChoiceField(
        choices=[
            ('General Illness', 'General Illness'),
            ('Injury', 'Injury'),
            ('Check-up', 'Check-up'),
            ('Other', 'Other'),
        ],
        allow_blank=True,
        required=False
    )
    
    def get_age(self, obj):
        # Support both dicts and model instances
        dob = obj.get('date_of_birth') if isinstance(obj, dict) else getattr(obj, 'date_of_birth', None)
        if not dob:
            return None
        if isinstance(dob, str):
            try:
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
            except ValueError:
                return None
        today = date.today()
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    def get_queue_data(self, obj):
        # Return all related queue entries (using your Supabase key names)
        if isinstance(obj, dict):
            queue_info = obj.get('queueing_temporarystoragequeue') or obj.get('temporarystoragequeue')
        else:
            queue_info = getattr(obj, 'queueing_temporarystoragequeue', None) or getattr(obj, 'temporarystoragequeue', None)
        if queue_info:
            # Ensure it's always returned as a list
            if isinstance(queue_info, dict):
                return [queue_info]
            return queue_info
        return None

    def get_latest_queue(self, obj):
        # Retrieve the list of queue entries first
        if isinstance(obj, dict):
            queue_info = obj.get('queueing_temporarystoragequeue') or obj.get('temporarystoragequeue')
        else:
            queue_info = getattr(obj, 'queueing_temporarystoragequeue', None) or getattr(obj, 'temporarystoragequeue', None)
        if queue_info and isinstance(queue_info, list) and len(queue_info) > 0:
            # Sort the list in descending order by created_at (assuming ISO formatted strings)
            sorted_queue = sorted(
                queue_info,
                key=lambda q: q.get('created_at') if isinstance(q, dict) else getattr(q, 'created_at', None),
                reverse=True
            )
            return sorted_queue[0]
        elif isinstance(queue_info, dict):
            return queue_info
        return None


# class PatientRegistrationSerializer(serializers.ModelSerializer):
#     priority_level = serializers.ChoiceField(choices=[('Regular', 'Regular'), ('Priority', 'Priority')], default='Regular')  # Add priority field
#     agree_terms = serializers.BooleanField(write_only=True, required=True)
#     complaint = serializers.ChoiceField(
#         choices=[
#             ('General Illness', 'General Illness'),
#             ('Injury', 'Injury'),
#             ('Check-up', 'Check-up'),
#             ('Other', 'Other'),
#         ],
#         allow_blank=True,
#         required=False
#     )

#     class Meta:
#         model = Patient
#         fields = [
#             "first_name", "middle_name", "last_name", "email", "phone_number",
#             "date_of_birth", "street_address", "barangay",
#             "municipal_city", "agree_terms", "complaint"
#         ]

#     def get_queue_data(self, obj):
#         """Fetch queue data for the patient."""
#         queue_info = obj.temporarystoragequeue_set.filter(status='Waiting').first()  # Adjust as per your model relations
#         if queue_info:
#             return {
#                 'id': queue_info.id,
#                 'priority_level': queue_info.priority_level,
#                 'status': queue_info.status,
#                 'created_at': queue_info.created_at,
#                 'complaint': queue_info.complaint,
#             }
#         return None

class PatientRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    middle_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    date_of_birth = serializers.DateField()
    street_address = serializers.CharField(max_length=255)
    barangay = serializers.CharField(max_length=100)
    municipal_city = serializers.CharField(max_length=100)
    agree_terms = serializers.BooleanField(write_only=True, required=True)
    complaint = serializers.ChoiceField(
        choices=[
            ('General Illness', 'General Illness'),
            ('Injury', 'Injury'),
            ('Check-up', 'Check-up'),
            ('Other', 'Other'),
        ],
        allow_blank=True,
        required=False
    )
    priority_level = serializers.ChoiceField(
        choices=[('Regular', 'Regular'), ('Priority', 'Priority')],
        default='Regular'
    )
    queue_data = serializers.SerializerMethodField()

    def create(self, validated_data):
        # Remove any extra field(s) that are not part of the Patient model
        validated_data.pop('agree_terms', None)
        # Create and return a new Patient instance using the validated data
        return Patient.objects.create(**validated_data)

    def get_queue_data(self, obj):
        """Fetch queue data for the patient."""
        queue_info = obj.temporarystoragequeue.filter(status='Waiting').first()  # Adjust as per your model relations
        if queue_info:
            return {
                'id': queue_info.id,
                'priority_level': queue_info.priority_level,
                'status': queue_info.status,
                'created_at': queue_info.created_at,
                'complaint': queue_info.complaint,
            }
        return None

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = ['diagnosis_code', 'diagnosis_description', 'diagnosis_date']

class PrescriptionSerializer(serializers.ModelSerializer):
    medication = MedicineSerializer(read_only=True)
    medicine_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Prescription
        fields = ['id', 'medicine_id', 'medication', 'dosage', 'frequency', 'quantity', 'start_date', 'end_date']


class UserAccountReadSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    # Display the role's label (e.g., "Doctor") rather than the raw value
    role = serializers.CharField(source="get_role_display", read_only=True)

class LabRequestSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    # Nested info for the user who requested (read-only)
    requested_by = UserAccountReadSerializer(read_only=True)
    
    # Write-only field for patient input (e.g., the patient identifier)
    patient = serializers.CharField(write_only=True)
    
    # Nested patient info for output (read-only)
    patient_id = serializers.CharField(source="patient.patient_id", read_only=True)
    first_name = serializers.CharField(source="patient.first_name", read_only=True)
    middle_name = serializers.CharField(source="patient.middle_name", read_only=True)
    last_name = serializers.CharField(source="patient.last_name", read_only=True)
    
    test_name = serializers.CharField()
    custom_test = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    result = serializers.SerializerMethodField()

    
    def create(self, validated_data):
        # Get the current user from context (set automatically by the view)
        requested_by = self.context.get('request').user
        
        # Pop the patient identifier from the validated data
        patient_identifier = validated_data.pop('patient', None)
        if not patient_identifier:
            raise serializers.ValidationError({"patient": "This field is required."})
        
        # Look up the patient instance using your Patient model (adjust lookup field if needed)
        try:
            patient_instance = Patient.objects.get(patient_id=patient_identifier)
        except Patient.DoesNotExist:
            raise serializers.ValidationError({"patient": "Invalid patient identifier."})
        
        # Create the LabRequest with the patient and requested_by info
        lab_request = LabRequest.objects.create(
            requested_by=requested_by,
            patient=patient_instance,
            **validated_data
        )
        return lab_request
    
    def get_result(self, obj):
        # Attempt to fetch a lab result related to this lab request.
        # Adjust this lookup according to your model relationship.
        try:
            # For one-to-one relationship, if defined as lab_request.labresult:
            lab_result = obj.result  
        except LabResult.DoesNotExist:
            lab_result = None
        # If a lab result is found, return its serialized data; otherwise, return None.
        if lab_result:
            return LabResultSerializer(lab_result, context=self.context).data
        return None

class LabResultSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True)  # Allow file upload
    image_url = serializers.SerializerMethodField(read_only=True)  # For outputting URL
    submitted_by = UserAccountReadSerializer(read_only=True)

    def get_image_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if obj.image else None

    class Meta:
        model = LabResult
        fields = ['id', 'lab_request', 'image', 'image_url', 'uploaded_at', 'submitted_by']

