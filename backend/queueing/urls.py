from django.urls import path
from . import views

app_name = 'queueing'

urlpatterns = [
    path('queueing/registration_queueing/', views.PatientQueue.as_view(), name='registration_queueing'),
]
