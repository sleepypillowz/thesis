import csv
from django.core.management.base import BaseCommand, CommandError
from medicine.models import Medicine  # Adjust the import based on your actual model location

class Command(BaseCommand):
    help = 'Import medicines from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        try:
            with open(csv_file, newline='') as file:
                reader = csv.DictReader(file)
                medicines = [
                    Medicine(
                        name=row['Name'],
                        category=row['Category'],
                        dosage_form=row['Dosage Form'],
                        strength=row['Strength'],
                        manufacturer=row['Manufacturer'],
                        indication=row['Indication'],
                        classification=row['Classification'],
                        stocks=row['Stock'],
                        expiration_date=row['Expiration Date']
                    )
                    for row in reader
                ]
                Medicine.objects.bulk_create(medicines)
            self.stdout.write(self.style.SUCCESS('Medicines imported successfully'))
        except FileNotFoundError:
            raise CommandError(f'File "{csv_file}" does not exist')
