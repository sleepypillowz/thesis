from rest_framework import serializers
from .models import UserAccount
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserAccount, Schedule, Doctor
from django.contrib.auth import get_user_model

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Debug: Print to ensure this method is called
        print("CustomTokenObtainPairSerializer: Creating token for", user.email, user.first_name)
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name  # Add first_name to the token
        return token
    
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['day_of_week', 'start_time', 'end_time']

class DoctorProfileSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, required=False)

    class Meta:
        model = Doctor
        fields = ['specialization', 'schedules']

class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=UserAccount.ROLE_CHOICES, required=True)
    # Only doctors should include doctor_profile data.
    doctor_profile = DoctorProfileSerializer(required=False)

    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 're_password', 'role', 'is_active', 'date_joined', 'doctor_profile']
        extra_kwargs = {
            "id": {"read_only": True},
            "is_active": {"read_only": True},
            "password": {"write_only": True},
            "re_password": {"write_only": True},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('re_password'):
            raise serializers.ValidationError("Passwords do not match")
        # If role is doctor, ensure doctor_profile is provided.
        if attrs.get('role') == 'doctor' and not attrs.get('doctor_profile'):
            raise serializers.ValidationError({"doctor_profile": "This field is required for doctors."})
        return attrs

    def create(self, validated_data):
        # Pop nested doctor_profile data if present.
        doctor_profile_data = validated_data.pop('doctor_profile', None)
        validated_data.pop('re_password', None)
        password = validated_data.pop('password')
        user = UserAccount.objects.create_user(password=password, **validated_data)
        
        # If role is doctor, create a Doctor profile and schedules.
        if validated_data.get('role') == 'doctor' and doctor_profile_data:
            # Create the Doctor instance. This must be a Doctor instance.
            doctor = Doctor.objects.create(user=user, specialization=doctor_profile_data['specialization'])
            schedules_data = doctor_profile_data.get('schedules', [])
            # Here, since Schedule.doctor expects a Doctor instance, we pass 'doctor'
            for schedule in schedules_data:
                Schedule.objects.create(
                    doctor=doctor,
                    day_of_week=schedule['day_of_week'],
                    start_time=schedule['start_time'],
                    end_time=schedule['end_time']
                )
        return user
    
    def update(self, instance, validated_data):
        doctor_profile_data = validated_data.pop('doctor_profile', None)

        validated_data.pop('password', None)
        validated_data.pop('re_password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if instance.role == 'doctor' and doctor_profile_data:
            doctor_obj = Doctor.objects.get_or_create(user=instance)
            doctor_obj, _ = Doctor.objects.get_or_create(user=instance)
            doctor_obj.specialization = doctor_profile_data["specialization"]
            doctor_obj.save()

            # b) Replace schedules wholesale (you could diff/patch instead)
            #    First, delete existing schedules
            doctor_obj.schedule.all().delete()

            #    Then recreate from incoming data
            for sched in doctor_profile_data.get("schedules", []):
                Schedule.objects.create(
                    doctor=doctor_obj,
                    day_of_week=sched["day_of_week"],
                    start_time=sched["start_time"],
                    end_time=sched["end_time"],
                )

        return instance
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Optionally include doctor profile info if the user is a doctor.
        if instance.role == 'doctor':
            try:
                doctor = instance.doctor
                # You can serialize additional fields here if desired.
                representation['doctor_profile'] = {
                    'specialization': doctor.specialization,
                    # If you want to include schedules, you can serialize them:
                    'schedules': ScheduleSerializer(doctor.schedule.all(), many=True).data
                }
            except Exception:
                representation['doctor_profile'] = None
        return representation