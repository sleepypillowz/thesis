# serializers.py
from rest_framework import serializers

from patient.models import Patient
from .models import Appointment, AppointmentReferral
from user.models import Doctor, UserAccount
from queueing.models import TemporaryStorageQueue


class BulkReferralListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        user = self.context['request'].user
        instances = []
        for item in validated_data:
            # receiving_doctor is a UserAccount instance
            receiving_doctor = item.pop('receiving_doctor')
            instances.append(
                AppointmentReferral(
                    referring_doctor=user,
                    receiving_doctor=receiving_doctor,
                    **item
                )
            )
        return AppointmentReferral.objects.bulk_create(instances)
class UserAccountSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = UserAccount
        fields = ['id', 'full_name', 'email', 'role']


class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name')
    email = serializers.CharField(source='user.email')
    id = serializers.IntegerField(source='user.id')
    role = serializers.IntegerField(source='user.role')   
    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'specialization', 'role','email']
        
class AppointmentReferralSerializer(serializers.ModelSerializer):
    referring_doctor = UserAccountSerializer(read_only=True)
    receiving_doctor = serializers.SlugRelatedField(
        slug_field='id',  # UserAccount ID
        queryset=UserAccount.objects.filter(role__in=['doctor', 'on-call-doctor'])
    )
    patient = serializers.SlugRelatedField(
        slug_field='patient_id',
        queryset=Patient.objects.all()
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

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        # Handling receiving_doctor
        if instance.receiving_doctor:
            try:
                doctor_profile = instance.receiving_doctor.doctor_profile
                ret['receiving_doctor'] = {
                    "id": doctor_profile.user.id,
                    "full_name": doctor_profile.user.get_full_name(),
                    "email": doctor_profile.user.email,
                    "role": doctor_profile.user.role,
                    "specialization": doctor_profile.specialization
                }
            except Doctor.DoesNotExist:
                ret['receiving_doctor'] = UserAccountSerializer(instance.receiving_doctor).data
        else:
            ret['receiving_doctor'] = None

        # Handling referring_doctor
        if instance.referring_doctor:
            try:
                doctor_profile = instance.referring_doctor.doctor_profile
                ret['referring_doctor'] = {
                    "id": doctor_profile.user.id,
                    "full_name": doctor_profile.user.get_full_name(),
                    "email": doctor_profile.user.email,
                    "role": doctor_profile.user.role,
                    "specialization": doctor_profile.specialization
                }
            except Doctor.DoesNotExist:
                ret['referring_doctor'] = UserAccountSerializer(instance.referring_doctor).data
        else:
            ret['referring_doctor'] = None

        return ret



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





class DoctorAvailabilitySerializer(serializers.Serializer):
    date = serializers.DateField()
    day_of_week = serializers.CharField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    is_available = serializers.BooleanField()
    datetime = serializers.CharField()
