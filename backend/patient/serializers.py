
from datetime import datetime, date
from rest_framework import serializers

class PatientSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=8)
    first_name = serializers.CharField(max_length=200, allow_blank=True, required=False)
    middle_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=200)
    age = serializers.SerializerMethodField() # Add this line

    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=11)
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    complaint = serializers.ChoiceField(choices=[
        ('General', 'General Illness'),
        ('Injury', 'Injury'),
        ('Check-up', 'Check-up'),
        ('Other', 'Other'),
    ], allow_blank=True, required=False)
    street_address = serializers.CharField(max_length=100, allow_blank=True, required=False)
    barangay = serializers.CharField(max_length=100, allow_blank=True, required=False)
    municipal_city = serializers.CharField(max_length=100, allow_blank=True, required=False)

    queue_data = serializers.SerializerMethodField()

    def get_queue_data(self, obj):
        queue_info = obj.get('queueing_temporarystoragequeue')  # Match Supabase table name

        if queue_info:
            return {
                'id': queue_info.get('id'),
                'priority_level': queue_info.get('priority_level'),
                'status': queue_info.get('status'),
                'created_at': queue_info.get('created_at'),
            }
        return None

    # Custom Methods
    def get_complaint_display(self, obj):
        """Returns human-readable complaint type."""
        choices = dict(self.fields['complaint'].choices)
        return choices.get(obj['complaint'], 'Unknown')

    def get_age(self, obj):
        if isinstance(obj['date_of_birth'], str):
           try:
                birth_date = datetime.strptime(obj['date_of_birth'], "%Y-%m-%d").date()
                today = date.today()
                age = today.year - birth_date.year - (
                    (today.month, today.day) < (birth_date.month, birth_date.day)
                )
                return age
           except ValueError:
                return None
        return None
class PatientRegistrationSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=8)
    first_name = serializers.CharField(max_length=200, allow_blank=True, required=False)
    middle_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=11)
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    complaint = serializers.ChoiceField(choices=[
        ('General', 'General Illness'),
        ('Injury', 'Injury'),
        ('Check-up', 'Check-up'),
        ('Other', 'Other'),
    ], allow_blank=True, required=False)
    street_address = serializers.CharField(max_length=100, allow_blank=True, required=False)
    barangay = serializers.CharField(max_length=100, allow_blank=True, required=False)
    municipal_city = serializers.CharField(max_length=100, allow_blank=True, required=False)