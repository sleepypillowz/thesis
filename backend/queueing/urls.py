from django.urls import path
from . import views

app_name = 'queueing'

urlpatterns = [
    path('queueing/registration_queueing/', views.PatientQueue.as_view(), name='registration_queueing'),
<<<<<<< HEAD
    path('queueing/preliminary_assessment_queueing/', views.PreliminaryAssessmentQueue.as_view(), name='preliminary_assessment_queueing'),

    path('queueing/patient-preliminary-assessment/<str:patient_id>/<str:queue_number>/', 
        views.PreliminaryAssessmentForm.as_view(), 
        name='patient-preliminary-assessment'),
    

]
=======
]
>>>>>>> main
