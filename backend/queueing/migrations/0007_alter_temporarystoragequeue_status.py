# Generated by Django 5.1.5 on 2025-02-21 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('queueing', '0006_treatment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='temporarystoragequeue',
            name='status',
            field=models.CharField(choices=[('Waiting', 'Waiting'), ('Queued for Assessment', 'Queued for Assessment'), ('Queued for Treatment', 'Queued for Treatment'), ('Completed', 'Completed')], default='Waiting', max_length=50),
        ),
    ]
