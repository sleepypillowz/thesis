from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.utils.dateparse import parse_datetime

from .models import AppointmentReferral
from patient.models import Patient
from .serializers import AppointmentReferralSerializer
from user.permissions import isDoctor, isSecretary

from django.utils import timezone
from datetime import datetime, timedelta
from .models import Appointment

from user.models import Doctor, UserAccount
from user.models import UserAccount 
from user.permissions import IsReferralParticipant


from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from patient.serializers import PatientSerializer


class DoctorCreateReferralView(APIView):
    permission_classes = [isDoctor]

    def post(self, request):
        serializer = AppointmentReferralSerializer(data=request.data)
        if serializer.is_valid():
            try:
                patient = Patient.objects.get(patient_id=request.data['patient'])
            except Patient.DoesNotExist:
                return Response({"error": "Patient not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            referral = AppointmentReferral.objects.create(
                referring_doctor=request.user,
                patient=patient,
                receiving_doctor=serializer.validated_data['receiving_doctor'],
                reason=serializer.validated_data['reason'],
                notes=serializer.validated_data.get('notes', '')
            )
            return Response(AppointmentReferralSerializer(referral).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReferralViewList(APIView):
    permission_classes = [isSecretary]
    def get(self, request):
        referrals = AppointmentReferral.objects.filter(status='pending')
        serializer = AppointmentReferralSerializer(referrals, many=True)
        return Response(serializer.data)

class DoctorSchedule(APIView):
    permission_classes = [isSecretary]
    
    def get(self, request, doctor_id):
        # Retrieve the UserAccount and then the related Doctor profile
        try:
            user = UserAccount.objects.get(id=doctor_id, role='doctor')
            doctor = user.doctor  # Access the one-to-one relation to Doctor
        except UserAccount.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Default date range (next 3 months)
        start_date = timezone.now().date()
        end_date = start_date + timedelta(days=90)
        
        # Get query parameters for custom date range
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        try:
            if start_date_str:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            if end_date_str:
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Retrieve schedules directly from the Doctor profile
        schedules = doctor.schedule.all()
        
        availability = []
        current_date = start_date
        
        while current_date <= end_date:
            day_of_week = current_date.strftime('%A')
            day_schedules = schedules.filter(day_of_week=day_of_week)
            
            for schedule in day_schedules:
                # Create timezone-aware datetime objects for the schedule start and end times
                slot_start = timezone.make_aware(datetime.combine(current_date, schedule.start_time))
                slot_end = timezone.make_aware(datetime.combine(current_date, schedule.end_time))
                
                # Generate 30-minute slots within the schedule
                current_slot = slot_start
                while current_slot + timedelta(minutes=30) <= slot_end:
                    slot_end_time = current_slot + timedelta(minutes=30)
                    
                    # Check for existing appointments in the current slot
                    existing_appointment = Appointment.objects.filter(
                        doctor=doctor,
                        appointment_date__gte=current_slot,
                        appointment_date__lt=slot_end_time
                    ).exists()
                    
                    # Only include future available slots
                    if not existing_appointment and current_slot > timezone.now():
                        availability.append({
                            'date': current_date.isoformat(),
                            'day_of_week': day_of_week,
                            'start_time': current_slot.time().strftime('%H:%M:%S'),
                            'end_time': slot_end_time.time().strftime('%H:%M:%S'),
                            'is_available': True
                        })
                    
                    current_slot = slot_end_time
            
            current_date += timedelta(days=1)
        
        doctor_data = {
            'id': doctor.user.id,
            'full_name': doctor.user.get_full_name(),
            'specialization': doctor.specialization,
            'email': doctor.user.email,
            'availability': availability
        }
        
        return Response(doctor_data)

class ScheduleAppointment(APIView):
    permission_classes = [isSecretary]

    def post(self, request):
        data = request.data
        referral_id = data.get("referral_id")
        appointment_date_str = data.get("appointment_date")

        if not referral_id:
            return Response({"error": "referral_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not appointment_date_str:
            return Response({"error": "appointment_date is required."}, status=status.HTTP_400_BAD_REQUEST)
        print('data ito: ',request.data)
        
        appointment_date = parse_datetime(appointment_date_str)
        if appointment_date is None:
            return Response({"error": "Invalid appointment_date format. Use ISO format."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            referral = AppointmentReferral.objects.get(id=referral_id)
        except AppointmentReferral.DoesNotExist:
            return Response({"error": "Referral not found."}, status=status.HTTP_404_NOT_FOUND)

        
        receiving_doctor_id = referral.receiving_doctor.id
        
        try:
            doctor = Doctor.objects.get(user__id=receiving_doctor_id, user__role='doctor')
        except Doctor.DoesNotExist:
            return Response({"error": "Receiving doctor not found."}, status=status.HTTP_404_NOT_FOUND)

        # The patient is obtained from the referral
        patient = referral.patient
        # The secretary who is scheduling is the current user
        scheduled_by = request.user

        # Create the appointment
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            scheduled_by=scheduled_by,
            appointment_date=appointment_date,
            status="Scheduled",  # or use the default status
        )

        # Update the referral to link the new appointment and change its status
        referral.appointment = appointment
        referral.status = "scheduled"
        referral.save()

        return Response({
            "message": "Appointment scheduled successfully.",
            "appointment_id": appointment.id,
            "appointment_date": appointment.appointment_date
        }, status=status.HTTP_201_CREATED)
        


# only referral participants can access this
class AppointmentReferralViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing doctor referrals.
    Both the referring doctor (sender) and the receiving doctor (recipient) can view,
    update, or delete a referral. The receiving doctor also has custom actions to accept
    or decline the referral.
    """
    
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
        if referral.receiving_doctor  != request.user:
            return Response(
                {'detail': 'Only the receiving doctor can accept this referral.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        referral.status = 'cancelled'
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