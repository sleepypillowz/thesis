import random
import string
from django.db import models
from datetime import date
from django.db.models.signals import pre_save
from django.dispatch import receiver

# Create your models here.'
class Patient(models.Model):

    COMPLAINT_CHOICES = [
        ('general_illness', 'General Illness'),
        ('injury', 'Injury'),
        ('checkup', 'Check-up'),
        ('other', 'Other'),
    ]
    patient_id = models.CharField(max_length=8, unique=True, primary_key=True, editable=False)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=11)
    date_of_birth = models.DateField(blank=True, null=True)
    complaint = models.TextField(max_length=100, blank=True, null=True, choices= COMPLAINT_CHOICES)
    street_address = models.CharField(max_length=100, blank=True, null=True)
    barangay = models.CharField(max_length=100, blank=True, null=True)
    municipal_city = models.CharField(max_length=100, blank=True, null=True)
       
    def get_complaint(self):
        return dict(self.COMPLAINT_CHOICES).get(self.complaint, ' ')
    def get_age(self):
        today = date.today()
        age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return age
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
class Diagnosis(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='diagnoses')
    #diagnosis_name = 
    diagnosis_code = models.CharField(max_length=10, blank=True, null=True)  # ICD code, etc.
    diagnosis_description = models.TextField()
    diagnosis_date = models.DateField()

class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    medication = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    note = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

@receiver(pre_save, sender = Patient)
def create_patient_id(sender, instance, **kwargs):
    if not instance.patient_id:
        instance.patient_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

