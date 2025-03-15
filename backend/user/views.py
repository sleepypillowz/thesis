from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserAccountSerializer
from .permissions import isAdmin

class UserRegistration(APIView):
    permission_classes = [isAdmin]
    def post(self, request):
        # Debug: Print the incoming request data
        print("DEBUG: Received request data:", request.data)
        
        serializer = UserAccountSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Debug: Print the role of the created user
            print("DEBUG: User created with role:", user.role)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Debug: Print serializer errors if validation fails
        print("DEBUG: Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
