from . import views
from django.urls import path

app_name = 'patient'

urlpatterns = [
    path('patients/', views.PatientListView.as_view(), name='patient-list'),
    path('patient/patient-treatment-list', views.TreatmentListView.as_view(), name='patient-treatment-list'),
    path('patient/patient-register/', views.PatientRegister.as_view(), name='patient-register'),
    path("patient/update-status/", views.AcceptButton.as_view(), name="update_status"),
    path('patient/patient-treatment-view-details/<str:pk>/', views.TreatmentDetailView.as_view(), name='patient-treatment-detail'),
]

