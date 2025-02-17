<<<<<<< HEAD
from datetime import date
from django.db import models
from patient.models import Patient
from  django.utils.timezone import now
=======


# Create your models here.
from django.db import models
from patient.models import Patient
>>>>>>> main
# Create your models here.
class TemporaryStorageQueue(models.Model):
    PRIORITY_CHOICES = [
        ('Regular', 'Regular'),
        ('Priority', 'Priority Lane (PWD/Pregnant)')
    ]


    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, to_field='patient_id', related_name='temporarystoragequeue' )
    priority_level = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Regular')
    created_at = models.DateTimeField(auto_now_add=True)
<<<<<<< HEAD
    status = models.CharField(
        max_length=50, 
        choices = [
            ('Waiting', 'Waiting'), 
            ('Being Assessed', 'Being Assessed'), 
            ('Queued for Treatment', 'Queued for Treatment'),
            ('Completed', 'Completed'),
        ], 
        default='Waiting')
    
    queue_number = models.PositiveBigIntegerField(null=True, blank=True)
    queue_date = models.DateField(default=date.today)

def save(self, *args, **kwargs):
    today = now().date()

    if not self.queue_number:
        last_queue_entry = TemporaryStorageQueue.objects.filter(
            priority_level=self.priority_level,
            queue_date=today
        ).order_by('-queue_number').first()  # Get the last queue entry

        # If there is no last queue entry, set queue_number to 1, otherwise increment the last one
        self.queue_number = (last_queue_entry.queue_number if last_queue_entry else 0) + 1
        self.queue_date = today

    super().save(*args, **kwargs)


    def __str__(self):
        return f"Patient {self.patient_id} - Queue {self.queue_number} ({self.priority_level})"

=======
    status = models.CharField(max_length=50, choices = [
        ('Waiting', 'Waiting'), 
        ('Being Assessed', 'Being Assessed'), 
        ('Queued for Treatment', 'Queued for Treatment'),
        ('Completed', 'Completed'),
        ], default='Waiting')
>>>>>>> main
    
class PreliminaryAssessment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, to_field='patient_id' )
    blood_pressure = models.CharField(max_length=200, blank=True, null=True)
    temperature = models.CharField(max_length=200, blank=True, null=True)
    heart_rate = models.CharField(max_length=200, blank=True, null=True)
    respiratory_rate = models.CharField(max_length=200, blank=True, null=True)
    pulse_rate = models.CharField(max_length=200, blank=True, null=True)
<<<<<<< HEAD
    allergies = models.TextField(max_length=500, blank=True, null=True)
    medical_history = models.TextField(max_length=500, blank=True, null=True)
    symptoms = models.TextField(max_length=200)
    current_medications = models.TextField(max_length=500, blank=True, null=True)
    current_symptoms = models.TextField(max_length=500, blank=True, null=True)
    pain_scale = models.CharField(max_length=200, blank=True, null=True)
    pain_location = models.CharField(max_length=200, blank=True, null=True)
    smoking_status = models.CharField(max_length=200, blank=True, null=True)
    alcohol_use = models.CharField(max_length=200, blank=True, null=True)
=======
    symptoms = models.TextField(max_length=200)
>>>>>>> main
    assessment = models.TextField(max_length=200, default='No assessment provided yet')
    assessment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        patient = Patient.objects.get(patient_id=self.patient_id) #Get patient from patient_id
        return f'Preliminary Assessment for {patient.first_name} {patient.last_name}'