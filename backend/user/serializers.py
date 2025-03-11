from rest_framework import serializers
from .models import UserAccount
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserAccount

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Debug: Print to ensure this method is called
        print("CustomTokenObtainPairSerializer: Creating token for", user.email, user.first_name)
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name  # Add first_name to the token
        return token

class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    re_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(
        choices=UserAccount.ROLE_CHOICES, 
        required=True
    )
    
    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 're_password', 'role', 'is_active']
        extra_kwargs = {
            'id': {'read_only': True},
            'is_active': {'read_only': True}
        }
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('re_password'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def validate_role(self, value):
        # Convert "medical secretary" (case insensitive) to "secretary"
        if value.lower() == "medical secretary":
            return "secretary"
        return value
    def create(self, validated_data):
        # Remove the re_password field so it isn't passed to the model.
        validated_data.pop('re_password', None)
        role = validated_data.pop('role', 'doctor')
        password = validated_data.pop('password')
        user = UserAccount.objects.create_user(password=password, role=role, **validated_data)
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['role'] = instance.get_role_display()  # Display the label
        representation['is_active'] = instance.is_active
        return representation
