
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('', include('patient.urls', namespace='patient')),
    path('', include('queueing.urls', namespace='queueing'))
]
