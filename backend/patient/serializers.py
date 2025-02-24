
from datetime import datetime, date
from rest_framework import serializers
from .models import Patient, Diagnosis, Prescription

from datetime import datetime, date
from rest_framework import serializers
from .models import Patient  # Your Patient model

class PatientSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=8)
    first_name = serializers.CharField(max_length=200, allow_blank=True, required=False)
    middle_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=11)
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    complaint = serializers.ChoiceField(choices=[
        ('General Illness', 'General Illness'),
        ('Injury', 'Injury'),
        ('Check-up', 'Check-up'),
        ('Other', 'Other'),
    ], allow_blank=True, required=False)
    street_address = serializers.CharField(max_length=100, allow_blank=True, required=False)
    barangay = serializers.CharField(max_length=100, allow_blank=True, required=False)
    municipal_city = serializers.CharField(max_length=100, allow_blank=True, required=False)
    age = serializers.SerializerMethodField()
    queue_data = serializers.SerializerMethodField()

    def get_age(self, obj):
        # Support both dicts and model instances
        if isinstance(obj, dict):
            dob = obj.get('date_of_birth')
        else:
            dob = getattr(obj, 'date_of_birth', None)
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
        # Support both dicts and model instances
        if isinstance(obj, dict):
            queue_info = obj.get('queue_data')  # we are sending queue_data in transformed data
        else:
            queue_info = getattr(obj, 'queue_data', None)
        if queue_info:
            if isinstance(queue_info, dict):
                return {
                    'id': queue_info.get('id'),
                    'priority_level': queue_info.get('priority_level'),
                    'status': queue_info.get('status'),
                    'created_at': queue_info.get('created_at'),
                    'queue_number': queue_info.get('queue_number'),
                }
            else:
                # If it's a model instance, use attribute access
                return {
                    'id': getattr(queue_info, 'id', None),
                    'priority_level': getattr(queue_info, 'priority_level', None),
                    'status': getattr(queue_info, 'status', None),
                    'created_at': getattr(queue_info, 'created_at', None),
                    'queue_number': getattr(queue_info, 'queue_number', None),
                }
        return None

    # Optionally, if you need a display for complaint:
    def get_complaint_display(self, obj):
        if isinstance(obj, dict):
            complaint = obj.get('complaint')
        else:
            complaint = getattr(obj, 'complaint', None)
        choices = dict(self.fields['complaint'].choices)
        return choices.get(complaint, 'Unknown')

class PatientRegistrationSerializer(serializers.ModelSerializer):
    priority_level = serializers.ChoiceField(choices=[('Regular', 'Regular'), ('Priority', 'Priority')], default='Regular')  # Add priority field
    agree_terms = serializers.BooleanField(write_only=True, required=True)  # Serializer-only field

    class Meta:
        model = Patient
        fields = [
            "first_name", "middle_name", "last_name", "email", "phone_number",
            "date_of_birth", "complaint", "street_address", "barangay",
            "municipal_city", "priority_level", "agree_terms"
        ]
    def get_queue_data(self, obj):
        """Fetch queue data for the patient."""
        queue_info = obj.temporarystoragequeue_set.filter(status='Waiting').first()  # Adjust as per your model relations
        if queue_info:
            return {
                'id': queue_info.id,
                'priority_level': queue_info.priority_level,
                'status': queue_info.status,
                'created_at': queue_info.created_at,
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
