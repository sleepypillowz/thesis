from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Medicine
from .serializers import MedicineSerializer
from user.permissions import IsMedicalStaff, isSecretary
from rest_framework.views import APIView

from django.db.models import Q
from patient.serializers import PrescriptionSerializer
from patient.models import Prescription

class MedicineView(generics.ListAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    
    permission_classes = [IsMedicalStaff]


class SearchMedicine(APIView):
    permission_classes = [IsMedicalStaff]  
    
    def get(self, request, format=None):
        query = request.GET.get('q', '')
        
        if query:
            medicines = Medicine.objects.filter(
                Q(name__icontains=query)
            ).distinct()
        else:
            medicines = Medicine.objects.none()
        
        data = []
        for medicine in medicines:
            data.append({
                'id': medicine.id,
                'name': medicine.name,
                'stocks': medicine.stocks, 
                'strength': medicine.strength
            })   
    
        return Response({'medicine': data}, status=status.HTTP_200_OK)
    
class PrescriptionViews(generics.ListAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    
    permission_classes = [isSecretary]



class ConfirmDispenseview(APIView):
    permission_classes = [isSecretary]
    def post(self, request):
        prescriptions_data = request.data.get("prescriptions", [])
        errors = []
        
        for item in prescriptions_data:
            prescription_id = item.get("id")
            try:
                confirmed = int(item.get("confirmed", 0))
            except (ValueError, TypeError):
                errors.append({"id": prescription_id, "error": "Invalid confirmed quantity"})
                continue

            try:
                prescription = Prescription.objects.get(id=prescription_id)
            except Prescription.DoesNotExist:
                errors.append({"id": prescription_id, "error": "Prescription not found"})
                continue

            if confirmed > prescription.quantity:
                errors.append({"id": prescription_id, "error": "Confirmed quantity exceeds the prescribed quantity"})
                continue

            medicine = prescription.medication
            if medicine.stocks < confirmed:
                errors.append({"id": prescription_id, "error": "Not enough stock available"})
                continue

            # Deduct the confirmed quantity from the medicine's stock
            medicine.stocks -= confirmed
            medicine.save()
        
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "All stocks updated successfully."}, status=status.HTTP_200_OK)