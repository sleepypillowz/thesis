from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

app_name = 'patient'

urlpatterns = [
    path('patients/', views.PatientListView.as_view(), name='patient-list'),
    path('patient/patient-preliminary-assessment/<str:patient_id>/<int:queue_number>/', views.PreliminaryAssessmentView.as_view(), name='preliminary-assessment'),

    path('patient/patient-register/', views.PatientRegister.as_view(), name='patient-register'),
    path("patient/update-status/", views.AcceptButton.as_view(), name="update_status"),
    path("patient/save-draft-treatment/", views.SaveButton.as_view(), name="update_status"),

    # treatment list
    path('patient/patient-treatment', views.Treatment.as_view(), name='patient-treatment'),
    path('patient/patient-treatment-list', views.PatientTreatmentListView.as_view(), name='patient-treatment-list'),
    # treatment details
    path('patient/patient-treatment-view-details/<str:patient_id>/', views.TreatmentDetailView.as_view(), name='patient-treatment-detail'),

    # search patient
    path('patient/search-patients/', views.SearchPatient.as_view(), name='search-patient'),
    path('patient/get-queue/', views.GetQueue.as_view(), name='get-queue'),
    
    #laboratories
    path('patient/lab-request/', views.LabRequestCreateView.as_view(), name='lab-request-create'),
    path('patient/lab-request/list/', views.LabRequestListView.as_view(), name='lab-request-list'),
    path('patient/lab-request/<str:pk>/', views.LabRequestDetailView.as_view(), name='lab-request-detail'),
    path('patient/lab-result/', views.LabResultCreateView.as_view(), name='lab-result'),
    path('patient/lab-results/<str:patient_id>/', views.LabResultListView.as_view(), name='lab-result-detail'),
    
    
    # download file
    path('patient/lab-results/<str:result_id>/download/', views.download_lab_result, name='download_lab_result'),

]+  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


