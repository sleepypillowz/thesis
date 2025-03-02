from . import views
from django.urls import path

app_name = 'patient'

urlpatterns = [
    path('patients/', views.PatientListView.as_view(), name='patient-list'),
    path('patient/patient-preliminary-assessment/<str:patient_id>/<int:queue_number>/', views.PreliminaryAssessmentView.as_view(), name='preliminary-assessment'),

    path('patient/patient-register/', views.PatientRegister.as_view(), name='patient-register'),
    path("patient/update-status/", views.AcceptButton.as_view(), name="update_status"),

    # treatment list
    path('patient/patient-treatment', views.Treatment.as_view(), name='patient-treatment'),
    path('patient/patient-treatment-list', views.PatientTreatmentListView.as_view(), name='patient-treatment-list'),
    # treatment details
    path('patient/patient-treatment-view-details/<str:patient_id>/', views.TreatmentDetailView.as_view(), name='patient-treatment-detail'),

    # search patient
    path('patient/search-patients/', views.SearchPatient.as_view(), name='search-patient'),
    path('patient/get-queue/', views.GetQueue.as_view(), name='get-queue'),
]

