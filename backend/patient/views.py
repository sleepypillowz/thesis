from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from queueing.serializers import PreliminaryAssessmentBasicSerializer
from .serializers import PatientSerializer, PatientRegistrationSerializer
from queueing.models import Patient, PreliminaryAssessment, TemporaryStorageQueue
from datetime import datetime
from api.views import supabase
from django.db.models import Max
from django.db.models import Q, Prefetch

# Supabase credentials
class PatientListView(APIView):
    def get(self, request):
        try:
            response = supabase.table("patient_patient").select(
                "*, queueing_temporarystoragequeue(id, status, created_at, priority_level, queue_number, complaint)"
            ).execute()

            print('Full response:', response)  # Debug: print full response
            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            # Use response.data if available
            patients = response.data if hasattr(response, 'data') else response

            # Iterate over patients and print the latest queue data for each
            for patient in patients:
                # Get the list of queue entries (if any)
                queue_list = patient.get('queueing_temporarystoragequeue') or []
                if queue_list:
                    # Sort the list descending by created_at to get the latest first
                    sorted_queue = sorted(
                        queue_list,
                        key=lambda q: q.get('created_at'),
                        reverse=True
                    )
                    latest_queue = sorted_queue[0]
                    print(f"Latest queue for patient {patient['patient_id']}: {latest_queue}")
                else:
                    print(f"No queue entries for patient {patient['patient_id']}.")

            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PreliminaryAssessmentView(APIView):
    
    def get(self, request, patient_id, queue_number):
        try:
            # Fetch patient details from Supabase
            response = supabase.table("patient_patient").select(
                "patient_id, first_name, last_name, date_of_birth, phone_number"
            ).eq("patient_id", patient_id).execute()
            patient_data = response.data[0] if response.data else None

            if not patient_data:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve the most recent preliminary assessment for this patient.
            # Remove queue_number from filtering if the model doesn't support it.
            assessment_obj = PreliminaryAssessment.objects.filter(
                patient__patient_id=patient_id
            ).last()

            if assessment_obj:
                assessment_data = PreliminaryAssessmentBasicSerializer(assessment_obj).data
            else:
                assessment_data = None

            combined_data = {
                "patient": patient_data,
                "preliminary_assessment": assessment_data,
            }
            return Response(combined_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class Treatment(APIView): 
    def get(self, request):
        try:
            # Fetch all treatment records from Supabase
            response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id, "
                "patient_patient(*), "
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(*)), "
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(*))"
            ).execute()

            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            supabase_data = response.data
            # Dictionary to group treatments by patient_id
            patient_treatments = {}

            for item in supabase_data:
                pid = item["patient_id"]

                # Retrieve the latest queue data for this patient using ordering
                queue_response = supabase.table("queueing_temporarystoragequeue").select(
                    "id, priority_level, status, created_at, queue_number, complaint"
                ).eq("patient_id", pid).order("created_at", desc=True).execute()
                queue_data = queue_response.data[0] if queue_response.data else None

                # Build the patient data using details from the treatment record
                patient_data = {
                    **item.get("patient_patient", {}),
                    "queue_data": queue_data
                }

                # Build a treatment summary from this record
                treatment_summary = {
                    "id": item["id"],
                    "treatment_notes": item["treatment_notes"],
                    "created_at": item["created_at"],
                    "updated_at": item["updated_at"],
                    "diagnoses": [
                        d["patient_diagnosis"]
                        for d in item.get("queueing_treatment_diagnoses", [])
                        if d.get("patient_diagnosis")
                    ],
                    "prescriptions": [
                        p["patient_prescription"]
                        for p in item.get("queueing_treatment_prescriptions", [])
                        if p.get("patient_prescription")
                    ]
                }

                # If the patient isn't in our dictionary yet, add them.
                # Otherwise, if this treatment is more recent than the stored one, update it.
                if pid not in patient_treatments:
                    patient_treatments[pid] = {
                        "patient": patient_data,
                        "latest_treatment": treatment_summary,
                        "latest_treatment_id": treatment_summary["id"]
                    }
                else:
                    current_latest = patient_treatments[pid]["latest_treatment"]
                    if item["created_at"] > current_latest["created_at"]:
                        patient_treatments[pid]["latest_treatment"] = treatment_summary
                        patient_treatments[pid]["latest_treatment_id"] = treatment_summary["id"]

            # Convert our dictionary of unique patient treatments into a list
            transformed = list(patient_treatments.values())

            return Response(transformed, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatientTreatmentListView(APIView):
    def get(self, request):
        try:
            # Fetch all treatment records from Supabase
            response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id, "
                "patient_patient(*), "
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(*)), "
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(*))"
            ).execute()

            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            treatments_data = response.data  # All treatment records

            # Group treatments by patient_id
            grouped = {}
            for item in treatments_data:
                pid = item["patient_id"]

                # Fetch the latest queue data for this patient from the temporary storage queue
                queue_response = supabase.table("queueing_temporarystoragequeue").select(
                    "id, priority_level, status, created_at, queue_number, complaint"
                ).eq("patient_id", pid).order("created_at", desc=True).execute()
                queue_data = queue_response.data[0] if queue_response.data else None

                # Get patient info from the nested patient_patient object and add queue_data
                patient_info = item.get("patient_patient", {})
                patient_info["queue_data"] = queue_data

                # Group treatments by patient
                if pid not in grouped:
                    grouped[pid] = {
                        "patient": patient_info,
                        "treatments": []
                    }
                grouped[pid]["treatments"].append(item)

            # For each patient group, sort treatments by created_at descending,
            # designate the first one as latest and the remainder as old treatments.
            results = []
            for pid, group in grouped.items():
                treatments = group["treatments"]
                treatments.sort(key=lambda x: x["created_at"], reverse=True)
                latest_treatment = treatments[0]
                old_treatments = treatments[1:] if len(treatments) > 1 else []
                results.append({
                    "patient": group["patient"],
                    "latest_treatment": latest_treatment,
                    "old_treatments": old_treatments,
                    "latest_treatment_id": latest_treatment["id"]
                })

            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TreatmentDetailView(APIView):
    def get(self, request, *args, **kwargs):
        patient_id = kwargs.get('patient_id')
        
        try:
            # 1. Fetch base patient information
            patient_response = supabase.table("patient_patient").select("*").eq("patient_id", patient_id).execute()
            if not patient_response.data:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
            patient_data = patient_response.data[0]

            # 2. Fetch latest queue information
            queue_response = supabase.table("queueing_temporarystoragequeue").select(
                "id, priority_level, status, created_at, queue_number"
            ).eq("patient_id", patient_id).order("created_at", desc=True).execute()
            queue_data = queue_response.data[0] if queue_response.data else None

            # 3. Fetch treatments with related data
            treatment_response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id, "
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(*)), "
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(*))"
            ).eq("patient_id", patient_id).order("created_at", desc=True).execute()

            treatments = treatment_response.data

            # 4. Structure response data
            response_data = {
                "patient": {
                    **patient_data,
                    "queue_data": queue_data
                },
                "recent_treatment": None,
                "previous_treatments": []
            }

            if treatments:
                # Process treatments data
                transformed_treatments = []
                for item in treatments:
                    transformed = {
                        "id": item["id"],
                        "treatment_notes": item["treatment_notes"],
                        "created_at": item["created_at"],
                        "updated_at": item["updated_at"],
                        "diagnoses": [
                            d["patient_diagnosis"]
                            for d in item.get("queueing_treatment_diagnoses", [])
                            if d.get("patient_diagnosis")
                        ],
                        "prescriptions": [
                            p["patient_prescription"]
                            for p in item.get("queueing_treatment_prescriptions", [])
                            if p.get("patient_prescription")
                        ]
                    }
                    transformed_treatments.append(transformed)

                # Separate recent and previous treatments
                response_data["recent_treatment"] = transformed_treatments[0]
                response_data["previous_treatments"] = transformed_treatments[1:]

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatientRegister(APIView):
    def post(self, request):
        print("📥 Received Data:", request.data)

        # Helper: determine priority automatically based on complaint
        def determine_priority():
            # Retrieve all queue entries for the patient, ordered by creation time
            queue_entries = TemporaryStorageQueue.objects.filter(patient=request.data["patient_id"]).order_by("created_at")
            if queue_entries.exists():
                queue_entry = queue_entries.first()  # Use the earliest entry (or choose based on your criteria)
                print("priority to", queue_entry.priority_level)
                return queue_entry.priority_level
            return "Regular"


        # Re-registration branch (existing patient)
        if request.data.get("patient_id"):
            try:
                patient = Patient.objects.get(patient_id=request.data["patient_id"])
            except Patient.DoesNotExist:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            complaint = request.data.get("complaint", "")
            priority_level = determine_priority()
            last_queue_number = TemporaryStorageQueue.objects.aggregate(Max('queue_number'))['queue_number__max']
            queue_number = (last_queue_number or 0) + 1
            print("🔥 Assigned Queue Number:", queue_number)

            queue_entry = TemporaryStorageQueue.objects.create(
                patient=patient,
                priority_level=priority_level,
                queue_number=queue_number,
                complaint=complaint,
                status='Waiting'
            )

            queue_entries = TemporaryStorageQueue.objects.filter(patient=patient).order_by("created_at")
            queue_entries_data = [{
                "id": entry.id,
                "priority_level": entry.priority_level,
                "status": entry.status,
                "queue_number": entry.queue_number,
                "complaint": entry.complaint
            } for entry in queue_entries]

            patient_serializer = PatientRegistrationSerializer(patient)
            return Response({
                "message": "Patient re-admitted successfully.",
                "patient": patient_serializer.data,
                "queue_entries": queue_entries_data
            }, status=status.HTTP_201_CREATED)

        # New patient registration branch
        else:
            serializer = PatientRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                print("🔄 Validated Data:", validated_data)

                if validated_data.get("date_of_birth"):
                    validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

                try:
                    # Extract and remove complaint from validated data
                    complaint = validated_data.get('complaint', '')
                    priority_level = validated_data.get('priority_level', 'Regular')
                    last_queue_number = TemporaryStorageQueue.objects.aggregate(Max('queue_number'))['queue_number__max']
                    queue_number = (last_queue_number or 0) + 1
                    print("🔥 Assigned Queue Number:", queue_number)

                    patient = Patient.objects.create(
                        first_name=validated_data.get('first_name', ''),
                        middle_name=validated_data.get('middle_name', ''),
                        last_name=validated_data['last_name'],
                        email=validated_data['email'],
                        phone_number=validated_data['phone_number'],
                        date_of_birth=datetime.strptime(validated_data['date_of_birth'], '%Y-%m-%d').date(),
                        street_address=validated_data.get('street_address', ''),
                        barangay=validated_data.get('barangay', ''),
                        municipal_city=validated_data.get('municipal_city', '')
                    )

                    queue_entry = TemporaryStorageQueue.objects.create(
                        patient=patient,
                        priority_level=priority_level,
                        queue_number=queue_number,
                        complaint=complaint,
                        status='Waiting'
                    )

                    patient_serializer = PatientRegistrationSerializer(patient)
                    return Response({
                        "message": "Patient registered successfully.",
                        "patient": patient_serializer.data,
                        "queue_entry": {
                            "id": queue_entry.id,
                            "priority_level": queue_entry.priority_level,
                            "status": queue_entry.status,
                            "queue_number": queue_entry.queue_number,
                            "complaint": queue_entry.complaint
                        }
                    }, status=status.HTTP_201_CREATED)

                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchPatient(APIView):
    def get(self, request, format=None):
        query = request.GET.get('q', '')
        
        # Prefetch the related TemporaryStorageQueue objects ordered by created_at (descending)
        queue_prefetch = Prefetch(
            'temporarystoragequeue',
            queryset=TemporaryStorageQueue.objects.order_by('-created_at')
        )
        
        if query:
            patients = Patient.objects.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(phone_number__icontains=query) |
                Q(temporarystoragequeue__complaint__icontains=query)
            ).distinct().prefetch_related(queue_prefetch)
        else:
            patients = Patient.objects.all().prefetch_related(queue_prefetch)
        
        data = []
        for patient in patients:
            # This returns the most recent queue entry because of our ordering
            latest_queue = patient.temporarystoragequeue.first()
            data.append({
                'patient_id': patient.patient_id,
                'first_name': patient.first_name,
                'middle_name': patient.middle_name,
                'last_name': patient.last_name,
                'email': patient.email,
                'phone_number': patient.phone_number,
                'date_of_birth': patient.date_of_birth.strftime('%Y-%m-%d'),
                'street_address': patient.street_address,
                'barangay': patient.barangay,
                'municipal_city': patient.municipal_city,
                'complaint': latest_queue.complaint if latest_queue else None,
                'age': patient.get_age(),
            })

        return Response({'patients': data}, status=status.HTTP_200_OK)

