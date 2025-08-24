from django.db import migrations

def migrate_name(apps, schema_editor):
    Patient = apps.get_model('patient', 'Patient')
    for patient in Patient.objects.all():
        parts = [patient.first_name, patient.middle_name, patient.last_name]
        full_name = " ".join([p for p in parts if p])  # join only non-empty parts
        patient.name = full_name.strip()
        patient.save(update_fields=["name"])  # only save name

class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0015_patient_name'),  # adjust to your actual migration filename
    ]

    operations = [
        migrations.RunPython(migrate_name, reverse_code=migrations.RunPython.noop),
    ]
