from rest_framework import serializers
from .models import Appointment, AppointmentReferral
from user.models import Doctor, UserAccount
from patient.serializers import PatientSerializer

# In your serializers.py
class AppointmentReferralSerializer(serializers.ModelSerializer):
    referring_doctor = serializers.PrimaryKeyRelatedField(read_only=True)
    receiving_doctor = serializers.PrimaryKeyRelatedField(
        queryset=UserAccount.objects.filter(doctor__isnull=False)  # Use User model and filter doctors
    )
    appointment_date = serializers.DateTimeField(
        source='appointment.appointment_date',
        read_only=True
    )
    
    class Meta:
        model = AppointmentReferral
        fields = [
            'id', 'patient', 'receiving_doctor', 'reason', 'notes', 'referring_doctor', 'status', 'created_at', 'appointment_date'
        ]
        read_only_fields = ['id', 'referring_doctor']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name')
    email = serializers.CharField(source='user.email')
    id = serializers.IntegerField(source='user.id')  # Add user_id field

    
    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'specialization', 'email']
        
class DoctorAvailabilitySerializer(serializers.Serializer):
    date = serializers.DateField()
    day_of_week = serializers.CharField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    is_available = serializers.BooleanField()
    datetime = serializers.CharField()  # ISO format datetime string
