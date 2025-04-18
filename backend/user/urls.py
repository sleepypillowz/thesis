# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAccountViewSet

app_name = 'user'
router = DefaultRouter()
router.register(r'', UserAccountViewSet, basename='user')

urlpatterns = [
    path('user/users/', include(router.urls)),
]
