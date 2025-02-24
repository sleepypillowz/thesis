from rest_framework import serializers
from .models import TemporaryStorageQueue, PreliminaryAssessment, Treatment
from patient.serializers import DiagnosisSerializer, PrescriptionSerializer, PatientSerializer
from patient.models import Diagnosis, Patient, Prescription

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
    
class TreatmentSerializer(serializers.ModelSerializer):
    # For read operations, include full patient details.
    patient = PatientSerializer(read_only=True)
    # For write operations, accept only the patient_id.
    patient_id = serializers.CharField(write_only=True)
    diagnoses = DiagnosisSerializer(many=True)
    prescriptions = PrescriptionSerializer(many=True)

    class Meta:
        model = Treatment
        fields = [
            'id', 'treatment_notes', 'created_at', 'updated_at',
            'patient', 'patient_id', 'diagnoses', 'prescriptions'
        ]
    
    def create(self, validated_data):
        # Extract write-only patient_id
        patient_id = validated_data.pop('patient_id')
        diagnoses_data = validated_data.pop('diagnoses', [])
        prescriptions_data = validated_data.pop('prescriptions', [])
        
        # Get the Patient instance using the patient_id
        patient_instance = Patient.objects.get(patient_id=patient_id)
        
        # Create the Treatment instance
        treatment = Treatment.objects.create(patient=patient_instance, **validated_data)
        
        # Create and attach Diagnoses
        for diagnosis_data in diagnoses_data:
            # Use filter().first() to avoid duplicate issues
            diagnosis_qs = Diagnosis.objects.filter(patient=patient_instance, **diagnosis_data)
            diagnosis = diagnosis_qs.first()
            if not diagnosis:
                diagnosis = Diagnosis.objects.create(patient=patient_instance, **diagnosis_data)
            treatment.diagnoses.add(diagnosis)
        
        # Create and attach Prescriptions
        for prescription_data in prescriptions_data:
            prescription_qs = Prescription.objects.filter(patient=patient_instance, **prescription_data)
            prescription = prescription_qs.first()
            if not prescription:
                prescription = Prescription.objects.create(patient=patient_instance, **prescription_data)
            treatment.prescriptions.add(prescription)
        
        return treatment

