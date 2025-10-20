from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404, FileResponse
from django.shortcuts import get_object_or_404
from django.db.models.functions import Lower
from django.utils.timezone import now

from queueing.serializers import PreliminaryAssessmentBasicSerializer
from .serializers import PatientMedicalRecordSerializer, PatientSerializer, PatientRegistrationSerializer, LabRequestSerializer, LabResultSerializer, PatientVisitSerializer, PatientLabTestSerializer, CommonDiseasesSerializer
from queueing.models import  PreliminaryAssessment, TemporaryStorageQueue
from queueing.models import Treatment as TreatmentModel

from datetime import datetime
from django.db.models import Max
from django.db.models import Q, Prefetch
from patient.models import Patient, Prescription

# Supabase credentials
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.supabase_client import supabase
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.permissions import IsMe, IsMedicalStaff, isDoctor, isSecretary, isAdmin
from rest_framework.permissions import IsAuthenticated

from rest_framework import generics
from .models import LabRequest, LabResult, Diagnosis
from rest_framework.parsers import MultiPartParser, FormParser

#reports
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils.dateparse import parse_date
from collections import defaultdict

# create user
from user.models import UserAccount

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from queueing.utils import compute_queue_snapshot

class PatientListView(APIView):
    permission_classes = [IsMedicalStaff]

    def get(self, request):
        try:
            role = getattr(request.user, "role", None)
            print(role)
            user_id = request.user.id
            print(user_id)
            if role == "on-call-doctor" and user_id != "cooper-020006" :
                response = supabase.table("queueing_treatment").select(
                    "patient_patient(*, queueing_temporarystoragequeue(id, status, created_at, priority_level, queue_number, complaint))"
                ).eq("doctor_id",user_id).execute()
                
                patients = [t["patient_patient"] for t in response.data if "patient_patient" in t]
            elif role in ["secretary", "admin"] or user_id == "cooper-020006":
                response = (
                    supabase.table("patient_patient").select("*, queueing_temporarystoragequeue(id, status, created_at, priority_level, queue_number, complaint)").execute()
                )
                patients = response.data
            else: 
                return Response(
                    {"error": "Unauthorized role"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
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
    
class PatientInfoView(APIView):
    permission_classes = [IsMedicalStaff]
    
    def get(self, request, patient_id):
        try: 
            # Fetch patient details
            response = supabase.table("patient_patient").select("*").eq("patient_id", patient_id).execute()
            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            patient_data = response.data[0] if response.data else None
            if not patient_data:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            if patient_data.get("date_of_birth"):
                try:
                    patient_data['date_of_birth'] = datetime.strptime(patient_data["date_of_birth"], "%Y-%m-%d").date()
                except Exception as e:
                    patient_data["date_of_birth"] = None
                    
            patient_age = Patient(**patient_data)
            patient_data['age'] = patient_age.get_age()
            
            # Fetch latest queue data
            queue_response = supabase.table("queueing_temporarystoragequeue").select(
                "id, priority_level, created_at, queue_number, complaint, status"
            ).eq("patient_id", patient_id).order("created_at", desc=True).execute()
            queue_data = queue_response.data[0] if queue_response.data else None

            # Fetch latest treatment with related diagnoses and prescriptions
            treatment_response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id, "
                "queueing_treatment_diagnoses(id, diagnosis_id, patient_diagnosis(*)), "
                "queueing_treatment_prescriptions(id, prescription_id, patient_prescription(*, medicine_medicine(id, name)))"
            ).eq("patient_id", patient_id).order("created_at", desc=True).limit(1).execute()
            
            appointment_response = supabase.table('appointment_appointment').select(
                "appointment_date, status, doctor_id, "
                "appointment_appointmentreferral(id, reason)"
            ).eq('patient_id', patient_id).order('appointment_date', desc=True).execute()
            appointment_data = appointment_response.data or [] 
            print(appointment_data)
            doctor_ids = list({a["doctor_id"] for a in appointment_data if a.get("doctor_id")})
            doctor_name_map = {}
            
            if doctor_ids:
                doctors_resp = supabase.table("user_doctor") \
                    .select("id, user_useraccount ( first_name, last_name )") \
                    .in_("id", doctor_ids) \
                    .execute()
                for doc in doctors_resp.data or []:
                        ua = doc.get("user_useraccount") or {}
                        doctor_name_map[doc["id"]] = f"{ua.get('first_name','')} {ua.get('last_name','')}".strip()
                            
            annotated_appts = []
            for a in appointment_data:
                referral = a.get("appointment_appointmentreferral", {})
                reason   = referral.get("reason", "")
                annotated_appts.append({
                    "appointment_date": a["appointment_date"],
                    "status": a["status"],
                    "doctor_id": a["doctor_id"],
                    "doctor_name": doctor_name_map.get(a["doctor_id"], ""),
                    "reason":           reason,
                })       
                    
            latest_treatment = treatment_response.data[0] if treatment_response.data else None
            if latest_treatment:
                diagnoses = [
                    d["patient_diagnosis"] for d in latest_treatment.get("queueing_treatment_diagnoses", []) if d.get("patient_diagnosis")
                ]
                prescriptions = [
                    p["patient_prescription"] for p in latest_treatment.get("queueing_treatment_prescriptions", []) if p.get("patient_prescription")
                ]
                treatment_summary = {
                    "id": latest_treatment["id"],
                    "treatment_notes": latest_treatment["treatment_notes"],
                    "created_at": latest_treatment["created_at"],
                    "updated_at": latest_treatment["updated_at"],
                    "diagnoses": diagnoses,
                    "prescriptions": prescriptions,
                }
            else:
                # If no treatment found, return an empty structure
                treatment_summary = {
                    "id": None,
                    "treatment_notes": "",
                    "created_at": "",
                    "updated_at": "",
                    "diagnoses": [],
                    "prescriptions": [],
                }

            # Construct response data
            response_data = {
                "patient": {
                    **patient_data,
                    "queue_data": queue_data
                },
                "latest_treatment": treatment_summary,
                "latest_treatment_id": treatment_summary["id"],
                "appointments": annotated_appts, 
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
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
            # 1. Fetch all treatment records from Supabase in a single query
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
            
            # 2. Fetch all queue data in a single query
            queue_response = supabase.table("queueing_temporarystoragequeue").select(
                "id, priority_level, status, created_at, queue_number, complaint, patient_id"
            ).execute()
            
            # Create a mapping of patient_id to their latest queue data
            queue_map = {}
            for queue_item in queue_response.data:
                pid = queue_item["patient_id"]
                # Keep only the most recent queue item for each patient
                if pid not in queue_map or queue_item["created_at"] > queue_map[pid]["created_at"]:
                    queue_map[pid] = queue_item
            
            # 3. Get all patient IDs from both treatments and queues
            treatment_patient_ids = {item["patient_id"] for item in treatment_data}
            queue_patient_ids = set(queue_map.keys())
            all_patient_ids = treatment_patient_ids.union(queue_patient_ids)
            
            # 4. Fetch all patient details in a single query
            patient_response = supabase.table("patient_patient").select(
                "patient_id, first_name, middle_name, last_name"
            ).in_("patient_id", list(all_patient_ids)).execute()
            
            # Create a mapping of patient_id to patient details
            patient_map = {p["patient_id"]: p for p in patient_response.data}

            # Dictionary to group treatment records by patient_id.
            patient_treatments = {}

            # Process patients with treatments
            for item in treatment_data:
                pid = item["patient_id"]
                
                # Get queue data from our pre-fetched map
                queue_data = queue_map.get(pid)
                
                # Use the queue status if available.
                status_value = queue_data["status"] if queue_data and queue_data.get("status") else None
                if status_value and status_value.lower() == "draft":
                    status_value = "Ongoing for Treatment"
                elif not status_value:
                    status_value = "Unknown"

                # Build patient info from the treatment record or patient map
                patient_info = item.get("patient_patient", {}) or patient_map.get(pid, {})
                patient_data = {
                    **patient_info,
                    "queue_data": queue_data
                }

                # Extract diagnoses and prescriptions with proper error handling
                diagnoses = []
                prescriptions = []
                
                # Handle diagnoses
                for d in item.get("queueing_treatment_diagnoses", []):
                    if isinstance(d, dict) and "patient_diagnosis" in d and isinstance(d["patient_diagnosis"], dict):
                        diagnoses.append(d["patient_diagnosis"])
                
                # Handle prescriptions
                for p in item.get("queueing_treatment_prescriptions", []):
                    if isinstance(p, dict) and "patient_prescription" in p and isinstance(p["patient_prescription"], dict):
                        prescriptions.append(p["patient_prescription"])

                # Build a treatment summary.
                treatment_summary = {
                    "id": item["id"],
                    "treatment_notes": item["treatment_notes"],
                    "created_at": item["created_at"],
                    "updated_at": item["updated_at"],
                    "diagnoses": diagnoses,
                    "prescriptions": prescriptions,
                    "status": status_value,
                }

                # If patient doesn't exist in our dictionary yet, add them.
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

            # 5. Add patients who have no treatment record but have queue data
            for pid in (queue_patient_ids - treatment_patient_ids):
                if pid in queue_map:
                    q_item = queue_map[pid]
                    
                    # Get patient info from our pre-fetched map
                    patient_info = patient_map.get(pid, {"patient_id": pid, "first_name": "", "middle_name": "", "last_name": ""})
                    
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
                        "created_at": "",
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

            # 6. Convert our dictionary into a list and return it.
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
                """
                id, 
                treatment_notes, 
                created_at, 
                updated_at, 
                patient_id, 
                doctor_id(
                    id,
                    first_name,
                    last_name,
                    user_doctor(specialization)
                ),
                queueing_treatment_diagnoses(
                    id, 
                    treatment_id, 
                    diagnosis_id, 
                    patient_diagnosis(*)
                ), 
                queueing_treatment_prescriptions(
                    id, 
                    treatment_id, 
                    prescription_id, 
                    patient_prescription(*, medicine_medicine(id, name))
                )
                """
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
                    # 1. Safe doctor layer
                    raw_doc     = item.get("doctor_id") or {}
                    raw_profile = raw_doc.get("user_doctor") or {}

                    doctor_info = {
                        "id":             raw_doc.get("id"),
                        "name":           " ".join(filter(None, [raw_doc.get("first_name"), raw_doc.get("last_name")])),
                        "specialization": raw_profile.get("specialization")
                    }

                    # 2. Safe diagnoses
                    diagnoses = [
                        d["patient_diagnosis"]
                        for d in item.get("queueing_treatment_diagnoses", [])
                        if d.get("patient_diagnosis")
                    ]

                    # 3. Safe prescriptions
                    prescriptions = []
                    for p in item.get("queueing_treatment_prescriptions", []):
                        presc = p.get("patient_prescription")
                        if not presc:
                            continue
                        med = presc.pop("medicine_medicine", None)
                        prescriptions.append({ **presc, "medication": med })

                    transformed_treatments.append({
                        "id":             item.get("id"),
                        "treatment_notes":item.get("treatment_notes"),
                        "created_at":     item.get("created_at"),
                        "updated_at":     item.get("updated_at"),
                        "doctor_info":    doctor_info,
                        "diagnoses":      diagnoses,
                        "prescriptions":  prescriptions
                    })


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
            queue_entries = TemporaryStorageQueue.objects.filter(
                patient=request.data.get("patient_id")
            ).order_by("created_at")
            if queue_entries.exists():
                queue_entry = queue_entries.first()
                return queue_entry.priority_level
            return "Regular"

        # generate queue number with daily reset + max 50 reset
        def generate_queue_number():
            today = now().date()
            last_queue_number = TemporaryStorageQueue.objects.filter(
                created_at__date=today
            ).aggregate(Max('queue_number'))['queue_number__max']

            if last_queue_number is None:
                return 1
            elif last_queue_number >= 50:
                return 1
            else:
                return last_queue_number + 1


        raw_complaint = request.data.get("complaint", "")
        
        if raw_complaint == "Other":
            raw_complaint = request.data.get("other_complaint", "").strip()
            
        queue_number = generate_queue_number()
        print("Assigned Queue Number:", queue_number)     
        
        if request.data.get('patient_id'):
            try:
                patient = Patient.objects.get(patient_id=request.data['patient_id'])
                priority_level = determine_priority()
                
                queue_entry = TemporaryStorageQueue.objects.create(
                    patient=patient,
                    priority_level=priority_level,
                    queue_number=queue_number,
                    complaint=raw_complaint,
                    status='Waiting'
                )
                return Response({
                    "message": "Patient added to queue successfully.",
                    "queue_entry": {
                        "id": queue_entry.id,
                        "patient_id": patient.patient_id,
                        "patient_name": f"{patient.first_name} {patient.last_name}",
                        "priority_level": queue_entry.priority_level,
                        "status": queue_entry.status,
                        "queue_number": queue_entry.queue_number,
                        "complaint": queue_entry.complaint
                    }
                }, status=status.HTTP_201_CREATED)

            except Patient.DoesNotExist:
                return Response(
                    {"error": "Patient not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            serializer = PatientRegistrationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            validated_data = serializer.validated_data
            print("🔄 Validated Data:", validated_data)

            if UserAccount.objects.filter(email=validated_data['email']).exists():
                return Response({"error": "Email already registered."}, status=400)

            priority_level = request.data.get("priority_level", "Regular")
            
            queue_entry = TemporaryStorageQueue.objects.create(
                temp_first_name=validated_data.get('first_name', ''),
                temp_middle_name=validated_data.get('middle_name', ''),
                temp_last_name=validated_data['last_name'],
                temp_email=validated_data['email'],
                temp_phone_number=validated_data['phone_number'],
                temp_date_of_birth=validated_data['date_of_birth'],
                temp_gender=validated_data.get('gender', ''),
                temp_street_address=validated_data.get('street_address', ''),
                temp_barangay=validated_data.get('barangay', ''),
                temp_municipal_city=validated_data.get('municipal_city', ''),
                
                # Queue-specific fields
                priority_level=priority_level,
                queue_number=queue_number,
                complaint=raw_complaint,
                status='Waiting',
                is_new_patient=True            
            )
            return Response({
                "message": "Patient registration pending acceptance.",
                "queue_entry": {
                    "id": queue_entry.id,
                    "temp_patient_name": f"{validated_data.get('first_name', '')} {validated_data['last_name']}",
                    "priority_level": queue_entry.priority_level,
                    "status": queue_entry.status,
                    "queue_number": queue_entry.queue_number,
                    "complaint": queue_entry.complaint,
                    "is_new_patient": True
                }
            }, status=status.HTTP_201_CREATED)
        # # existing patient
        # if request.data.get("patient_id"):
        #     try:
        #         patient = Patient.objects.get(
        #             patient_id=request.data["patient_id"]
        #         )
        #     except Patient.DoesNotExist:
        #         return Response(
        #             {"error": "Patient not found"},
        #             status=status.HTTP_404_NOT_FOUND
        #         )
            
        #     if not patient.user:
        #         raw_dob = patient.date_of_birth
        #         password = f"{patient.patient_id}{raw_dob.strftime('%Y%m%d')}"

        #         user = UserAccount.objects.create_user(
        #             email = patient.email,
        #             password = password,
        #             first_name = patient.first_name,
        #             last_name = patient.last_name,
        #             role='patient'
        #         )
        #         patient.user = user
        #         patient.save()
        #     # Pull the raw complaint; if "Other", override with free text
        #     raw_complaint = request.data.get("complaint", "")
        #     if raw_complaint == "Other":
        #         raw_complaint = request.data.get("other_complaint", "").strip()

        #     priority_level = determine_priority()
        #     queue_number = generate_queue_number()
        #     print("Assigned Queue Number:", queue_number)

        #     queue_entry = TemporaryStorageQueue.objects.create(
        #         patient=patient,
        #         priority_level=priority_level,
        #         queue_number=queue_number,
        #         complaint=raw_complaint,
        #         status='Waiting'
        #     )

        #     queue_entries = TemporaryStorageQueue.objects.filter(
        #         patient=patient
        #     ).order_by("created_at")
        #     queue_entries_data = [
        #         {
        #         "id": entry.id,
        #         "priority_level": entry.priority_level,
        #         "status": entry.status,
        #         "queue_number": entry.queue_number,
        #         "complaint": entry.complaint
        #         } 
        #         for entry in queue_entries
        #     ]
        #     patient_serializer = PatientRegistrationSerializer(patient)
        #     print(patient_serializer.data)
        #     return Response({
        #         "message": "Patient re-admitted successfully.",
        #         "patient": patient_serializer.data,
        #         "queue_entries": queue_entries_data
        #     }, status=status.HTTP_201_CREATED)

        # # new patient
        # serializer = PatientRegistrationSerializer(data=request.data)
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # validated_data = serializer.validated_data
        # print("🔄 Validated Data:", validated_data)
        
        # if UserAccount.objects.filter(email=validated_data['email']).exists():
        #     return Response({"error": "Email already registered."}, status=400)

        # try:
            
        #     raw_dob = validated_data['date_of_birth']
        #     user = UserAccount.objects.create_user(
        #         email = validated_data['email'],
        #         password = 'temp-password',
        #         first_name = validated_data.get('first_name', ''),
        #         last_name = validated_data.get('last_name', ''),
        #         role='patient'               
        #     )
        #     patient = Patient.objects.create(
        #         first_name=validated_data.get('first_name', ''),
        #         middle_name=validated_data.get('middle_name', ''),
        #         last_name=validated_data['last_name'],
        #         email=validated_data['email'],
        #         phone_number=validated_data['phone_number'],
        #         date_of_birth=validated_data['date_of_birth'],
        #         gender=validated_data.get('gender', ''),
        #         street_address=validated_data.get('street_address', ''),
        #         barangay=validated_data.get('barangay', ''),
        #         municipal_city=validated_data.get('municipal_city', ''),
        #         user=user               
        #     )
            
        #     password = f"{patient.patient_id}{raw_dob.strftime('%Y%m%d')}"
        #     user.set_password(password)
        #     user.save()
        #     # Extract the dropdown complaint
        #     complaint_value = validated_data.get('complaint', '')
        #     # If the user chose "Other", override with the free-text entry
        #     if complaint_value == "Other":
        #         complaint_value = request.data.get("other_complaint", "").strip()

        #     # Determine queue number
        #     queue_number = generate_queue_number()
        #     print("Assigned Queue Number:", queue_number)

        #     # Enqueue
        #     queue_entry = TemporaryStorageQueue.objects.create(
        #         patient=patient,
        #         priority_level=validated_data.get('priority_level', 'Regular'),
        #         queue_number=queue_number,
        #         complaint=complaint_value,
        #         status='Waiting'
        #     )

        #     patient_serializer = PatientRegistrationSerializer(patient)
        #     return Response({
        #         "message": "Patient registered successfully.",
        #         "patient": patient_serializer.data,
        #         "queue_entry": {
        #             "id": queue_entry.id,
        #             "priority_level": queue_entry.priority_level,
        #             "status": queue_entry.status,
        #             "queue_number": queue_entry.queue_number,
        #             "complaint": queue_entry.complaint
        #         }
        #     }, status=status.HTTP_201_CREATED)

        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SearchPatient(APIView):
    permission_classes = [IsMedicalStaff]
    def get(self, request, format=None):
        query = request.GET.get('q', '')
        
        # Prefetch the related TemporaryStorageQueue objects ordered by created_at (descending)
        queue_prefetch = Prefetch(
            'temporarystoragequeue',
            queryset=TemporaryStorageQueue.objects.order_by('-created_at')
        )
        
        months = {
            'january': 1, 'february': 2, "march": 3, "april": 4, "may": 5, "june": 6,
            "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
        }
        month_number = months.get(query, None)
        
        if query:
            patients = Patient.objects.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(phone_number__icontains=query) |
                (Q(date_of_birth__isnull=False) & Q(date_of_birth__month=month_number) if month_number else Q()) |
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
            print("🔍 Raw request data:", request.data)
            
            action = request.data.get('action')
            queue_entry_id = request.data.get("queue_entry_id")
            
            if not queue_entry_id:
                print("❌ Missing queue_entry_id entirely")
                return Response({"error": "Missing queue_entry_id in request."}, status=status.HTTP_400_BAD_REQUEST)
            
            if queue_entry_id == "null" or queue_entry_id == "undefined":
                print("❌ queue_entry_id is string 'null' or 'undefined':", queue_entry_id)
                return Response({"error": "Invalid queue_entry_id format."}, status=status.HTTP_400_BAD_REQUEST)
            
            print("✅ Action:", action)
            print("✅ Queue Entry ID:", queue_entry_id, "Type:", type(queue_entry_id))

            # Try to convert to integer
            try:
                queue_entry_id_int = int(queue_entry_id)
            except (ValueError, TypeError):
                print("❌ Cannot convert queue_entry_id to integer:", queue_entry_id)
                return Response({"error": "Invalid queue_entry_id format."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Retrieve the queue entry
            queue_entry = TemporaryStorageQueue.objects.get(id=queue_entry_id_int)
            print("✅ Found queue entry:", queue_entry.id)
            
            # If this is a new patient, create the Patient record first
            if queue_entry.is_new_patient:
                print("🆕 Creating new patient record...")
                # Create UserAccount for the new patient
                raw_dob = queue_entry.temp_date_of_birth
                user = UserAccount.objects.create_user(
                    email=queue_entry.temp_email,
                    password='temp-password',  # Will be set properly below
                    first_name=queue_entry.temp_first_name,
                    last_name=queue_entry.temp_last_name,
                    role='patient'               
                )
                
                # Create Patient record
                patient = Patient.objects.create(
                    first_name=queue_entry.temp_first_name,
                    middle_name=queue_entry.temp_middle_name,
                    last_name=queue_entry.temp_last_name,
                    email=queue_entry.temp_email,
                    phone_number=queue_entry.temp_phone_number,
                    date_of_birth=queue_entry.temp_date_of_birth,
                    gender=queue_entry.temp_gender,
                    street_address=queue_entry.temp_street_address,
                    barangay=queue_entry.temp_barangay,
                    municipal_city=queue_entry.temp_municipal_city,
                    user=user               
                )
                
                # Set proper password
                password = f"{patient.patient_id}{raw_dob.strftime('%Y%m%d')}"
                user.set_password(password)
                user.save()
                
                # Link the queue entry to the newly created patient
                queue_entry.patient = patient
                queue_entry.is_new_patient = False  # Mark as processed
                queue_entry.save()
                print("✅ New patient created: patient_id =", patient.patient_id)            
                
            # Update status based on action
            if action == 'preliminary':
                queue_entry.status = "Queued for Assessment"
            elif action == 'treatment':
                queue_entry.status = "Queued for Treatment"
            elif action == 'lab':
                queue_entry.status = "Ongoing for Laboratory"
            else:
                return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
            
            queue_entry.save()
            print("✅ Queue entry status updated to:", queue_entry.status)

            # Broadcast updated snapshot
            print("🔄 Computing queue snapshot...")
            snapshot = compute_queue_snapshot()
            print("📊 Queue snapshot computed:", snapshot)
            
            channel_layer = get_channel_layer()
            print("📡 Broadcasting WebSocket update to 'registration_queue' group...")
            
            async_to_sync(channel_layer.group_send)(
                "registration_queue",
                {
                    "type": "queue_update",
                    "data": snapshot,
                }
            )
            
            print("✅ WebSocket broadcast completed")

            return Response({
                "message": "Status updated successfully",
                "status": queue_entry.status,
                "patient_created": queue_entry.is_new_patient
            }, status=status.HTTP_200_OK)

        except TemporaryStorageQueue.DoesNotExist:
            print("❌ Queue entry not found with ID:", queue_entry_id)
            return Response({"error": "Queue entry not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("❌ Error in POST Accept:", e)
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
    
    
class PatientReportview(APIView):
    permission_classes = [IsMedicalStaff]

    def get(self, request, patient_id):
        try:
            #fetch patient
            response = supabase.table("patient_patient").select("*").eq("patient_id",patient_id).execute()

            if hasattr(response, 'error') and response.error:
                error_msg = getattr(response.error, 'message', 'Unknown error')
                return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
            patient_info = response.data[0] if response.data else None
            #fetch patient latest preliminary assessment 
            assessment_obj = PreliminaryAssessment.objects.filter(patient__patient_id=patient_id).order_by("-assessment_date").first()
            if assessment_obj:
                assessment_data = PreliminaryAssessmentBasicSerializer(assessment_obj).data
            else:
                assessment_data = None
            
            #fetch recent medications
            treatment_response = supabase.table("queueing_treatment").select(
                """
                id, 
                treatment_notes, 
                created_at, 
                updated_at, 
                patient_id,             
                doctor_id(
                    id,
                    first_name,
                    last_name,
                    user_doctor(specialization)
                ),
                queueing_treatment_diagnoses(
                    id,
                    treatment_id,
                    diagnosis_id,
                    patient_diagnosis(*)
                ),
                queueing_treatment_prescriptions(
                    id,
                    treatment_id,
                    prescription_id,
                    patient_prescription(*, medicine_medicine(id, name))
                )
            """
            ).eq("patient_id", patient_id).order("created_at", desc=True).execute() 
            treatments = treatment_response.data
            
            # laboratory fetch
            lab_results_qs = LabResult.objects.filter(
                lab_request__patient__patient_id=patient_id
            )
            lab_results_serialized = []
            if lab_results_qs.exists():
                lab_results_serialized = LabResultSerializer(
                    lab_results_qs, many=True, context={'request': request}
                ).data
            else:
                lab_results_serialized = []
                
            all_diagnoses = []
            all_prescriptions = []
            all_treatment_notes = []
            
            patient_report = {
                "patient": patient_info,
                "preliminary_assessment": assessment_data,
                "recent_treatment": None,
                "all_treatment_notes": None,
                "all_prescriptions": None,
                "all_diagnoses": None,
                "laboratories":  lab_results_serialized
            }
            
            if treatments:
                transformed_treatments = []
                
                for item in treatments:
                    raw_doc     = item.get("doctor_id") or {}
                    raw_profile = raw_doc.get("user_doctor") or {}                    

                    doctor_info = {
                        "id": raw_doc.get("id"),
                        "name": " ".join(filter(None, [raw_doc.get("first_name"), raw_doc.get("last_name")])),
                        "specialization": raw_profile.get("specialization")
                    }
                    
                    diagnoses = [
                        d["patient_diagnosis"]
                        for d in item.get("queueing_treatment_diagnoses", [])
                        if d.get("patient_diagnosis")
                    ]
                    all_diagnoses.extend(diagnoses)
                    
                    prescriptions = []
                    for p in item.get("queueing_treatment_prescriptions", []):
                        presc = p.get("patient_prescription")
                        if not presc:
                            continue
                        med = presc.pop("medicine_medicine", None)
                        prescriptions.append({ **presc, "medication": med })
                    all_prescriptions.extend(prescriptions)
                    
                    treatment_notes = item.get("treatment_notes")
                    if treatment_notes:
                        all_treatment_notes.append(treatment_notes)
                    
                    transformed_treatments.append({
                        "id":             item.get("id"),
                        "treatment_notes":item.get("treatment_notes"),
                        "created_at":     item.get("created_at"),
                        "updated_at":     item.get("updated_at"),
                        "doctor_info":    doctor_info,
                        "diagnoses":      diagnoses,
                        "prescriptions":  prescriptions
                    })
                patient_report["recent_treatment"] = transformed_treatments[0]
                patient_report["all_treatment_notes"] = all_treatment_notes
                patient_report["all_prescriptions"] = all_prescriptions
                patient_report["all_diagnoses"] = all_diagnoses

            return Response(patient_report, status=status.HTTP_200_OK)

        except Exception as e:
            print("Exception ", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MonthlyVisitsAPIView(APIView):
    permission_classes = [IsMedicalStaff]
    def get(self, request):
        start_raw = request.query_params.get("start")
        end_raw = request.query_params.get("end")

        start_date = parse_date(str(start_raw)) if start_raw else None
        end_date = parse_date(str(end_raw)) if end_raw else None


        queryset = TemporaryStorageQueue.objects.all()

        if start_date and end_date:
            queryset = queryset.filter(created_at__date__range=(start_date, end_date))
        elif start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        elif end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)

        # Annotate with truncated month (creates a temporary alias, not a model field)
        monthly_data = (
            queryset
            .annotate(report_month=TruncMonth('created_at'))
            .values('report_month')
            .annotate(count=Count('id'))
            .order_by('report_month')
        )

        result = [
            {
                "month": entry["report_month"].strftime("%b %Y"),
                "count": entry["count"]
            }
            for entry in monthly_data if entry["report_month"]
        ]

        return Response(result)

class MonthlyPatientVisitsDetailedView(APIView):
    def get(self, request):
        # Optimize query with select_related to prevent N+1 queries
        visits = TemporaryStorageQueue.objects.select_related('patient').all().order_by("queue_date")
        
        # Get all patient IDs to fetch treatments in bulk
        patient_ids = [visit.patient.patient_id for visit in visits if visit.patient]
        
        # Fetch treatments in bulk from Supabase
        treatment_map = {}
        if patient_ids:
            treatment_response = supabase.table("queueing_treatment").select(
                "id, created_at, patient_id"
            ).in_("patient_id", patient_ids).execute()
            
            # Create a mapping of patient_id to latest treatment
            for treatment in treatment_response.data:
                patient_id = treatment['patient_id']
                if patient_id not in treatment_map or treatment['created_at'] > treatment_map[patient_id]['created_at']:
                    treatment_map[patient_id] = treatment
        
        serializer = PatientVisitSerializer(visits, many=True, context={'treatment_map': treatment_map})

        grouped_visits = defaultdict(list)
        for visit in serializer.data:
            visit_date = visit.get("visit_date")
            if visit_date:
                month = visit_date[:7]
                grouped_visits[month].append(visit)
                
        return Response(dict(grouped_visits))

    
class MonthlyLabResultAPIView(APIView):
    permission_classes = [IsMedicalStaff]
    def get(self, request):
        start_raw = request.query_params.get("start")
        end_raw = request.query_params.get("end")

        start_date = parse_date(str(start_raw)) if start_raw else None
        end_date = parse_date(str(end_raw)) if end_raw else None


        queryset = LabResult.objects.all()

        if start_date and end_date:
            queryset = queryset.filter(created_at__date__range=(start_date, end_date))
        elif start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        elif end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)

        # Annotate with truncated month (creates a temporary alias, not a model field)
        monthly_data = (
            queryset
            .annotate(report_month=TruncMonth('uploaded_at'))
            .values('report_month')
            .annotate(count=Count('id'))
            .order_by('report_month')
        )

        result = [
            {
                "month": entry["report_month"].strftime("%b %Y"),
                "count": entry["count"]
            }
            for entry in monthly_data if entry["report_month"]
        ]

        return Response(result)
    
class CommonDiseasesReportAPIView(APIView):
    permission_classes = [IsMedicalStaff]

    def get(self, request):
        common_diseases = (
            Diagnosis.objects
            .annotate(diagnosis_descriptions=Lower("diagnosis_description"))
            .values("diagnosis_descriptions")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        return Response(common_diseases)
    
class TotalPatientsAPIView(APIView):
    permission_classes = [IsMedicalStaff]

    def get(self, request):
        try:
            response = supabase.table("patient_patient").select("*").execute()

            if not hasattr(response, 'data') or not isinstance(response.data, list):
                return Response(
                    {"error": "Failed to fetch patient data"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            patients = response.data
            serializer = PatientSerializer(patients, many=True)

            return Response({
                "count": len(patients),
                "patients": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MonthlyLabTestView(generics.ListAPIView):
    permission_classes = [IsMedicalStaff]
    serializer_class = PatientLabTestSerializer
    
    def get_queryset(self):
        queryset = LabResult.objects.all()
        if not queryset.exists():
            raise Http404("No Lab Results found for the given patient.")
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"lab_results": serializer.data})

class CommonDiseasesView(generics.ListAPIView):
    permission_classes = [IsMedicalStaff]
    serializer_class = CommonDiseasesSerializer

    def get_queryset(self):
        return TreatmentModel.objects.select_related(
            'patient', 'doctor'
        ).prefetch_related(
            'diagnoses'  
        ).all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        if not queryset.exists():
            return Response(
                {"detail": "No treatment records found."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({'treatments': serializer.data})
    
class FrequentMedicationsView(generics.ListAPIView):
    permission_classes = [IsMedicalStaff]

    def get_queryset(self):
        return (
            Prescription.objects
            .values('medication__name')
            .annotate(prescription_count=Sum('quantity'))
            .order_by('-prescription_count')[:10]
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response({"medicines": queryset}, status=status.HTTP_200_OK)
        
class PatientTreatmentRecordsView(APIView):
    permission_classes = [IsAuthenticated, IsMe]

    def get(self, request):
        user = request.user

        # Ensure the user is a patient
        if not hasattr(user, 'patient_profile'):
            return Response(
                {"detail": "You are not authorized to access patient records."},
                status=403
            )

        patient = user.patient_profile

        # Get that patient's treatments
        treatments = TreatmentModel.objects.filter(patient=patient).order_by('-created_at')
        serializer = PatientMedicalRecordSerializer(treatments, many=True)
        return Response(serializer.data)