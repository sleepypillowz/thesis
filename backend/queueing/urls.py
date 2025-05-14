from django.urls import path
from . import views

app_name = 'queueing'

urlpatterns = [
    path('queueing/registration_queueing/', views.PatientRegistrationQueue.as_view(), name='registration_queueing'),
    path('queueing/preliminary_assessment_queueing/', views.PreliminaryAssessmentQueue.as_view(), name='preliminary_assessment_queueing'),
    path('queueing/treatment_queueing/', views.PatientTreatmentQueue.as_view(), name='treatment_queueing'),

    path('queueing/patient-preliminary-assessment/<str:patient_id>/<str:queue_number>/', 
        views.PreliminaryAssessmentForm.as_view(), 
        name='patient-preliminary-assessment'),


    # treatment form    
    path('queueing/patient-treatment/<str:patient_id>/<str:queue_number>/', 
        views.PatientTreatmentForm.as_view(), 
        name='patient-treatment'),
]
