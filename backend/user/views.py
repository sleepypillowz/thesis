from rest_framework.response import Response
from rest_framework import status
from .serializers import UserAccountSerializer
from .permissions import IsAdminOrGeneralDoctor, IsMe
from .models import UserAccount
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class UserAccountViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrGeneralDoctor()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsMe()]
        return super().get_permissions()   

    def get_queryset(self):
        queryset = super().get_queryset()
        role_param = self.request.query_params.get("role")
        if role_param:
            queryset = queryset.filter(role=role_param)
        queryset = queryset.exclude(id=self.request.user.id)
        return queryset

    @action(detail=False, methods=['get'], url_path='current-email')
    def current_email(self, request):
        """
        Custom action to retrieve the email of the currently authenticated user.
        """
        user = request.user
        
        if user.is_authenticated:
            print(f"Authenticated user's email: {user.email}")
            return Response({'email': user.email}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'},status=status.HTTP_401_UNAUTHORIZED) 
    
    
    @action(detail=False, methods=['get'], url_path='current-id')
    def current_id(self, request):
        """
        Custom action to retrieve the email of the currently authenticated user.
        """
        user = request.user
        
        if user.is_authenticated:
            print(f"Authenticated user's email: {user.id}")
            return Response({'email': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'},status=status.HTTP_401_UNAUTHORIZED) 
    
    @action(detail=False, methods=['get'], url_path='current-profile')
    def current_profile(self, request):
        user = request.user
        if user.is_authenticated:
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'detail': 'Authentication credentials were not provided.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['patch'], url_path='update-me')
    def update_me(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
