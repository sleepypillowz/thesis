import random
import string
from django.db import models
from datetime import date
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.conf import settings
from django.utils.text import slugify

from medicine.models import Medicine

# Create your models here.'
class Patient(models.Model):
    patient_id = models.CharField(max_length=50, unique=True, primary_key=True, editable=False)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=200)
    gender = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=11)
    date_of_birth = models.DateField(blank=True, null=True)
    street_address = models.CharField(max_length=100, blank=True, null=True)
    barangay = models.CharField(max_length=100, blank=True, null=True)
    municipal_city = models.CharField(max_length=100, blank=True, null=True)
     
    @property
    def full_name(self):
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name]))  
    def get_complaint(self):
        return dict(self.COMPLAINT_CHOICES).get(self.complaint, ' ')
    
    def get_age(self):
        today = date.today()
        age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return age
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
class Diagnosis(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='diagnosis')
    diagnosis_code = models.CharField(max_length=10, blank=True, null=True)  # ICD code, etc.
    diagnosis_description = models.TextField()
    diagnosis_date = models.DateField()

class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescription')
    medication = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(default=1)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
        
    def __str__(self):
        return f"{self.medication.name} ({self.quantity} x {self.dosage})"


class LabRequest(models.Model):
    
    STATUS_CHOICE = [
        ('Pending', 'Pending'),
        ('Submitted', 'Submitted'),
    ]

    id = models.CharField(max_length=8, unique=True, primary_key=True, editable=False)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lab_request")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_request')
    test_name = models.CharField(max_length=255, blank=True)  # For pre-defined tests
    custom_test = models.CharField(max_length=255, blank=True, null=True)  # For "Other"
    status = models.CharField(max_length=50, choices=STATUS_CHOICE, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        test = self.test_name if self.test_name else self.custom_test
        return f"LabRequest for Patient {self.patient_id} - {test}"
    
class LabResult(models.Model):
    id = models.CharField(max_length=8, unique=True, primary_key=True, editable=False)
    lab_request = models.OneToOneField(LabRequest, on_delete=models.CASCADE, related_name="result",         
        null=True,
        blank=True)
    image = models.ImageField(upload_to="lab_results/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lab_results",
        null=True,         # Allow null values
        blank=True         # Allow blank values
    )
    def __str__(self):
        return f"LabResult for {self.lab_request}"

    
@receiver(pre_save, sender=Patient)
def create_patient_id(sender, instance, **kwargs):
    if not instance.patient_id:
        raw_lastname = slugify(instance.last_name).lower()
        
        # Get the highest number used across ALL patients
        last_patient = Patient.objects.order_by('-patient_id').first()
        
        if last_patient and last_patient.patient_id:
            # Extract the numeric part from the last ID
            try:
                # Split the ID and get the number after last dash
                last_number = int(last_patient.patient_id.split('-')[-1][5:])
                current_count = last_number + 1
            except (ValueError, IndexError):
                # Fallback if parsing fails
                current_count = Patient.objects.count() + 90
        else:
            # First patient
            current_count = 90
            
        # Generate the new ID
        instance.patient_id = f'{raw_lastname}-02000{current_count}'

@receiver(pre_save, sender=LabRequest)
def set_lab_request_id(sender, instance, **kwargs):
    if not instance.id:
        instance.id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@receiver(pre_save, sender=LabResult)
def set_lab_result_id(sender, instance, **kwargs):
    if not instance.id:
        instance.id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))