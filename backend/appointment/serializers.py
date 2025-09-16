# serializers.py
from rest_framework import serializers
from .models import Appointment, AppointmentReferral
from user.models import Doctor, UserAccount
from patient.serializers import PatientSerializer
from queueing.models import TemporaryStorageQueue


class BulkReferralListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        instances = [
            AppointmentReferral(referring_doctor=user, **item)
            for item in validated_data
        ]
        return AppointmentReferral.objects.bulk_create(instances)


class AppointmentReferralSerializer(serializers.ModelSerializer):
    referring_doctor = serializers.PrimaryKeyRelatedField(read_only=True)
    receiving_doctor = serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(doctor__isnull=False)
    )
    appointment_date = serializers.DateTimeField(
        source='appointment.appointment_date',
        read_only=True,
        format='%Y-%m-%dT%H:%M:%S'
    )

    class Meta:
        model = AppointmentReferral
        fields = [
            'id', 'patient', 'receiving_doctor', 'reason', 'notes',
            'referring_doctor', 'status', 'created_at', 'appointment_date'
        ]
        read_only_fields = ['id', 'referring_doctor']
        list_serializer_class = BulkReferralListSerializer

    def create(self, validated_data):
        validated_data['referring_doctor'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentSerializer(serializers.ModelSerializer):
    # use a method field so it's robust to different patient model shapes
    doctor_name = serializers.CharField(source="doctor.user.get_full_name", read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id", "patient", "patient_name", "doctor", "doctor_name",
            "appointment_date", "status", "notes"
        ]

    def get_patient_name(self, obj):
        patient = getattr(obj, "patient", None)
        if not patient:
            return ""
        # try common methods/attributes safely
        if callable(getattr(patient, "get_full_name", None)):
            try:
                return patient.get_full_name()
            except Exception:
                pass
        for attr in ("full_name", "name", "first_name", "display_name"):
            val = getattr(patient, attr, None)
            if val:
                return val
        return str(patient)


class QueueSerializer(serializers.ModelSerializer):
    # represent patient as a scalar PK (safe) OR nest PatientSerializer if you need more fields
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    # robustly compute a display name for the patient
    patient_name = serializers.SerializerMethodField()
    # include position for ordering/visibility
    position = serializers.IntegerField(read_only=True)

    class Meta:
        model = TemporaryStorageQueue
        fields = [
            "id", "patient", "patient_name", "priority_level",
            "queue_number", "status", "queue_date", "position"
        ]

    def get_patient_name(self, obj):
        patient = getattr(obj, "patient", None)
        if not patient:
            return ""
        # prefer a full-name method if present
        if callable(getattr(patient, "get_full_name", None)):
            try:
                return patient.get_full_name()
            except Exception:
                pass
        for attr in ("full_name", "name", "first_name", "display_name"):
            val = getattr(patient, attr, None)
            if val:
                return val
        return str(patient)


class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name')
    email = serializers.CharField(source='user.email')
    id = serializers.IntegerField(source='user.id')

    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'specialization', 'email']


class DoctorAvailabilitySerializer(serializers.Serializer):
    date = serializers.DateField()
    day_of_week = serializers.CharField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    is_available = serializers.BooleanField()
    datetime = serializers.CharField()
