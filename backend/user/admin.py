from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount

class UserAccountAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

    # Only allow superusers to add or delete users
    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    # Allow only superusers to change the role; others can change other fields if permitted.
    def get_readonly_fields(self, request, obj=None):
        # If the logged-in user is not a superuser, make the 'role' field read-only.
        if not request.user.is_superuser:
            return self.readonly_fields + ('role',)
        return self.readonly_fields

    # Optionally restrict change permissions to superusers only.
    # If you want non-admins to edit some user fields but not role, then keep has_change_permission open.
    # def has_change_permission(self, request, obj=None):
    #     return request.user.is_superuser

admin.site.register(UserAccount, UserAccountAdmin)
