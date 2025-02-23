from rest_framework import serializers
from .models import TemporaryStorageQueue, PreliminaryAssessment, Treatment
from patient.serializers import DiagnosisSerializer, PrescriptionSerializer, PatientSerializer
from patient.models import Diagnosis, Prescription

class TemporaryStorageQueueSerializer(serializers.ModelSerializer):
    queue_number = serializers.SerializerMethodField()
    queue_data = serializers.SerializerMethodField()

    class Meta:
        model = TemporaryStorageQueue
        fields = ['id', 'queue_number', 'patient', 'priority_level', 'queue_data', 'created_at', 'status']

    
    def get_queueing_number(self, obj):
        queue = TemporaryStorageQueue.objects.filter(
            priority_level=obj.priority_level, status='Waiting'
        ).order_by('created_at')
        queue_list = list(queue)
        return f'#{queue_list.index(obj) + 1}' if obj in queue_list else 'N/A'
    def get_queue_data(self, obj):
    # If obj is a model instance:
        queue_info = getattr(obj, 'queueing_temporarystoragequeue', None)
        # If it's a dict, you could use: queue_info = obj.get('queueing_temporarystoragequeue')
        if queue_info:
            return {
                'priority_level': queue_info.priority_level,  # Adjust if these fields are named differently
                'status': queue_info.status,
                'created_at': queue_info.created_at,
            }
        return None

class PreliminaryAssessmentSerializer(serializers.ModelSerializer):
    queue_number = TemporaryStorageQueueSerializer(source='patient.temporarystoragequeue', read_only=True)

    class Meta:
        model = PreliminaryAssessment
        fields = [
            'patient', 'queue_number', 'blood_pressure', 'temperature', 'heart_rate',
            'respiratory_rate', 'pulse_rate', 'allergies', 'medical_history',
            'symptoms', 'current_medications',
            'pain_scale', 'pain_location', 'smoking_status', 'alcohol_use', 'assessment'
        ]
        extra_kwargs = {'patient': {'required': False}}  # Mark 'patient' as optional

    def create(self, validated_data):
        """
        Override create method to inject the patient from the context.
        """
        patient = self.context.get('patient')  # Get patient from context
        if not patient:
            raise serializers.ValidationError({'patient': 'Patient information is missing.'})
        
        validated_data['patient'] = patient
        return super().create(validated_data)

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    

class TreatmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    treatment_notes = serializers.CharField(allow_blank=True, required=False)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    patient = PatientSerializer()  # Nested serializer
    diagnoses = DiagnosisSerializer(many=True)
    prescriptions = PrescriptionSerializer(many=True)
    complaint = serializers.ChoiceField(  # Add if needed
        choices=[
            ('General Illness', 'General Illness'),
            ('Injury', 'Injury'),
            ('Check-up', 'Check-up'),
            ('Other', 'Other'),
        ],
        allow_blank=True,
        required=False
    )
