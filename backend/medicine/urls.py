from django.urls import path
from . import views 

app_name = 'medicine'

urlpatterns = [
    path('medicine/medicines', views.MedicineView.as_view(), name='medicine-list'),
    path('medicine/medicine-search/', views.SearchMedicine.as_view(), name='medicine-search')
]
