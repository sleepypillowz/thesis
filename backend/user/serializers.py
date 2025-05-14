from rest_framework import serializers
from .models import UserAccount
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserAccount, Schedule, Doctor
from appointment.models import Appointment
import calendar
from django.db.models import Q

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Debugging: Print to ensure this method is called
        print("CustomTokenObtainPairSerializer: Creating token for", user.email, user.first_name)
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name
        return token
    
class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week = serializers.ChoiceField(
        choices=Schedule.DAYS_OF_WEEK
    )

    class Meta:
        model = Schedule
        fields = ['day_of_week', 'start_time', 'end_time']


class DoctorProfileSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, required=False)

    # Map calendar.day_name (Mon=0…Sun=6) → Django week_day (Sun=1…Sat=7)
    _WEEKDAY_MAP = {
        name: ((idx + 2) if idx < 6 else 1)
        for idx, name in enumerate(calendar.day_name)
    }

    class Meta:
        model = Doctor
        fields = ['specialization', 'schedules']

    def validate_schedules(self, schedules):
        def overlaps(a_start, a_end, b_start, b_end):
            return max(a_start, b_start) < min(a_end, b_end)

        # 1) Intra‐list overlap
        for i, s1 in enumerate(schedules):
            for s2 in schedules[i+1:]:
                if (s1['day_of_week'] == s2['day_of_week'] and
                    overlaps(s1['start_time'], s1['end_time'],
                             s2['start_time'], s2['end_time'])):
                    raise serializers.ValidationError(
                        f"{s1['day_of_week']} {s1['start_time']}–{s1['end_time']} "
                        f"overlaps {s2['start_time']}–{s2['end_time']}."
                    )

        # 2) Appointment‐conflict check (only on existing Doctor)
        if self.instance is not None:
            for slot in schedules:
                day_name = slot['day_of_week']
                day_int  = self._WEEKDAY_MAP.get(day_name)
                if not day_int:
                    raise serializers.ValidationError(f"Invalid day: {day_name}")

                conflict = Appointment.objects.filter(
                    Q(doctor=self.instance) &
                    Q(appointment_date__time__lt=slot['end_time']) &
                    Q(appointment_date__time__gt=slot['start_time']) &
                    Q(appointment_date__week_day=day_int)
                ).exists()

                if conflict:
                    raise serializers.ValidationError(
                        f"Cannot set schedule on {day_name} "
                        f"{slot['start_time']}–{slot['end_time']}: already booked."
                    )

        return schedules

    def update(self, instance, validated_data):
        # Pop off and handle schedules separately
        schedules_data = validated_data.pop('schedules', None)

        # 1) Update specialization (or other Doctor fields)
        instance.specialization = validated_data.get('specialization', instance.specialization)
        instance.save()

        # 2) If client provided schedules, replace them wholesale
        if schedules_data is not None:
            # Delete old slots
            instance.schedule.all().delete()
            # Create new ones
            for slot in schedules_data:
                Schedule.objects.create(
                    doctor=instance,
                    day_of_week=slot['day_of_week'],
                    start_time=slot['start_time'],
                    end_time=slot['end_time']
                )

        return instance
class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=UserAccount.ROLE_CHOICES, required=True)
    # Only doctors shoul*d include doctor_profile data.
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
        # 1) Extract nested doctor_profile
        profile_data = validated_data.pop('doctor_profile', None)

        # 2) Update user fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # 3) If doctor_profile provided, run its serializer
        if instance.role == 'doctor' and profile_data:
            # Get or create the Doctor instance
            doctor_obj, _ = Doctor.objects.get_or_create(user=instance)
            
            # Pass context so nested serializer can use request, etc.
            prof_serializer = DoctorProfileSerializer(
                instance=doctor_obj,
                data=profile_data,
                partial=True,
                context=self.context
            )
            # This runs validate_schedules(...) with schedules as list of dicts
            prof_serializer.is_valid(raise_exception=True)
            prof_serializer.save()
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