from datetime import date
from django.db import models
from patient.models import Patient, Diagnosis, Prescription
from  django.utils.timezone import now
from django.conf import settings
from user.models import UserAccount
# Create your models here.
from django.db import models
from django.utils.timezone import now
from patient.models import Patient
from django.db.models import Max

class TemporaryStorageQueue(models.Model):
    PRIORITY_CHOICES = [
        ('Regular', 'Regular'),
        ('Priority', 'Priority Lane (PWD/Pregnant)'),
    ]
    COMPLAINT_CHOICES = [
        ('General Illness', 'General Illness'),
        ('Injury', 'Injury'),
        ('Check-up', 'Check-up'),
        ('Other', 'Other'),
    ]
    priority_level = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default='Regular'
    )
    complaint = models.TextField(
        max_length=100,
        blank=True,
        null=True,
        choices=COMPLAINT_CHOICES,
        help_text="Either one of the predefined choices, or a custom text when 'Other'"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Waiting', 'Waiting'),
            ('Queued for Assessment', 'Queued for Assessment'),
            ('Queued for Treatment', 'Queued for Treatment'),
            ('Ongoing for Laboratory', 'Ongoing for Laboratory'),
            ('Ongoing for Treatment', 'Ongoing for Treatment'),
            ('Completed', 'Completed'),
        ],
        default='Waiting'
    )
    queue_number = models.PositiveBigIntegerField(null=True, blank=True)
    queue_date = models.DateField(default=date.today)
    position = models.IntegerField(default=0, db_index=True)
    
    is_new_patient = models.BooleanField(default=False)

    # Temporary patient data
    temp_first_name = models.CharField(max_length=100, blank=True, null=True)
    temp_middle_name = models.CharField(max_length=100, blank=True, null=True)
    temp_last_name = models.CharField(max_length=100, blank=True, null=True)
    temp_email = models.EmailField(blank=True, null=True)
    temp_phone_number = models.CharField(max_length=15, blank=True, null=True)
    temp_date_of_birth = models.DateField(blank=True, null=True)
    temp_gender = models.CharField(max_length=10, blank=True, null=True)
    temp_street_address = models.TextField(blank=True, null=True)
    temp_barangay = models.CharField(max_length=100, blank=True, null=True)
    temp_municipal_city = models.CharField(max_length=100, blank=True, null=True)
    
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='temporarystoragequeue',
        null=True,
        blank=True
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="temp_patient_profile",
        limit_choices_to={"role": "patient"},
    )

    def save(self, *args, **kwargs):
        # Only auto-generate queue_number when it is not supplied
        if self.queue_number is None:
            # get the max queue_number for the same date, handle None safely
            max_q = TemporaryStorageQueue.objects.filter(
                queue_date=self.queue_date
            ).aggregate(Max('queue_number'))['queue_number__max'] or 0

            self.queue_number = max_q + 1

        super().save(*args, **kwargs)
        
    def get_age(self):
        if not self.date_of_birth:
            return None
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
        
    @property
    def display_name(self):
        if self.patient:
            return self.patient.full_name
        return f"{self.temp_first_name or ''} {self.temp_last_name or ''}".strip()

    def __str__(self):
        if self.user and hasattr(self.user, "patient_profile"):
            patient_id = self.user.patient_profile.patient_id
            name = self.user.patient_profile.full_name
        else:
            patient_id = "TEMP"
            name = f"{self.temp_first_name or ''} {self.temp_last_name or ''}".strip()

        return f"Patient {name} ({patient_id}) - Queue {self.queue_number} ({self.priority_level})"



    
class PreliminaryAssessment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, to_field='patient_id', related_name='preliminaryassessment' )
    blood_pressure = models.CharField(max_length=200, blank=True, null=True)
    temperature = models.CharField(max_length=200, blank=True, null=True)
    heart_rate = models.CharField(max_length=200, blank=True, null=True)
    respiratory_rate = models.CharField(max_length=200, blank=True, null=True)
    pulse_rate = models.CharField(max_length=200, blank=True, null=True)
    allergies = models.TextField(max_length=500, blank=True, null=True)
    medical_history = models.TextField(max_length=500, blank=True, null=True)
    symptoms = models.TextField(max_length=200)
    current_medications = models.TextField(max_length=500, blank=True, null=True)
    pain_scale = models.CharField(max_length=200, blank=True, null=True)
    pain_location = models.CharField(max_length=200, blank=True, null=True)
    smoking_status = models.CharField(max_length=200, blank=True, null=True)
    alcohol_use = models.CharField(max_length=200, blank=True, null=True)
    assessment = models.TextField(max_length=200,blank=True, null=True)
    assessment_date = models.DateTimeField(auto_now_add=True)
    
class TreatmentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('patient', 'doctor')
class Treatment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="treatments")
    doctor = models.ForeignKey(
        UserAccount,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='treatments',
    )

    diagnoses = models.ManyToManyField(Diagnosis, related_name="treatments")
    prescriptions = models.ManyToManyField(Prescription, related_name="treatments")
    treatment_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  
    objects = TreatmentManager()
    def __str__(self):
        return f"Treatment for {self.patient.first_name} {self.patient.last_name}"