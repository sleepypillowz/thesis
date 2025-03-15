from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404, FileResponse
from django.shortcuts import get_object_or_404


from queueing.serializers import PreliminaryAssessmentBasicSerializer
from .serializers import PatientSerializer, PatientRegistrationSerializer, LabRequestSerializer, LabResultSerializer
from queueing.models import Patient, PreliminaryAssessment, TemporaryStorageQueue
from datetime import datetime
from django.db.models import Max
from django.db.models import Q, Prefetch

# Supabase credentials
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.supabase_client import supabase
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.permissions import IsMedicalStaff, isDoctor, isSecretary, isAdmin

from rest_framework import generics
from .models import LabRequest, LabResult
from rest_framework.parsers import MultiPartParser, FormParser


class PatientListView(APIView):
    permission_classes = [IsMedicalStaff]

    def get(self, request):
        try:
            response = supabase.table("patient_patient").select(
                "*, queueing_temporarystoragequeue(id, status, created_at, priority_level, queue_number, complaint)"
            ).execute()

            print('Full response:', response)

            if hasattr(response, 'error') and response.error:
                error_msg = getattr(response.error, 'message', 'Unknown error')
                return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

            patients = response.data if hasattr(response, 'data') else response

            for patient in patients:
                patient_id = patient.get('id', 'unknown')
                queue_list = patient.get('queueing_temporarystoragequeue') or []
                
                if queue_list:
                    sorted_queue = sorted(
                        queue_list,
                        key=lambda q: q.get('created_at'),
                        reverse=True
                    )
                    latest_queue = sorted_queue[0]
                    print(f"Latest queue for patient {patient_id}: {latest_queue}")
                else:
                    print(f"No queue entries for patient {patient_id}.")

            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Exception occurred:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PreliminaryAssessmentView(APIView):
    permission_classes = [IsMedicalStaff]
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
    permission_classes = [isDoctor] 

    def get(self, request): 
        try:
            # 1. Fetch all treatment records from Supabase.
            treatment_response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id, "
                "patient_patient(*), "
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(*)), "
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(*))"
            ).execute()

            if hasattr(treatment_response, 'error') and treatment_response.error:
                return Response({"error": treatment_response.error.message},
                                status=status.HTTP_400_BAD_REQUEST)

            treatment_data = treatment_response.data
            # Dictionary to group treatment records by patient_id.
            patient_treatments = {}

            for item in treatment_data:
                pid = item["patient_id"]

                # Retrieve the latest queue data for this patient.
                queue_response = supabase.table("queueing_temporarystoragequeue").select(
                    "id, priority_level, status, created_at, queue_number, complaint"
                ).eq("patient_id", pid).order("created_at", desc=True).execute()
                queue_data = queue_response.data[0] if queue_response.data else None

                # Use the queue status if available.
                # If the status is "draft", we consider that as "Ongoing for Treatment".
                status_value = queue_data["status"] if queue_data and queue_data.get("status") else None
                if status_value and status_value.lower() == "draft":
                    status_value = "Ongoing for Treatment"
                elif not status_value:
                    status_value = "Unknown"

                # Build patient info from the treatment record.
                patient_data = {
                    **item.get("patient_patient", {}),
                    "queue_data": queue_data
                }

                # Build a treatment summary.
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
                    ],
                    "status": status_value,
                }

                # If patient doesn't exist in our dictionary yet, add them.
                # Otherwise, update if this record is more recent.
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

            # 2. Now, include patients who have no treatment record.
            queue_all_response = supabase.table("queueing_temporarystoragequeue").select(
                "id, priority_level, status, created_at, queue_number, complaint, patient_id"
            ).execute()

            if queue_all_response.data:
                for q_item in queue_all_response.data:
                    pid = q_item["patient_id"]
                    if pid not in patient_treatments:
                        # Fetch patient details from the "patient" table
                        patient_response = supabase.table("patient_patient").select(
                            "patient_id, first_name, middle_name, last_name"
                        ).eq("patient_id", pid).execute()
                        if patient_response.data:
                            patient_info = patient_response.data[0]
                        else:
                            patient_info = {"patient_id": pid, "first_name": "", "middle_name": "", "last_name": ""}

                        patient_data = {
                            "patient_id": pid,
                            "first_name": patient_info.get("first_name", ""),
                            "middle_name": patient_info.get("middle_name", ""),
                            "last_name": patient_info.get("last_name", ""),
                            "queue_data": q_item
                        }
                        default_treatment_summary = {
                            "id": None,
                            "treatment_notes": "",
                            "created_at": "",  # or "1970-01-01T00:00:00Z"
                            "updated_at": "",
                            "diagnoses": [],
                            "prescriptions": [],
                            "status": "Ongoing for Treatment"
                        }

                        patient_treatments[pid] = {
                            "patient": patient_data,
                            "latest_treatment": default_treatment_summary,
                            "latest_treatment_id": None
                        }


            # 3. Convert our dictionary into a list and return it.
            transformed = list(patient_treatments.values())
            return Response(transformed, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PatientTreatmentListView(APIView):
    permission_classes = [IsMedicalStaff]
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
    permission_classes = [IsMedicalStaff]
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
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(*, medicine_medicine(id, name)))"
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
                            {
                                **p["patient_prescription"],
                                "medication": p["patient_prescription"].pop("medicine_medicine")
                            }
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
    permission_classes = [isSecretary]

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
    permission_classes = [IsMedicalStaff]
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
    permission_classes = [IsMedicalStaff]
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
    permission_classes = [IsMedicalStaff]
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
        
