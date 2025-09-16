from django.urls import path, include
from . import views 
from rest_framework.routers import DefaultRouter
app_name = 'appointment'


router = DefaultRouter()
router.register(r'referrals', views.AppointmentReferralViewSet, basename='referral-set')
urlpatterns = [
    path('appointment-referral/', views.DoctorCreateReferralView.as_view(), name='referral'),
    path('appointment-referral-list/', views.ReferralViewList.as_view(), name='referral-list'),
    path('appointment/doctor-schedule/<str:doctor_id>/', views.DoctorSchedule.as_view(), name='doctor-schedule'),
    path('appointment/schedule-appointment/', views.ScheduleAppointment.as_view(), name='schedule-appointment'),
    path('appointment/upcoming-appointments/', views.UpcomingAppointments.as_view(), name='upcoming-appointment'),
    path('appointment/', include(router.urls))
]

