# from django.db import models
# from patient.models import Patient

# from django.conf import settings
# class Appointment(models.Model):
#     STATUS = (
#         ('Scheduled', 'Scheduled'),
#         ('Completed', 'Completed'),
#         ('Cancelled', 'Cancelled'),
#     )
#     patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
#     scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
#     appointment_date = models.DateTimeField()
#     status = models.CharField(max_length=20, choices=STATUS, default='Scheduled')
#     notes = models.TextField(max_length=250, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         ordering = ['appointment_date']

#     def __str__(self):
#         return f"Appointment {self.id} on {self.appointment_date} with {self.scheduled_by} for {self.patient}"
    