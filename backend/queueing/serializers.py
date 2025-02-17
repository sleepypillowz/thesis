from rest_framework import serializers
<<<<<<< HEAD
from .models import TemporaryStorageQueue, PreliminaryAssessment
from patient.models import Patient
=======
from .models import TemporaryStorageQueue
>>>>>>> main

class TemporaryStorageQueueSerializer(serializers.ModelSerializer):
    queueing_number = serializers.SerializerMethodField()

    class Meta:
        model = TemporaryStorageQueue
        fields = ['id', 'queueing_number', 'patient', 'priority_level', 'created_at', 'status']

    def get_queueing_number(self, obj):
        queue = TemporaryStorageQueue.objects.filter(priority_level=obj.priority_level, status='Waiting').order_by('created_at')
        queue_list = list(queue)

        return f'#{queue_list.index(obj) + 1}' if obj in queue_list else 'N/A'
<<<<<<< HEAD
class PreliminaryAssessmentSerializer(serializers.ModelSerializer):
    queue_number = TemporaryStorageQueueSerializer(source='patient.temporarystoragequeue', read_only=True)

    class Meta:
        model = PreliminaryAssessment
        fields = [
            'patient', 'queue_number', 'blood_pressure', 'temperature', 'heart_rate',
            'respiratory_rate', 'pulse_rate', 'allergies', 'medical_history',
            'symptoms', 'current_medications', 'current_symptoms',
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


=======
>>>>>>> main
