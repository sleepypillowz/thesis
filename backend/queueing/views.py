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

from user.permissions import IsMedicalStaff, isDoctor, isSecretary, IsTreatmentParticipant
from django.utils.timezone import now, localdate

from appointment.models import AppointmentReferral, Appointment
# display patient registration queue
from .utils import compute_queue_snapshot

class PatientRegistrationQueue(APIView):
    permission_classes = [isSecretary]

    def get(self, request):
        try:
            snapshot = compute_queue_snapshot()
            return Response(snapshot, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error in GET:", e)
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
            
            queue_response = supabase.table("queueing_preliminaryassessment").select(
                'allergies', 'medical_history', 'current_medications'
            ).eq("patient_id", patient_id).order('assessment_date', desc=True).limit(1).execute()
                    
            print("Supabase Response:", response.data)  # Debugging
            print('Supabase Response: ',queue_response.data )

            patient_data = response.data[0] if response.data else None
            
            if queue_response.data and len(queue_response.data) > 0:
                preliminary_data = queue_response.data[0]
                patient_data['allergies'] = preliminary_data.get('allergies')
                patient_data['medical_history'] = preliminary_data.get('medical_history')
                patient_data['current_medications'] = preliminary_data.get('current_medications')


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
        
        print("date: ", request.data)
        # Now, handle the preliminary assessment using the serializer
        serializer = PreliminaryAssessmentSerializer(data=request.data, context={'patient': patient})
        if serializer.is_valid():
            serializer.save()  # Save the assessment data
            return Response({'message': 'Assessment created successfully', 'queue_number': queue_number}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PatientTreatmentForm(APIView):
    permission_classes = [IsTreatmentParticipant]

    def post(self, request, patient_id, queue_number):
        patient = get_object_or_404(Patient, patient_id=patient_id)

        # Create treatment record
        treatment = Treatment.objects.create(
            patient=patient,
            treatment_notes=request.data.get("treatment_notes", ""),
            doctor=request.user
        )

        # Mark queue entry completed
        queue_entry = get_object_or_404(
            TemporaryStorageQueue,
            patient=patient,
            queue_number=queue_number
        )
        queue_entry.status = 'Completed'
        queue_entry.save()

        # Update “active” referral, if any
        referral = AppointmentReferral.objects.filter(
            patient=patient,
            status__in=['pending', 'scheduled']
        ).order_by('-created_at').first()

        if referral:
            referral.status = 'completed'
            referral.save()
            # optional logging
            print(f"Updated Referral id={referral.id} to completed for patient {patient_id}")
        else:
            print(f"No active referral found for patient {patient_id}")

        # Update “active” appointment, if any
        appointment = Appointment.objects.filter(
            patient=patient,
            status__in=['Scheduled', 'Waiting']
        ).order_by('appointment_date').first()

        if appointment:
            appointment.status = 'Completed'
            appointment.save()
            print(f"Updated Appointment id={appointment.id} to Completed for patient {patient_id}")
        else:
            print(f"No active appointment found for patient {patient_id}")

        # Process diagnoses
        diagnoses_data = request.data.get("diagnoses", [])
        for diag in diagnoses_data:
            diagnosis, _ = Diagnosis.objects.get_or_create(
                patient=patient,
                diagnosis_code=diag["diagnosis_code"],
                diagnosis_description=diag["diagnosis_description"],
                diagnosis_date=diag["diagnosis_date"]
            )
            treatment.diagnoses.add(diagnosis)

        # Process prescriptions
        prescriptions_data = request.data.get("prescriptions", [])
        for presc in prescriptions_data:
            try:
                # similar logic as your previous code
                if "medicine_id" in presc and presc["medicine_id"]:
                    med_id = int(presc["medicine_id"])
                    medicine = Medicine.objects.get(id=med_id)
                else:
                    name = presc["medication"].strip()
                    medicines = Medicine.objects.filter(name__iexact=name)
                    if not medicines.exists():
                        return Response(
                            {"error": f"Medicine '{name}' not found!"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    medicine = medicines.first()

                # Check expiration
                if medicine.expiration_date and medicine.expiration_date < date.today():
                    return Response(
                        {"error": f"{medicine.name} is expired!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                prescription, created = Prescription.objects.get_or_create(
                    patient=patient,
                    medication=medicine,
                    dosage=presc["dosage"],
                    frequency=presc["frequency"],
                    quantity=presc["quantity"],
                    start_date=presc["start_date"],
                    end_date=presc["end_date"]
                )
                treatment.prescriptions.add(prescription)
            except Exception as e:
                print("Exception processing prescription:", e)
                return Response(
                    {"error": "An error occurred while processing the prescription."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response({"message": "Treatment submitted successfully"}, status=status.HTTP_201_CREATED)
