from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions

# all medical staff access
class IsMedicalStaff(BasePermission):
    def has_permission(self, request, view):
        
        allowed_roles = ['doctor', 'secretary']
        user_role = getattr(request.user, 'role').lower()
        
        return user_role in allowed_roles   

# doctor access
class isDoctor(BasePermission):
    def has_permission(self, request, view):
        print("DEBUG - request.user:", request.user)
        if not request.user or not hasattr(request.user, 'role'):
            return False
        return request.user.role.lower() == 'doctor'
    
class isSecretary(BasePermission):
    def has_permission(self, request, view):
        print("DEBUG - request.user:", request.user)
        if not request.user or not hasattr(request.user, 'role'):
            return False
        return request.user.role.lower() == 'secretary'

class isAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not hasattr(request.user, 'role'):
            return False
        return request.user.role.lower() == 'admin'

class IsAdminOrGeneralDoctor(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if not request.user or not hasattr(request.user, 'role'):
            return False

        role = request.user.role.lower()
        email = request.user.email.lower()

        if role == 'admin' or (role == 'doctor' and email == 'generaldoctor@hospital.com'):
            return True
        return False
    
class IsReferralParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.referring_doctor == request.user or obj.receiving_doctor == request.user 
        
        if request.method in ['PUT', 'PATCH']:
            return obj.referring_doctor == request.user
        
        if view.action == 'decline_referral':
            return obj.receiving_doctor == request.user

        return False
class IsMe(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.id==request.user.id