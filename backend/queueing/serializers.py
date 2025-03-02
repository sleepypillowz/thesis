from rest_framework import serializers
from .models import TemporaryStorageQueue, PreliminaryAssessment, Treatment
from patient.serializers import DiagnosisSerializer, PrescriptionSerializer, PatientSerializer
from patient.models import Diagnosis, Patient, Prescription

from rest_framework import serializers
from queueing.models import TemporaryStorageQueue

class TemporaryStorageQueueSerializer(serializers.ModelSerializer):
    priority_level = serializers.ChoiceField(
        choices=[('Regular', 'Regular'), ('Priority', 'Priority')],
        default='Regular'
    )
    queue_number = serializers.SerializerMethodField()
    queue_data = serializers.SerializerMethodField()
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

    class Meta:
        model = TemporaryStorageQueue
        fields = [
            'id', 'queue_number', 'patient', 'priority_level', 
            'complaint', 'queue_data', 'created_at', 'status'
        ]

    def get_queue_number(self, obj):
        queue = TemporaryStorageQueue.objects.filter(
            priority_level=obj.priority_level, status='Waiting'
        ).order_by('created_at')
        queue_list = list(queue)
        return f'#{queue_list.index(obj) + 1}' if obj in queue_list else 'N/A'
    
    def get_queue_data(self, obj):
        """Fetch queue data for the patient using the correct related manager."""
        # Access the patient's related temporary storage queues via the defined related_name.
        queue_info = obj.patient.temporarystoragequeue.filter(status='Waiting').first()
        if queue_info:
            return {
                'id': queue_info.id,
                'priority_level': queue_info.priority_level,
                'status': queue_info.status,
                'created_at': queue_info.created_at,
                'complaint': queue_info.complaint,
            }
        return None

    def get_complaint_display(self, obj):
        if isinstance(obj, dict):
            complaint = obj.get('complaint')
        else:
            complaint = getattr(obj, 'complaint', None)
        choices = dict(self.fields['complaint'].choices)
        return choices.get(complaint, 'Unknown')


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


# use to print teh basic information of the patient preliminary
class PreliminaryAssessmentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreliminaryAssessment
        fields = [
            'blood_pressure', 'temperature', 'heart_rate', 
            'respiratory_rate', 'pulse_rate', 'allergies', 'medical_history',
            'symptoms', 'current_medications',
            'pain_scale', 'pain_location', 'smoking_status', 'alcohol_use', 'assessment'
        ]

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
        # Extract write-only patient_id, diagnoses, and prescriptions data.
        patient_id = validated_data.pop('patient_id')
        diagnoses_data = validated_data.pop('diagnoses', [])
        prescriptions_data = validated_data.pop('prescriptions', [])

        try:
            patient_instance = Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient with the given ID does not exist")

        try:
            # Create Treatment instance without passing a 'queue' argument.
            treatment = Treatment.objects.create(patient=patient_instance, **validated_data)
        except Exception as e:
            print("Error creating Treatment:", e)
            raise serializers.ValidationError(f"Treatment creation error: {e}")

        # Create and attach Diagnoses.
        for diagnosis_data in diagnoses_data:
            try:
                diagnosis, _ = Diagnosis.objects.get_or_create(
                    patient=patient_instance, **diagnosis_data
                )
                treatment.diagnoses.add(diagnosis)
            except Exception as e:
                print("Error processing diagnosis data:", diagnosis_data, e)
                raise serializers.ValidationError(f"Diagnosis error: {e}")

        # Create and attach Prescriptions.
        for prescription_data in prescriptions_data:
            try:
                prescription, _ = Prescription.objects.get_or_create(
                    patient=patient_instance, **prescription_data
                )
                treatment.prescriptions.add(prescription)
            except Exception as e:
                print("Error processing prescription data:", prescription_data, e)
                raise serializers.ValidationError(f"Prescription error: {e}")

        return treatment
