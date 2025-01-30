from . import views
from django.urls import path

app_name = 'patient'

urlpatterns = [
    path('patients/', views.PatientListView.as_view(), name='patient-list'),
    path('patient/patient-register/', views.PatientRegister.as_view(), name='patient-register'),
]
