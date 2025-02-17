

# Create your models here.
from django.db import models
from patient.models import Patient
# Create your models here.
class TemporaryStorageQueue(models.Model):
    PRIORITY_CHOICES = [
        ('Regular', 'Regular'),
        ('Priority', 'Priority Lane (PWD/Pregnant)')
    ]


    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, to_field='patient_id', related_name='temporarystoragequeue' )
    priority_level = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Regular')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices = [
        ('Waiting', 'Waiting'), 
        ('Being Assessed', 'Being Assessed'), 
        ('Queued for Treatment', 'Queued for Treatment'),
        ('Completed', 'Completed'),
        ], default='Waiting')
    
class PreliminaryAssessment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, to_field='patient_id' )
    blood_pressure = models.CharField(max_length=200, blank=True, null=True)
    temperature = models.CharField(max_length=200, blank=True, null=True)
    heart_rate = models.CharField(max_length=200, blank=True, null=True)
    respiratory_rate = models.CharField(max_length=200, blank=True, null=True)
    pulse_rate = models.CharField(max_length=200, blank=True, null=True)
    symptoms = models.TextField(max_length=200)
    assessment = models.TextField(max_length=200, default='No assessment provided yet')
    assessment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        patient = Patient.objects.get(patient_id=self.patient_id) #Get patient from patient_id
        return f'Preliminary Assessment for {patient.first_name} {patient.last_name}'