from django.urls import path
from . import views 

app_name = 'medicine'

urlpatterns = [
    path('medicine/medicines', views.MedicineView.as_view(), name='medicine-list'),
    path('medicine/medicine-search/', views.SearchMedicine.as_view(), name='medicine-search'),
    
    path('medicine-prescription-display/', views.PrescriptionViews.as_view(), name='prescription-view'),
    path('medicine/confirm-dispense/', views.ConfirmDispenseview.as_view(), name='confirm-dispense')
]
