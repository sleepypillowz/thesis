# serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
import calendar

from .models import UserAccount, Schedule, Doctor
from appointment.models import Appointment


# ---------------------------
# Custom JWT token serializer
# ---------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Debugging (optional)
        # print("CustomTokenObtainPairSerializer: Creating token for", user.email, getattr(user, "first_name", None))
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name
        return token


# ---------------------------
# Schedule serializer
# ---------------------------
class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week = serializers.ChoiceField(choices=Schedule.DAYS_OF_WEEK)

    class Meta:
        model = Schedule
        fields = ['day_of_week', 'start_time', 'end_time']


# ---------------------------
# Doctor (profile) serializer
# ---------------------------
class DoctorProfileSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, required=False)

    # calendar.day_name: Monday..Sunday
    _WEEKDAY_MAP = {
        name: ((idx + 2) if idx < 6 else 1)
        for idx, name in enumerate(calendar.day_name)
    }

    class Meta:
        model = Doctor
        fields = ['specialization', 'schedules']

    def validate_schedules(self, schedules):
        """
        1) checks for overlaps inside the submitted list
        2) when instance exists, checks for appointment conflicts
        """
        def overlaps(a_start, a_end, b_start, b_end):
            return max(a_start, b_start) < min(a_end, b_end)

        # 1) Intra-list overlap
        for i, s1 in enumerate(schedules):
            for s2 in schedules[i + 1:]:
                if (s1['day_of_week'] == s2['day_of_week'] and
                        overlaps(s1['start_time'], s1['end_time'],
                                 s2['start_time'], s2['end_time'])):
                    raise serializers.ValidationError(
                        f"{s1['day_of_week']} {s1['start_time']}–{s1['end_time']} "
                        f"overlaps {s2['start_time']}–{s2['end_time']}."
                    )

        # 2) Appointment-conflict check (only if updating an existing Doctor)
        if self.instance is not None:
            for slot in schedules:
                day_name = slot['day_of_week']
                day_int = self._WEEKDAY_MAP.get(day_name)
                if not day_int:
                    raise serializers.ValidationError(f"Invalid day: {day_name}")

                # Query for conflicting appointments for this doctor on that weekday and time range
                conflict = Appointment.objects.filter(
                    Q(doctor=self.instance) &
                    Q(appointment_date__time__lt=slot['end_time']) &
                    Q(appointment_date__time__gt=slot['start_time']) &
                    Q(appointment_date__week_day=day_int)
                ).exists()

                if conflict:
                    raise serializers.ValidationError(
                        f"Cannot set schedule on {day_name} {slot['start_time']}–{slot['end_time']}: already booked."
                    )

        return schedules

    def update(self, instance, validated_data):
        schedules_data = validated_data.pop('schedules', None)

        # Update specialization (or other fields)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # Replace schedules if provided
        if schedules_data is not None:
            # Delete old slots (use reverse relationship or fallback)
            # We use the queryset manager to be safe regardless of related_name
            Schedule.objects.filter(doctor=instance).delete()
            for slot in schedules_data:
                Schedule.objects.create(
                    doctor=instance,
                    day_of_week=slot['day_of_week'],
                    start_time=slot['start_time'],
                    end_time=slot['end_time']
                )

        return instance


# ---------------------------
# UserAccount serializer
# ---------------------------
class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=UserAccount.ROLE_CHOICES, required=True)
    # Accept nested profile on write; we'll serialize the actual profile in to_representation()
    doctor_profile = DoctorProfileSerializer(required=False)

    class Meta:
        model = UserAccount
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 're_password',
            'role', 'is_active', 'date_joined', 'doctor_profile'
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "is_active": {"read_only": True},
            "password": {"write_only": True},
            "re_password": {"write_only": True},
        }

    @staticmethod
    def _is_doctorish(role_value):
        """True if role represents any doctor-like role."""
        return bool(role_value) and 'doctor' in role_value.lower()

    def validate(self, attrs):
        # Passwords must match
        if attrs.get('password') != attrs.get('re_password'):
            raise serializers.ValidationError("Passwords do not match")

        # If role indicates doctor, require nested doctor_profile on creation
        # Note: during update the instance already has role; this check is primarily for create.
        if self._is_doctorish(attrs.get('role')) and not attrs.get('doctor_profile'):
            raise serializers.ValidationError({"doctor_profile": "This field is required for doctor roles."})
        return attrs

    def create(self, validated_data):
        doctor_profile_data = validated_data.pop('doctor_profile', None)
        validated_data.pop('re_password', None)
        password = validated_data.pop('password', None)

        # Create user safely using your model manager
        user = UserAccount.objects.create_user(password=password, **validated_data)

        # Create Doctor profile if necessary
        if self._is_doctorish(validated_data.get('role')) and doctor_profile_data:
            doctor = Doctor.objects.create(user=user, specialization=doctor_profile_data.get('specialization'))
            schedules_data = doctor_profile_data.get('schedules', [])
            for schedule in schedules_data:
                Schedule.objects.create(
                    doctor=doctor,
                    day_of_week=schedule['day_of_week'],
                    start_time=schedule['start_time'],
                    end_time=schedule['end_time']
                )
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('doctor_profile', None)

        # Update user fields (careful: do not blindly set password here)
        # Only update fields present in validated_data
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # If user is a doctorish role and profile_data provided, create or update the Doctor record
        if self._is_doctorish(instance.role) and profile_data:
            doctor_obj, _ = Doctor.objects.get_or_create(user=instance)
            prof_serializer = DoctorProfileSerializer(
                instance=doctor_obj,
                data=profile_data,
                partial=True,
                context=self.context
            )
            prof_serializer.is_valid(raise_exception=True)
            prof_serializer.save()

        return instance

    def to_representation(self, instance):
        """
        Build the default representation, then attach doctor_profile info if a Doctor record exists.
        This method is robust to different related_name values:
         - tries common reverse accessors ('doctor_profile', 'doctor')
         - falls back to a direct DB query if those attributes are absent
        """
        representation = super().to_representation(instance)

        # Try common reverse accessors; fallback to DB lookup
        doctor = getattr(instance, 'doctor_profile', None) or getattr(instance, 'doctor', None)
        if doctor is None:
            # final fallback: query the Doctor table
            try:
                doctor = Doctor.objects.filter(user=instance).first()
            except Exception:
                doctor = None

        if doctor:
            # Use Schedule queryset to avoid depending on reverse related_name
            schedules_qs = Schedule.objects.filter(doctor=doctor).all()
            representation['doctor_profile'] = {
                'specialization': getattr(doctor, 'specialization', None),
                'schedules': ScheduleSerializer(schedules_qs, many=True).data
            }
        else:
            representation['doctor_profile'] = None

        return representation
