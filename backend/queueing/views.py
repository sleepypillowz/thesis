from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import Patient, TemporaryStorageQueue, Treatment
from .serializers import PreliminaryAssessmentSerializer
from backend.supabase_client import supabase


from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from patient.models import Diagnosis, Prescription
from medicine.models import Medicine

from user.permissions import IsMedicalStaff, isDoctor, isSecretary


# display patient registration queue
class PatientRegistrationQueue(APIView):
    permission_classes = [isSecretary]
    def get(self, request):
        table_name = 'queueing_temporarystoragequeue'
        try:
            # Fetch Priority Queue
            priority_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level, complaint", 'queue_number', 'queue_date'
            ).eq('status', 'Waiting').eq('priority_level', 'Priority').order('created_at').execute()

            # Fetch Regular Queue
            regular_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level, complaint",  'queue_number', 'queue_date'
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
                "patient_id, first_name, last_name, date_of_birth, phone_number"
            ).in_("patient_id", priority_patient_ids).execute()

            # Fetch patient details for the regular queue
            regular_patient_ids = [queue["patient_id"] for queue in regular_patients]
            regular_patients_details_response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number"
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
            print("Error in PatientRegistrationQueue GET:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# display patient assessment queue
class PreliminaryAssessmentQueue(APIView):
    permission_classes = [isSecretary]
    def get(self, request):
        table_name = 'queueing_temporarystoragequeue'

        try:
            # Fetch Priority Queue
            priority_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level, complaint", 'queue_number', 'queue_date'
            ).eq('status', 'Queued for Assessment').eq('priority_level', 'Priority').order('created_at').execute()

            # Fetch Regular Queue
            regular_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level, complaint",  'queue_number', 'queue_date'
            ).eq('status', 'Queued for Assessment').eq('priority_level', 'Regular').order('created_at').execute()

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
                "patient_id, first_name, last_name, date_of_birth, phone_number"
            ).in_("patient_id", priority_patient_ids).execute()

            # Fetch patient details for the regular queue
            regular_patient_ids = [queue["patient_id"] for queue in regular_patients]
            regular_patients_details_response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number"
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


# display patient treatment queue
class PatientTreatmentQueue(APIView):
    permission_classes = [isDoctor]
    def get(self, request):
        table_name = 'queueing_temporarystoragequeue'

        try:
            # Fetch Priority Queue
            priority_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level", 'queue_number', 'complaint', 'queue_date'
            ).eq('status', 'Queued for Treatment').eq('priority_level', 'Priority').order('created_at').execute()

            # Fetch Regular Queue
            regular_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level",  'queue_number', 'complaint', 'queue_date'
            ).eq('status', 'Queued for Treatment').eq('priority_level', 'Regular').order('created_at').execute()

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
                "patient_id, first_name, last_name, date_of_birth, phone_number"
            ).in_("patient_id", priority_patient_ids).execute()

            # Fetch patient details for the regular queue
            regular_patient_ids = [queue["patient_id"] for queue in regular_patients]
            regular_patients_details_response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number"
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


# get patient and submit patient assessment 
class PreliminaryAssessmentForm(APIView):
    permission_classes = [IsMedicalStaff]
    def get(self, request, patient_id, queue_number):
        print(f"Received patient_id: {patient_id}, queue_number: {queue_number}")  # Debugging

        try:
            response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number"
            ).eq("patient_id", patient_id).execute()

            print("Supabase Response:", response.data)  # Debugging

            patient_data = response.data[0] if response.data else None
            

            if not patient_data:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(patient_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self, request, patient_id, queue_number):
        try:
            # Get the patient based on the provided patient_id
            patient = Patient.objects.get(patient_id=patient_id)
            
            # Get the queue entry based on the patient and queue number
            queue_entry = TemporaryStorageQueue.objects.get(patient=patient, queue_number=queue_number)

            # Update the status of the queue entry to "Being Assessed"
            queue_entry.status = 'Queued for Treatment'
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
class PatientTreatmentForm(APIView):
    permission_classes = [isDoctor]
    
    def post(self, request, patient_id, queue_number):
        patient = get_object_or_404(Patient, patient_id=patient_id)        
        
        treatment_notes = request.data.get("treatment_notes", "")
        diagnoses_data = request.data.get("diagnoses", [])
        prescriptions_data = request.data.get("prescriptions", [])
        

        treatment = Treatment.objects.create(
            patient=patient,
            treatment_notes=treatment_notes
        )
        queue_entry = TemporaryStorageQueue.objects.get(patient=patient, queue_number=queue_number)

        queue_entry.status = 'Completed'
        queue_entry.save()
        
        for diag in diagnoses_data:
            diagnosis, _ = Diagnosis.objects.get_or_create(
                patient=patient,
                diagnosis_code=diag["diagnosis_code"],
                diagnosis_description=diag["diagnosis_description"],
                diagnosis_date=diag["diagnosis_date"]
            )
            treatment.diagnoses.add(diagnosis)
            
        for presc in prescriptions_data:
            print(f"Debug: Prescription data received: {presc}")
            try:
                # Check if a unique medicine id was provided
                if "medicine_id" in presc and presc["medicine_id"].strip() != "":
                    # Convert the id to integer if it's coming as a string
                    med_id = int(presc["medicine_id"])
                    print(f"Debug: Looking for medicine with ID: {med_id}")
                    medicine = Medicine.objects.get(id=med_id)
                else:
                    # Standardize and debug the medicine name
                    medicine_name = presc["medication"].strip()
                    print(f"Debug: Looking for medicine by name: '{medicine_name}'")
                    
                    # Use case-insensitive filtering to avoid issues with casing/whitespace
                    medicines = Medicine.objects.filter(name__iexact=medicine_name)
                    if not medicines.exists():
                        print(f"Debug: Medicine '{medicine_name}' not found!")
                        return Response({"error": f"Medicine '{medicine_name}' not found!"}, status=status.HTTP_400_BAD_REQUEST)
                    if medicines.count() > 1:
                        print(f"Debug: Multiple records found for '{medicine_name}'. Count: {medicines.count()}. Using the first one.")
                    medicine = medicines.first()
                
                print(f"Debug: Retrieved Medicine: {medicine.name} with expiration: {medicine.expiration_date}")
                
                # Check if the medicine is expired
                if medicine.expiration_date and medicine.expiration_date < date.today():
                    print(f"Debug: Medicine {medicine.name} is expired! Expiration: {medicine.expiration_date}, Today's date: {date.today()}")
                    return Response({"error": f"{medicine.name} is expired!"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Attempt to create or retrieve a prescription
                prescription, created = Prescription.objects.get_or_create(
                    patient=patient,
                    medication=medicine,
                    dosage=presc["dosage"],
                    frequency=presc["frequency"],
                    quantity=presc["quantity"],
                    start_date=presc["start_date"],
                    end_date=presc["end_date"]
                )
                if created:
                    print(f"Debug: Created new prescription for medicine {medicine.name}.")
                else:
                    print(f"Debug: Existing prescription found for medicine {medicine.name}.")
                
                # Associate the prescription with the treatment
                treatment.prescriptions.add(prescription)
            except Exception as e:
                print(f"Debug: Exception occurred while processing prescription: {e}")
                return Response({"error": "An error occurred while processing the prescription."}, status=status.HTTP_400_BAD_REQUEST)




        return Response({"message": "Treatment submitted successfully"}, status=status.HTTP_201_CREATED)