class GetQueue(APIView):
    def get(self, request, format=None):
        patient_id = request.GET.get('patient_id')
        if not patient_id:
            return Response({'error': 'patient_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            queue = TemporaryStorageQueue.objects.filter(
                patient__patient_id=patient_id
            ).order_by('-created_at').first()

            data = {
                'complaint': queue.complaint or "General Illness",
            }
            return Response(data, status=status.HTTP_200_OK)
        except TemporaryStorageQueue.DoesNotExist:
            return Response({'complaint': "General Illness"}, status=status.HTTP_200_OK)

class AcceptButton(APIView):
    def post(self, request):
        try:
            print("📥 Received Data:", request.data)  # Log raw request data
            patient_id = request.data.get("patient_id")
            print("🔍 Looking for Patient ID:", patient_id)

            # Retrieve the latest queue entry for the given patient
            queue_entry = TemporaryStorageQueue.objects.filter(
                patient__patient_id=patient_id
            ).order_by('-created_at').first()
            
            if not queue_entry:
                print("❌ Queue entry not found!")
                return Response({"error": "Queue entry not found"}, status=status.HTTP_404_NOT_FOUND)
            
            print("Found queue entry:", queue_entry)
            # Update the status to "Queued for Assessment"
            queue_entry.status = "Queued for Assessment"
            queue_entry.save()

            return Response({"message": "Status updated successfully", "status": queue_entry.status}, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
