from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.views.static import serve 

urlpatterns = [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('', include('patient.urls', namespace='patient')),
    path('', include('queueing.urls', namespace='queueing')),
    path('', include('user.urls', namespace='user')),
    path('', include('medicine.urls', namespace='medicine')),
    path('', include('appointment.urls', namespace='appointment')),
    path('auth/', include('djoser.urls')),         # Djoser endpoints for user registration, activation, etc.
    path('auth/', include('djoser.urls.jwt')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)