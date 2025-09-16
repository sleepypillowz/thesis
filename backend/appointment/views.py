from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.utils.dateparse import parse_datetime

from .models import AppointmentReferral
from patient.models import Patient
from .serializers import AppointmentReferralSerializer, AppointmentSerializer
from user.permissions import isDoctor, isSecretary

from django.utils import timezone
from datetime import date
from django.utils.timezone import now, localdate
from datetime import datetime, timedelta
from .models import Appointment

from user.models import Doctor, UserAccount, Schedule
from user.models import UserAccount 
from user.permissions import IsReferralParticipant, IsMedicalStaff

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from patient.serializers import PatientSerializer
from django.db import IntegrityError
import pytz
from dateutil.relativedelta import relativedelta  # <-- Add this
from dateutil.relativedelta import MO, TU, WE, TH, FR, SA, SU

class DoctorCreateReferralView(APIView):
    permission_classes = [isDoctor]

    def post(self, request):
        payload = request.data
        
        # check if payload is bulk or dict
        is_bulk = isinstance(payload, list)

        serializer = AppointmentReferralSerializer(
            data = payload,
            many=is_bulk,
            context={'request': request}
        )
        
        serializer.is_valid(raise_exception=True)
        created = serializer.save()
        
        if is_bulk:
            output = AppointmentReferralSerializer(created, many=True).data
        else:
            output = AppointmentReferralSerializer(created).data
        
        return Response(output, status=status.HTTP_201_CREATED)
        
class ReferralViewList(APIView):
    permission_classes = [isSecretary]
    def get(self, request):
        referrals = AppointmentReferral.objects.filter(status='pending')
        serializer = AppointmentReferralSerializer(referrals, many=True)
        return Response(serializer.data)
class DoctorSchedule(APIView):
    permission_classes = [isSecretary]

    def get(self, request, doctor_id):
        try:
            # Step 1: Get UserAccount (using the provided user ID)
            user = UserAccount.objects.get(id=doctor_id, role='doctor')
            
            # Step 2: Get the Doctor instance linked to the UserAccount
            doctor = user.doctor  # Directly access via OneToOneField
            
            # Step 3: Get all schedules for this doctor
            schedules = Schedule.objects.filter(doctor=doctor)
            
            # Step 4: Generate availability slots based on the schedules
            availability = []
            doctor_tz = pytz.timezone(doctor.timezone)
            now = timezone.now().astimezone(doctor_tz)

            for schedule in schedules:
                # For each scheduled day (e.g., Tuesday), generate slots for the next 12 weeks
                day_name = schedule.day_of_week
                start_time = schedule.start_time
                end_time = schedule.end_time

                # Generate slots for this day for the next 12 weeks
                for week in range(12):
                    # Find the next occurrence of this day (e.g., Tuesday)
                    next_day = now + relativedelta(
                        weeks=week, 
                        weekday=day_to_weekday(day_name),  # Helper function
                        hour=start_time.hour,
                        minute=start_time.minute,
                        second=0,
                        microsecond=0
                    )
                    
                    # Generate time slots for this day
                    current_slot = next_day
                    while current_slot.time() < end_time:
                        slot_end = current_slot + timedelta(minutes=30)
                        
                        # Check if slot is available
                        is_available = not Appointment.objects.filter(
                            doctor=doctor,
                            appointment_date__gte=current_slot.astimezone(pytz.UTC),
                            appointment_date__lt=slot_end.astimezone(pytz.UTC),
                            status='Scheduled'
                        ).exists()
                        
                        availability.append({
                            "start": current_slot.astimezone(pytz.UTC).isoformat(),
                            "end": slot_end.astimezone(pytz.UTC).isoformat(),
                            "is_available": is_available
                        })
                        
                        current_slot = slot_end

            return Response({
                "doctor_id": user.id,
                "doctor_name": user.get_full_name(),
                "timezone": doctor.timezone,
                "specialization": doctor.specialization,
                "availability": availability
            })

        except UserAccount.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=404)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)
    
def day_to_weekday(day_name):
    return {
        'Monday': MO(-1),
        'Tuesday': TU(-1),
        'Wednesday': WE(-1),
        'Thursday': TH(-1),
        'Friday': FR(-1),
        'Saturday': SA(-1),
        'Sunday': SU(-1)
    }[day_name]    
        
