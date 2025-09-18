# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserAccount
from .serializers import UserAccountSerializer
from .permissions import IsAdminOrGeneralDoctor, IsMe


class UserAccountViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # update/partial_update/destroy => user-level (IsMe)
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsMe()]
        # create/restore => admin-level
        if self.action in ['create', 'restore']:
            return [IsAdminOrGeneralDoctor()]
        return super().get_permissions()

    def get_queryset(self):
        """
        Single flexible queryset:
        - ?role=doctor expands to include on-call variants
        - ?role=role1,role2 supports comma-separated roles
        - excludes requesting user and, unless restoring, only active users
        """
        qs = super().get_queryset()

        # only active users except when restoring
        if self.action != "restore":
            qs = qs.filter(is_active=True)

        role_param = self.request.query_params.get("role")
        if role_param:
            requested = [r.strip() for r in role_param.split(",") if r.strip()]
            normalized = []
            for r in requested:
                low = r.lower()
                if low == "doctor":
                    # adapt these strings if your DB uses different role labels
                    normalized.extend(["doctor", "on-call-doctor", "on-call"])
                elif low in ("oncall", "on-call", "on-call-doctor"):
                    normalized.extend(["on-call-doctor", "on-call"])
                else:
                    normalized.append(r)

            # preserve order + unique
            seen = set()
            normalized_unique = []
            for x in normalized:
                if x not in seen:
                    seen.add(x)
                    normalized_unique.append(x)

            qs = qs.filter(role__in=normalized_unique)

        return qs.exclude(id=self.request.user.id)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='restore')
    def restore(self, request, pk=None):
        try:
            instance = self.get_object()
            instance.is_active = True
            instance.save()
            return Response({"status": "restored", "user_id": instance.id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='archived')
    def archived(self, request):
        role = request.query_params.get('role')
        queryset = UserAccount.objects.filter(is_active=False)
        if role:
            # allow same normalization if you like; keeping simple here
            queryset = queryset.filter(role=role)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='doctors')
    def doctors(self, request):
        """
        Simple endpoint: GET /user/users/doctors/
        Returns both regular doctors and on-call doctors.
        """
        doctor_roles = ["doctor", "on-call-doctor", "on-call"]
        qs = UserAccount.objects.filter(role__in=doctor_roles, is_active=True).exclude(id=request.user.id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='doctors-debug')
    def doctors_debug(self, request):
        """
        Debugging: shows count, SQL, and serialized results.
        Use this if you see no output from the above endpoints.
        """
        doctor_roles = ["doctor", "on-call-doctor", "on-call"]
        qs = UserAccount.objects.filter(role__in=doctor_roles, is_active=True).exclude(id=request.user.id)
        serializer = self.get_serializer(qs, many=True)
        return Response({
            "count": qs.count(),
            "sql": str(qs.query),
            "results": serializer.data
        })

    @action(detail=False, methods=['get'], url_path='current-email')
    def current_email(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({'email': user.email}, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], url_path='current-id')
    def current_id(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({'id': user.id}, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], url_path='current-profile')
    def current_profile(self, request):
        user = request.user
        if user.is_authenticated:
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

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
        user = request.user
        if user.is_authenticated:
            data = {'id': user.id, 'email': user.email, 'role': getattr(user, 'role', None)}
            return Response(data, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
