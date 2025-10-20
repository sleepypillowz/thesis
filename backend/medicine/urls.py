from django.urls import path
from . import views 

app_name = 'medicine'

urlpatterns = [
    path('medicine/medicines', views.MedicineView.as_view(), name='medicine-list'),
    path('medicine/medicine-search/', views.SearchMedicine.as_view(), name='medicine-search'),
    
    path('medicine-prescription-display/', views.PrescriptionViews.as_view(), name='prescription-view'),
    path('medicine/confirm-dispense/', views.ConfirmDispenseview.as_view(), name='confirm-dispense'),

    path('medicine/predict/', views.Predict.as_view(), name='medicine-predict'),
    path("medicine/upload-csv/", views.MedicineCSVUploadView.as_view(), name="medicine-upload-csv"),
    # path('medicine/dummy/', views.AddDummy.as_view()), 
    # path('dummy-preliminary/<str:patient_id>/<str:queue_number>/', views.DummyPreliminaryAssessmentView.as_view(), name='dummy-preliminary'),
    # path('bulk-add-dummy/', views.BulkDummyFlowAPIView.as_view(), name='bulk-add-dummy'),
]
