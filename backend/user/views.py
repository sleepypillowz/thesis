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
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'restore']:
            return [IsAdminOrGeneralDoctor()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsMe()]
        return super().get_permissions()   

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='restore')
    def restore(self, request, pk=None):
        print(f"\n=== RESTORE DEBUG ===\n"
              f"Requested PK: {pk}\n"
              f"User making request: {request.user}\n"
              f"Request method: {request.method}\n"
              f"Full path: {request.get_full_path()}\n")
        
        try:
            instance = self.get_object()
            print(f"Found user: {instance} (ID: {instance.id})")
            
            instance.is_active = True
            instance.save()
            print("User restored successfully")
            
            return Response(
                {"status": "restored", "user_id": instance.id},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Restore error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @action(detail=False, methods=['get'], url_path='archived')
    def archived(self, request):
        role = request.query_params.get('role')
        queryset = UserAccount.objects.filter(is_active=False)
        
        if role:
            queryset = queryset.filter(role=role)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.action != 'restore':
            queryset = queryset.filter(is_active=True)

        role_param = self.request.query_params.get("role")
        if role_param:
            queryset = queryset.filter(role=role_param)
            
        return queryset.exclude(id=self.request.user.id)
    @action(detail=False, methods=['get'], url_path='current-email')
    def current_email(self, request):
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

    @action(detail=False, methods=['get'], url_path='whoami')
    def whoami(self, request):
        """
        Returns a summary of the currently authenticated user's identity.
        """
        user = request.user
        if user.is_authenticated:
            data = {
                'id': user.id,
                'email': user.email,
                'role': user.role  # assuming 'role' is a field on UserAccount
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'},
                        status=status.HTTP_401_UNAUTHORIZED)

