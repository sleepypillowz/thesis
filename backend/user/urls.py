# users/urls.py
from django.urls import path
# from .views import UserRegistration
from . import views

app_name = 'user'
urlpatterns = [
    path('user/register/', views.UserRegistration.as_view(), name='user-register'),
]
