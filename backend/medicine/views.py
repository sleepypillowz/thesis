from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Medicine
from .serializers import MedicineSerializer
from user.permissions import IsMedicalStaff
from rest_framework.views import APIView

from django.db.models import Q, Prefetch


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
