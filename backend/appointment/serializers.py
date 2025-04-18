from rest_framework import serializers
from .models import Appointment, AppointmentReferral
from user.models import Doctor
from patient.serializers import PatientSerializer

# In your serializers.py
class AppointmentReferralSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppointmentReferral
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name')
    email = serializers.CharField(source='user.email')
    
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
