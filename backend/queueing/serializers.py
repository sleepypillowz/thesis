from rest_framework import serializers
from .models import TemporaryStorageQueue, PreliminaryAssessment
from patient.models import Patient

class TemporaryStorageQueueSerializer(serializers.ModelSerializer):
    queueing_number = serializers.SerializerMethodField()

    class Meta:
        model = TemporaryStorageQueue
        fields = ['id', 'queueing_number', 'patient', 'priority_level', 'created_at', 'status']

    def get_queueing_number(self, obj):
        queue = TemporaryStorageQueue.objects.filter(priority_level=obj.priority_level, status='Waiting').order_by('created_at')
        queue_list = list(queue)

        return f'#{queue_list.index(obj) + 1}' if obj in queue_list else 'N/A'
class PreliminaryAssessmentSerializer(serializers.ModelSerializer):
    queue_number = TemporaryStorageQueueSerializer(source='patient.temporarystoragequeue', read_only=True)

    class Meta:
        model = PreliminaryAssessment
        fields = ['patient', 'queue_number', 'blood_pressure', 'temperature', 'heart_rate', 'respiratory_rate', 'pulse_rate', 'symptoms', 'assessment']

    def validate_patient(self, value):
        # Log or print the value of the patient_id for debugging
        print(f"Validating patient with patient_id: {value}")
        try:
            patient = Patient.objects.get(patient_id=value)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient does not exist.")
        return value

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
class PreliminaryAssessmentSerializer(serializers.ModelSerializer):
    queue_number = TemporaryStorageQueueSerializer(source='patient.temporarystoragequeue', read_only=True)


    class Meta:
        model = PreliminaryAssessment
        fields = ['patient', 'queue_number', 'blood_pressure', 'temperature', 'heart_rate', 'respiratory_rate', 'pulse_rate', 'symptoms', 'assessment']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

