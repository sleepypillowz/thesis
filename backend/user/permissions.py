from rest_framework.permissions import BasePermission

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