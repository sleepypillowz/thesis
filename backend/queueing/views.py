from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import PreliminaryAssessment, Patient, TemporaryStorageQueue
from .serializers import PreliminaryAssessmentSerializer
from api.views import supabase
from django.db import connection  # To ensure transactions are committed

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class PatientQueue(APIView):
    def get(self, request):
        table_name = 'queueing_temporarystoragequeue'

        try:
            # Fetch Priority Queue
            priority_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level", 'queue_number', 'queue_date'
            ).eq('status', 'Waiting').eq('priority_level', 'Priority').order('created_at').execute()

            # Fetch Regular Queue
            regular_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level",  'queue_number', 'queue_date'
            ).eq('status', 'Waiting').eq('priority_level', 'Regular').order('created_at').execute()

            # Access the data attribute directly
            priority_patients = priority_response.data if hasattr(priority_response, 'data') else []
            regular_patients = regular_response.data if hasattr(regular_response, 'data') else []

            def get_next_patients(queue):
                current = queue[0] if len(queue) > 0 else None
                next1 = queue[1] if len(queue) > 1 else None
                next2 = queue[2] if len(queue) > 2 else None
                return current, next1, next2

            # Fetch patient details for the priority queue
            priority_patient_ids = [queue["patient_id"] for queue in priority_patients]
            priority_patients_details_response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number, complaint"
            ).in_("patient_id", priority_patient_ids).execute()

            # Fetch patient details for the regular queue
            regular_patient_ids = [queue["patient_id"] for queue in regular_patients]
            regular_patients_details_response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number, complaint"
            ).in_("patient_id", regular_patient_ids).execute()

            # Access patient data
            priority_patients_data = priority_patients_details_response.data if hasattr(priority_patients_details_response, 'data') else []
            regular_patients_data = regular_patients_details_response.data if hasattr(regular_patients_details_response, 'data') else []

            # Merge patient data with queue data and add age using the get_age() method
            for queue_item in priority_patients:
                patient = next((patient for patient in priority_patients_data if patient["patient_id"] == queue_item["patient_id"]), None)
                if patient:
                    patient_obj = Patient.objects.get(patient_id=patient["patient_id"])  # Get the full patient object
                    queue_item.update({
                        "first_name": patient["first_name"],
                        "last_name": patient["last_name"],
                        "phone_number": patient["phone_number"],
                        "date_of_birth": patient["date_of_birth"],
                        "complaint": patient["complaint"],
                        "age": patient_obj.get_age()  # Using get_age() method here
                    })

            for queue_item in regular_patients:
                patient = next((patient for patient in regular_patients_data if patient["patient_id"] == queue_item["patient_id"]), None)
                if patient:
                    patient_obj = Patient.objects.get(patient_id=patient["patient_id"])  # Get the full patient object
                    queue_item.update({
                        "first_name": patient["first_name"],
                        "last_name": patient["last_name"],
                        "phone_number": patient["phone_number"],
                        "date_of_birth": patient["date_of_birth"],
                        "complaint": patient["complaint"],
                        "age": patient_obj.get_age()  # Using get_age() method here
                    })

            # Get the next patients
            priority_current, priority_next1, priority_next2 = get_next_patients(priority_patients)
            regular_current, regular_next1, regular_next2 = get_next_patients(regular_patients)

            # Return the response with explicit renderer
            return Response(
                {
                    "priority_current": priority_current,
                    "priority_next1": priority_next1,
                    "priority_next2": priority_next2,
                    "regular_current": regular_current,
                    "regular_next1": regular_next1,
                    "regular_next2": regular_next2
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # In case of errors, return a 500 error
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PreliminaryAssessmentForm(APIView):
    def post(self, request, patient_id, queue_number):
        try:
            # Get the patient based on the provided patient_id
            patient = Patient.objects.get(patient_id=patient_id)
            
            # Get the queue entry based on the patient and queue number
            queue_entry = TemporaryStorageQueue.objects.get(patient=patient, queue_number=queue_number)

            # Update the status of the queue entry to "Being Assessed"
            queue_entry.status = 'Being Assessed'
            queue_entry.save()

        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        except TemporaryStorageQueue.DoesNotExist:
            return Response({'error': 'Queue entry not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Now, handle the preliminary assessment using the serializer
        serializer = PreliminaryAssessmentSerializer(data=request.data, context={'patient': patient})
        if serializer.is_valid():
            serializer.save()  # Save the assessment data
            return Response({'message': 'Assessment created successfully', 'queue_number': queue_number}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
