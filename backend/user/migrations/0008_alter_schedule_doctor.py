# Generated by Django 5.1.5 on 2025-04-19 15:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_alter_schedule_doctor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='schedule', to='user.doctor'),
        ),
    ]
