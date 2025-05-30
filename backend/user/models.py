from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import random
import string
from django.db.models.signals import pre_save
from django.dispatch import receiver


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        return self.create_user(email, password, **kwargs)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=8, unique=True, primary_key=True, editable=False)
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('secretary', 'Medical Secretary'),
        ('admin', 'Admin'),
    ]
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='doctor')
    date_joined = models.DateTimeField(auto_now_add=True,  blank=True, null=True)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
@receiver(pre_save, sender=UserAccount)
def create_user_id(sender, instance, **kwargs):
    if not instance.id:
        instance.id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
class Doctor(models.Model):
    user = models.OneToOneField(
        UserAccount,
        on_delete=models.CASCADE,
        limit_choices_to={'role':'doctor'}
    )
    timezone = models.CharField(max_length=50, default='UTC')  # <-- Add this

    specialization = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}"
    
class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='schedule'
    )
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('doctor', 'day_of_week', 'start_time', 'end_time')

    def __str__(self):
        return f"{self.doctor.user.get_full_name()} - {self.day_of_week} {self.start_time} to {self.end_time}"
