from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer, PatientRegistrationSerializer
from queueing.models import Patient, TemporaryStorageQueue
from datetime import datetime
from api.views import supabase
from django.db.models import Max
from queueing.serializers import TreatmentSerializer

# Supabase credentials
class PatientListView(APIView):
    def get(self, request):
        try:
            response = supabase.table("patient_patient").select(
                "*",
                "queueing_temporarystoragequeue(id, status, created_at, priority_level, queue_number)"
            ).execute()
            
            print(response)  # Debugging: Print full response
            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            patients = response.data if hasattr(response, 'data') else response
            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TreatmentListView(APIView):
    def get(self, request):
        try:
            response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id",
                "patient_patient(*)",
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(diagnosis_code, diagnosis_description, diagnosis_date))",
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(medication, dosage, frequency, start_date, end_date))"
            ).execute()

            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            supabase_data = response.data

            transformed = []
            for item in supabase_data:
                # Get the embedded patient data (expected key: "patient_patient")
                                # Fetch queue data from "queueing_temporarystoragequeue" for this patient
                queue_response = supabase.table("queueing_temporarystoragequeue").select(
                    "id, priority_level, status, created_at, queue_number"
                ).eq("patient_id", item.get("patient_id")).execute()
                queue_data = queue_response.data[0] if queue_response.data else None

                patient_data = {
                    **item.get("patient_patient", {}),
                    "queueing_temporarystoragequeue": queue_data  # ✅ Correct key name
                }

                # Build the transformed treatment data using "patient_patient" as the key
                transformed.append({
                    "id": item["id"],
                    "treatment_notes": item["treatment_notes"],
                    "created_at": item["created_at"],
                    "updated_at": item["updated_at"],
                    "patient": patient_data,
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
                })

            print("Transformed only", transformed[0])
            print("Transformed data patient keys:", transformed[0]['patient'].keys())
            # Should include 'queueing_temporarystoragequeue'

            serializer = TreatmentSerializer(instance=transformed, many=True)
            print("Serialized queue_data:", serializer.data[0]['patient']['queue_data'])

            # For debugging, print the nested queue data for each treatment's patient
            for treatment in serializer.data:
                print("Queue Data:", treatment['patient'].get('queue_data'))

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Make sure TreatmentSerializer and supabase are imported

class TreatmentDetailView(APIView):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            # Query the treatment with the given pk
            response = supabase.table("queueing_treatment").select(
                "id, treatment_notes, created_at, updated_at, patient_id",
                "patient_patient(*)",
                "queueing_treatment_diagnoses(id, treatment_id, diagnosis_id, patient_diagnosis(diagnosis_code, diagnosis_description, diagnosis_date))",
                "queueing_treatment_prescriptions(id, treatment_id, prescription_id, patient_prescription(medication, dosage, frequency, start_date, end_date))"
            ).eq("id", pk).execute()

            if hasattr(response, 'error') and response.error:
                return Response({"error": response.error.message}, status=status.HTTP_400_BAD_REQUEST)

            supabase_data = response.data
            if not supabase_data:
                return Response({"error": "Treatment not found"}, status=status.HTTP_404_NOT_FOUND)

            # Get the first (and expected only) treatment
            item = supabase_data[0]

            # Fetch queue data from "queueing_temporarystoragequeue" for this patient
            queue_response = supabase.table("queueing_temporarystoragequeue").select(
                "id, priority_level, status, created_at, queue_number"
            ).eq("patient_id", item.get("patient_id")).execute()
            queue_data = queue_response.data[0] if queue_response.data else None

            patient_data = {
                **item.get("patient_patient", {}),
                "queueing_temporarystoragequeue": queue_data  # Correct key name for queue data
            }

            # Build the transformed treatment data
            transformed = {
                "id": item["id"],
                "treatment_notes": item["treatment_notes"],
                "created_at": item["created_at"],
                "updated_at": item["updated_at"],
                "patient": patient_data,
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

            serializer = TreatmentSerializer(instance=transformed)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class PatientRegister(APIView):
    def post(self, request):
        print("📥 Received Data:", request.data)  # ✅ Log raw request data
        patient = PatientRegistrationSerializer(data=request.data)

        if patient.is_valid():
            validated_data = patient.validated_data
            print("🔄 Validated Data:", validated_data)

            # Convert date_of_birth to string (YYYY-MM-DD)
            if validated_data.get("date_of_birth"):
                validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

            try:
                priority_level = validated_data.get('priority_level', 'Regular')

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
                patient_serializer = PatientRegistrationSerializer(patient)
                return Response(patient_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"errors": patient.errors}, status=status.HTTP_400_BAD_REQUEST)
class AcceptButton(APIView):
    def post(self, request):
        try:
            print("📥 Received Data:", request.data)  # ✅ Log raw request data
            
            patient_id = request.data.get("patient_id")
            print("🔍 Looking for Patient ID:", patient_id)

            patient = TemporaryStorageQueue.objects.filter(patient_id=patient_id).first()
            
            if not patient:
                print("❌ Patient not found!")
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            # Update the status
            patient.status = "Queued for Assessment"
            patient.save()

            return Response({"message": "Status updated successfully", "status": patient.status}, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)