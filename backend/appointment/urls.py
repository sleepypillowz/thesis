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
    path('queue/debug/', views.QueueDebugMonthView.as_view(), name='queue-debug'),
    path("appointment/<str:appointment_id>/accept/", views.AcceptAppointmentView.as_view(), name="accept-appointment"),
    # path("<uuid:appointment_id>/cancel/", CancelAppointmentView.as_view(), name="cancel-appointment"),
    # path("<uuid:appointment_id>/requeue/", RequeueAppointmentView.as_view(), name="requeue-appointment"),
     path("send-test-email/", views.TestEmailView.as_view(), name="send-test-email"),

    path('appointment/', include(router.urls))
]
 
