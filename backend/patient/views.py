from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer, PatientRegistrationSerializer
from queueing.models import Patient, TemporaryStorageQueue
from datetime import datetime
from api.views import supabase
<<<<<<< HEAD
from django.db.models import Max
=======
>>>>>>> main

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
<<<<<<< HEAD
        patient = PatientRegistrationSerializer(data=request.data)

=======
        # Deserialize the data with the PatientRegistrationSerializer
        patient = PatientRegistrationSerializer(data=request.data)
        
>>>>>>> main
        if patient.is_valid():
            validated_data = patient.validated_data
            print("🔄 Validated Data:", validated_data)

            # Convert date_of_birth to string (YYYY-MM-DD)
            if validated_data.get("date_of_birth"):
                validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

            try:
                priority_level = validated_data.get('priority_level', 'Regular')
<<<<<<< HEAD

                # ✅ Get the highest queue number and increment it
                last_queue_number = TemporaryStorageQueue.objects.aggregate(Max('queue_number'))['queue_number__max']
                queue_number = (last_queue_number or 0) + 1  # Start at 1 if no patients exist

                print("🔥 Assigned Queue Number:", queue_number)

                # Create the patient record
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

                # Add patient to the queue with auto-incremented queue number
                TemporaryStorageQueue.objects.create(
                    patient=patient,
                    priority_level=priority_level,
                    queue_number=queue_number,  # ✅ Auto-incremented queue number
                    status='Waiting'
                )

                # Respond with success
=======
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
                    status='Waiting'
                )

                # Respond with success if everything went well
>>>>>>> main
                patient_serializer = PatientRegistrationSerializer(patient)
                return Response(patient_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
<<<<<<< HEAD
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
=======
                # Handle unexpected errors during insertion
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # If serializer is not valid
>>>>>>> main
        return Response({"errors": patient.errors}, status=status.HTTP_400_BAD_REQUEST)
