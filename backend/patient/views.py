from supabase import create_client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer
 
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
		patient = PatientSerializer(data=request.data)
		if patient.is_valid():
			response = supabase.table('patients').insert(patient.validated_data).execute()
		
			if response.status_code == 201:
				return Response(patient.data, status=status.HTTP_201_CREATED)
			else:
				return Response(response.error_message, status=status.HTTP_400_BAD_REQUEST)
		return Response(patient.errors, status=status.HTTP_400_BAD_REQUEST)