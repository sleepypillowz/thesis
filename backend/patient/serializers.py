
from datetime import datetime, date
from rest_framework import serializers
from .models import Patient, Diagnosis, Prescription

from datetime import datetime, date
from rest_framework import serializers
from .models import Patient  # Your Patient model

from datetime import datetime, date
from rest_framework import serializers
from .models import Patient  # Adjust as needed

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
    class Meta:
        model = Prescription
        fields = ['medication', 'dosage', 'frequency', 'start_date', 'end_date']
