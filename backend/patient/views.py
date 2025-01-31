from supabase import create_client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer, PatientRegistrationSerializer

from datetime import date
 
# Supabase credentials
url = 'https://wczowfydbgmwbotbxaxa.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjem93ZnlkYmdtd2JvdGJ4YXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzU1MjUsImV4cCI6MjA1MDc1MTUyNX0.5JxhYLqY3q6y2ti9Cn3R6-UBJFisPDOvUYxYQ_DgGSE'  # Make sure you use the correct key
supabase = create_client(url, key)

class PatientListView(APIView):
    def get(self, request):
        try:
            response = supabase.table("patient_patient").select(
                "*",
                "queueing_temporarystoragequeue(id, priority_level, status, created_at)"
            ).execute()
            
            print(response)  # Debugging: Print full response
            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            patients = response.data if hasattr(response, 'data') else response
            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatientRegister(APIView):
    def post(self, request):
        patient = PatientRegistrationSerializer(data=request.data)
        if patient.is_valid():
            validated_data = patient.validated_data

            # Convert date_of_birth to string (YYYY-MM-DD) if it's not None
            if validated_data.get("date_of_birth"):
                validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

            # Insert data into Supabase
            response = supabase.table('patient_patient').insert(validated_data).execute()

            # Check if the insertion was successful
            if response.data:  # If data is present, insertion was successful
                return Response(patient.data, status=status.HTTP_201_CREATED)
            else:  # If there's an error
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"errors": patient.errors}, status=status.HTTP_400_BAD_REQUEST)
