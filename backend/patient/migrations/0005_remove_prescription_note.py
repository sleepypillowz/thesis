# Generated by Django 5.1.5 on 2025-02-21 06:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0004_alter_patient_complaint'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescription',
            name='note',
        ),
    ]
