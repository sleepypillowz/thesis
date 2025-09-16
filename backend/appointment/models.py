from datetime import timedelta
from django.db import models
from patient.models import Patient
from user.models import Doctor

from django.conf import settings
class Appointment(models.Model):
    STATUS = (
        ('Scheduled', 'Scheduled'),
        ('Waiting', 'Waiting'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scheduled_appointments')
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS, default='Scheduled')
    notes = models.TextField(max_length=250, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #downpayment = 
    class Meta:
        ordering = ['appointment_date']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'appointment_date'],
                name='unique_appointment_per_doctor_and_slot'
            )
        ]

    def __str__(self):
        return f"Appointment {self.id} on {self.appointment_date} with {self.scheduled_by} for {self.patient}"

class AppointmentReferral(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Secretary Review'),
        ('scheduled', 'Appointment Scheduled'),
        ('completed', 'Referral Completed'),
        ('canceled', 'Canceled'),
    ]
    
    referring_doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='referrals_made',
        on_delete=models.CASCADE
    )

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='referrals')
    receiving_doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='referrals_received',
        on_delete=models.CASCADE,
        null=True, blank=True  # Receiving doctor may be assigned later by the secretary
    )
    reason = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    appointment = models.OneToOneField(Appointment, null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return f"Referral from {self.referring_doctor} to {self.receiving_doctor or 'Unassigned'} for {self.patient}"