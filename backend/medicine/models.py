from django.db import models

# Create your models here.
class Medicine(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    dosage_form = models.CharField(max_length=255)
    strength = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
    indication = models.TextField()
    classification = models.CharField(max_length=255)
    stocks = models.PositiveIntegerField(default=0)
    expiration_date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.strength}) - {self.stocks} left"