class ScheduleAppointment(APIView):
    permission_classes = [isSecretary]

    def post(self, request):
        data = request.data
        print('data', data)
        referral_id = data.get("referral_id")
        appointment_date_str = data.get("appointment_date")

        if not referral_id or not appointment_date_str:
            return Response(
                {"error": "Both referral_id and appointment_date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            referral = AppointmentReferral.objects.get(id=referral_id)
            doctor = referral.receiving_doctor.doctor
            doctor_tz = pytz.timezone(doctor.timezone)
        except (AppointmentReferral.DoesNotExist, Doctor.DoesNotExist):
            return Response({"error": "Invalid referral"}, status=status.HTTP_404_NOT_FOUND)

        # Parse datetime
        try:
            # Handle both naive and aware datetimes
            if 'Z' in appointment_date_str:
                appointment_date = datetime.fromisoformat(appointment_date_str.replace('Z', '+00:00'))
            else:
                appointment_date = datetime.fromisoformat(appointment_date_str)
        except ValueError:
            return Response({"error": "Invalid ISO datetime format"}, status=400)

        # Convert to doctor's timezone and UTC
        try:
            if appointment_date.tzinfo is None:  # Naive datetime
                appointment_date_doctor = doctor_tz.localize(appointment_date)
            else:  # Aware datetime - convert directly
                appointment_date_doctor = appointment_date.astimezone(doctor_tz)
                
            appointment_date_utc = appointment_date_doctor.astimezone(pytz.UTC)
        except (pytz.exceptions.NonExistentTimeError, pytz.exceptions.AmbiguousTimeError):
            return Response({"error": "Invalid time due to DST transition"}, status=400)

        # Validate slot alignment
        if (appointment_date_doctor.minute % 30 != 0 or 
            appointment_date_doctor.second != 0 or 
            appointment_date_doctor.microsecond != 0):
            return Response({"error": "Appointments must start at :00 or :30"}, status=400)

        # Check doctor's schedule
        day_of_week = appointment_date_doctor.strftime('%A')
        schedule_exists = doctor.schedule.filter(
            day_of_week=day_of_week,
            start_time__lte=appointment_date_doctor.time(),
            end_time__gte=(appointment_date_doctor + timedelta(minutes=30)).time()
        ).exists()
        
        if not schedule_exists:
            return Response({"error": "Doctor not available at this time"}, status=400)

        # Check for conflicts using calculated end time
        calculated_end_utc = appointment_date_utc + timedelta(minutes=30)
        conflict = Appointment.objects.filter(
            doctor=doctor,
            appointment_date__lt=calculated_end_utc,
            appointment_date__gte=appointment_date_utc - timedelta(minutes=29)  # 1-minute buffer
        ).exists()

        if conflict:
            return Response({"error": "Time slot is already booked"}, status=status.HTTP_409_CONFLICT)

        # Create appointment
        try:
            appointment = Appointment.objects.create(
                patient=referral.patient,
                doctor=doctor,
                scheduled_by=request.user,
                appointment_date=appointment_date_utc,
                status='Scheduled'
            )
        except IntegrityError:
            return Response({"error": "Appointment conflict detected"}, status=status.HTTP_409_CONFLICT)

        # Update referral
        referral.appointment = appointment
        referral.status = 'scheduled'
        referral.save()

        return Response({
            "message": "Appointment scheduled successfully",
            "appointment_id": appointment.id,
            "appointment_date_utc": appointment.appointment_date.isoformat(),
            "appointment_date_local": appointment_date_doctor.isoformat()
        }, status=status.HTTP_201_CREATED)
        
# only referral participants can access this
class AppointmentReferralViewSet(viewsets.ModelViewSet):
       
    serializer_class = AppointmentReferralSerializer
    permission_classes = [IsAuthenticated, IsReferralParticipant]
    def get_queryset(self):
        user = self.request.user
        return AppointmentReferral.objects.filter(
            Q(referring_doctor=user) | Q(receiving_doctor=user)
        ).select_related('patient').order_by('-created_at')

    
    def perform_create(self, serializer):
        serializer.save(referring_doctor=self.request.user)
    
    @action(detail=True, methods=['patch'], url_path='decline')
    def decline_referral(self, request, pk=None):
        referral = self.get_object()
        if referral.receiving_doctor != request.user:
            return Response(
                {'detail': 'Only the receiving doctor can decline this referral.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        appointment = getattr(referral, 'appointment', None)

        if appointment:
            appointment.status = 'cancelled'
            appointment.save()
        
        referral.status='cancelled'
        referral.save()
        serializer = self.get_serializer(referral)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='patient-info')
    def get_patient_info(self, request, pk=None):
        referral = self.get_object()
        if referral.receiving_doctor != request.user:
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PatientSerializer(referral.patient)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpcomingAppointments(APIView):
    permission_classes = [IsMedicalStaff]
    
    def get(self, request):
        date_today = localdate() 
        current_time = now()
        
        role = getattr(request.user, "role", None)
        print(current_time, date_today)
        if role == 'secretary' or request.user.id == 'LFG4YJ2P':         
            appointments_today = Appointment.objects.filter(
                status = "Scheduled",
                appointment_date__date=date_today,
                appointment_date__gte=current_time
            )
      
        serializer = AppointmentSerializer(appointments_today, many=True)
        return Response(serializer.data)