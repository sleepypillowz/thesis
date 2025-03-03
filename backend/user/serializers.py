# from django.contrib.auth.models import User
# from django.contrib.auth.password_validation import validate_password
# from rest_framework import serializers

# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         validators=[validate_password],
#         style={"input_type": "password"}
#     )

#     class Meta:
#         model = User
#         fields = ['username', 'first_name', 'last_name', 'email', 'password']

#     def create(self, validated_data):
#         # Create user with hashed password using create_user()
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             first_name=validated_data.get('first_name', ""),
#             last_name=validated_data.get('last_name', "")
#         )
#         return user
