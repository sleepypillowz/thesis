from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer, PatientRegistrationSerializer
from queueing.models import Patient, TemporaryStorageQueue
from datetime import datetime
from api.views import supabase

# Supabase credentials


class PatientListView(APIView):
    def get(self, request):
        try:
            response = supabase.table("patient_patient").select(
                "*",
                "queueing_temporarystoragequeue(status, created_at)"
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
        print("📥 Received Data:", request.data)  # ✅ Log raw request data
        # Deserialize the data with the PatientRegistrationSerializer
        patient = PatientRegistrationSerializer(data=request.data)
        
        if patient.is_valid():
            validated_data = patient.validated_data
            print("🔄 Validated Data:", validated_data)

            # Convert date_of_birth to string (YYYY-MM-DD) if it's not None
            if validated_data.get("date_of_birth"):
                validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

            try:
                priority_level = validated_data.get('priority_level', 'Regular')
                queue_number = validated_data.get('queue_number', '')
                print("🔥 Extracted Priority Level:", priority_level) 
                # Insert data into Patient table using Django ORM
                if priority_level not in ['Regular', 'Priority']:
                    priority_level = 'Regular'  # Default fallback
                patient = Patient.objects.create(
                    first_name=validated_data.get('first_name', ''),
                    middle_name=validated_data.get('middle_name', ''),
                    last_name=validated_data['last_name'],  
                    email=validated_data['email'],
                    phone_number=validated_data['phone_number'],
                    date_of_birth=datetime.strptime(validated_data['date_of_birth'], '%Y-%m-%d').date(),
                    complaint=validated_data.get('complaint'),
                    street_address=validated_data.get('street_address', ''),
                    barangay=validated_data.get('barangay', ''),
                    municipal_city=validated_data.get('municipal_city', '')
                )
                    

                TemporaryStorageQueue.objects.create(
                    patient=patient,
                    priority_level=priority_level,  # Should be 'Regular' or 'Priority'
                    queue_number = queue_number,
                    status='Waiting'
                )

                # Respond with success if everything went well
                patient_serializer = PatientRegistrationSerializer(patient)
                return Response(patient_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                # Handle unexpected errors during insertion
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # If serializer is not valid
        return Response({"errors": patient.errors}, status=status.HTTP_400_BAD_REQUEST)