class SaveButton(APIView):
    permission_classes = [isDoctor]
    def post(self, request, *args, **kwargs):
        try:
            print("📥 Received Data:", request.data)
            patient_id = request.data.get("patient_id")
            print("🔍 Looking for Patient ID:", patient_id)

            # Retrieve the latest queue entry for the given patient
            queue_entry = TemporaryStorageQueue.objects.filter(
                patient__patient_id=patient_id
            ).order_by('-created_at').first()

            if not queue_entry:
                print("❌ Queue entry not found!")
                return Response(
                    {"error": "Queue entry not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            print("Found queue entry:", queue_entry)
            # Update the status to "Ongoing Treatment"
            queue_entry.status = "Ongoing for Treatment"
            queue_entry.save()

            return Response({"message": "Status updated successfully", "status": queue_entry.status}, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
# Lab results
class LabRequestCreateView(generics.CreateAPIView):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [isDoctor]
    
    def perform_create(self, serializer):
        serializer.save()
        
class LabResultCreateView(generics.CreateAPIView):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [isSecretary]
    parser_classes = [MultiPartParser, FormParser]  # Add these to handle file uploads

    def perform_create(self, serializer):
        lab_result = serializer.save(submitted_by=self.request.user)
        if lab_result.lab_request:
            lab_result.lab_request.status = "Completed"
            lab_result.lab_request.save()

        
class LabRequestListView(generics.ListAPIView):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [IsMedicalStaff]
    
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient_id')
        qs = LabRequest.objects.filter(status="Pending")
        if patient_id:
            qs = qs.filter(patient__patient_id=patient_id)
        return qs
    
class LabRequestDetailView(generics.RetrieveAPIView):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [IsMedicalStaff]

class LabResultListView(generics.ListAPIView):
    serializer_class = LabResultSerializer
    permission_classes = [isDoctor]

    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        queryset = LabResult.objects.filter(
            lab_request__patient__patient_id=patient_id
        )
        if not queryset.exists():
            raise Http404("No Lab Results found for the given patient.")
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"lab_results": serializer.data})


## download
def download_lab_result(request, result_id):
    lab_result = get_object_or_404(LabResult, id=result_id)
    
    # Ensure there is an associated image
    if not lab_result.image:
        raise Http404("No file associated with this laboratory result.")
    
    # Open the image file and prepare the FileResponse
    response = FileResponse(lab_result.image.open(), as_attachment=True)
    # Extract the filename from the image path (optional: modify as needed)
    filename = lab_result.image.name.split('/')[-1]
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response
    