from django.shortcuts import render
import numpy as np
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Medicine
from .serializers import MedicineSerializer
from user.permissions import IsMedicalStaff, isSecretary, isDoctor
from rest_framework.views import APIView

from django.db.models import Q
from patient.serializers import PrescriptionSerializer
from patient.models import Prescription, Diagnosis
from queueing.models import Treatment

from backend.supabase_client import supabase
import pandas as pd
from sklearn.model_selection import train_test_split
import lightgbm as lgb
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_percentage_error
import math

from patient.serializers import PatientRegistrationSerializer

class MedicineView(generics.ListAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    
    permission_classes = [IsMedicalStaff]


class SearchMedicine(APIView):
    permission_classes = [IsMedicalStaff]  
    
    def get(self, request, format=None):
        query = request.GET.get('q', '')
        
        if query:
            medicines = Medicine.objects.filter(
                Q(name__icontains=query)
            ).distinct()
        else:
            medicines = Medicine.objects.none()
        
        data = []
        for medicine in medicines:
            data.append({
                'id': medicine.id,
                'name': medicine.name,
                'stocks': medicine.stocks, 
                'strength': medicine.strength
            })   
    
        return Response({'medicine': data}, status=status.HTTP_200_OK)
    
class PrescriptionViews(generics.ListAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    
    permission_classes = [isSecretary]


class ConfirmDispenseview(APIView):
    permission_classes = [isSecretary]
    def post(self, request):
        prescriptions_data = request.data.get("prescriptions", [])
        errors = []
        
        for item in prescriptions_data:
            prescription_id = item.get("id")
            try:
                confirmed = int(item.get("confirmed", 0))
            except (ValueError, TypeError):
                errors.append({"id": prescription_id, "error": "Invalid confirmed quantity"})
                continue

            try:
                prescription = Prescription.objects.get(id=prescription_id)
            except Prescription.DoesNotExist:
                errors.append({"id": prescription_id, "error": "Prescription not found"})
                continue

            if confirmed > prescription.quantity:
                errors.append({"id": prescription_id, "error": "Confirmed quantity exceeds the prescribed quantity"})
                continue

            medicine = prescription.medication
            if medicine.stocks < confirmed:
                errors.append({"id": prescription_id, "error": "Not enough stock available"})
                continue

            # Deduct the confirmed quantity from the medicine's stock
            medicine.stocks -= confirmed
            medicine.save()
        
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "All stocks updated successfully."}, status=status.HTTP_200_OK)

import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from lightgbm import LGBMRegressor
from rest_framework.views import APIView
from rest_framework.response import Response
from statsforecast import StatsForecast
from statsforecast.models import CrostonClassic

class Predict(APIView):
    permission_classes = [IsMedicalStaff]
    
    
    def get(self, request):
        medicines = supabase.table('medicine_medicine').select().execute()
        prescriptions = supabase.table('patient_prescription').select().execute()
    
        med_df = pd.DataFrame(medicines.data)
        pres_df = pd.DataFrame(prescriptions.data)
        
        pres_df['start_date'] = pd.to_datetime(pres_df['start_date']) 
        pres_df['month'] = pres_df['start_date'].dt.to_period('M').dt.to_timestamp()
        pres_df = pres_df.merge(med_df, left_on='medication_id', right_on='id', how='left')

        monthly = (
            pres_df
            .groupby(['medication_id', 'name', 'month'])
            .agg({'quantity': 'sum'})
            .reset_index()
        )
        
        results = []
        
        for medicine_id, group in monthly.groupby('medication_id'):
            if len(group) < 6:  # Minimum 6 months of data
                continue
                
            group = group.sort_values('month')
            group = group.set_index('month')
            
            full_range = pd.date_range(start=group.index.min(), end=group.index.max(), freq='MS')
            group = group.reindex(full_range)
            
            # Fill NaN values
            group['quantity'] = group['quantity'].fillna(0)
            group['name'] = group['name'].ffill()
            group['medication_id'] = group['medication_id'].ffill()

            
            sparsity = (group['quantity'] == 0).mean()
            # if lots of zeroes, use crostons via StatsForcast
            # lgbm if regular demand
            if sparsity > 0.7:  # More than 70% zeros
                # for intermittent demand
                non_zero = group[group['quantity'] > 0]
                if len(non_zero) > 1:
                    
                    sf_df = group.reset_index(names='month')[['month', 'quantity']].rename(
                        columns={'month':'ds', 'quantity':'y'}
                    )
                    sf_df['unique_id'] = medicine_id
                    sf = StatsForecast(
                        models=[CrostonClassic()], 
                        freq='M',
                        n_jobs=-1 # use all cpu
                    )
                    
                    forecast = sf.forecast(df=sf_df,h=3)
                    forecast = forecast['CrostonClassic'].tolist()
                    
                    # fitted = sf.fitted_[0]
                    # sf_df['yhat'] = fitted
                    
                    # mse = mean_squared_error(sf_df['y'], sf_df['yhat'])
                    # accuracy = 100/len(y) * np.sum(2 * np.abs(sf_df['yhat'] - y) / (np.abs(y) + np.abs(sf_df['yhat'])))
                    # r2 = r2_score(sf_df['y'], sf_df['yhat'])
                    mse, r2, accuracy = None, None, None
                else:
                    forecast = [0] * 3
                    mse, r2, accuracy = None, None, None
            else:
                group = group.reset_index()  
                group['month_index'] = range(len(group))
                group['lag_1'] = group['quantity'].shift(1)
                group['lag_2'] = group['quantity'].shift(2)
                group = group.dropna()  # Remove rows with missing lags
                
                if len(group) < 3:
                    continue
                    
                # Features and target
                features = ['month_index', 'lag_1', 'lag_2']
                X = group[features].values
                y = group['quantity'].values
                
                split_idx = int(0.8 * len(group))
                X_train, X_test = X[:split_idx], X[split_idx:]
                y_train, y_test = y[:split_idx], y[split_idx:]
                
                if len(X_train) < 2 or len(X_test) < 1:
                    continue
                    
                # Model training
                model = LGBMRegressor(
                    random_state=42,
                    n_estimators=100,
                    learning_rate=0.05,
                    max_depth=3,
                    num_leaves=15,
                    min_child_samples=5
                )
                model.fit(X_train, y_train)
                
                # Evaluation
                preds = model.predict(X_test)
                
                # Ensure no NaN values in predictions
                preds = np.nan_to_num(preds, nan=0.0, posinf=0.0, neginf=0.0)
                
                mse = float(mean_squared_error(y_test, preds)) if len(y_test) > 0 else None
                r2 = float(r2_score(y_test, preds)) if len(y_test) > 1 else None
                
                # Calculate accuracy safely
                accuracy = None
                if len(y_test) > 0 and (y_test > 0).all():
                    try:
                        mape = mean_absolute_error(y_test, preds) / np.mean(y_test)
                        accuracy = float(1 - mape) if not np.isnan(mape) else None
                    except: 
                        accuracy = None
                
                # Iterative forecasting
                last_row = group.iloc[-1]
                forecasts = []
                lag1 = last_row['quantity']
                lag2 = group.iloc[-2]['quantity'] if len(group) > 1 else 0
                
                for i in range(1, 4):  # Forecast next 3 months
                    next_idx = last_row['month_index'] + i
                    X_next = [[next_idx, lag1, lag2]]
                    pred = model.predict(X_next)[0]
                    
                    # Ensure prediction is valid
                    pred = max(0, pred)  # No negative predictions
                    if np.isnan(pred) or np.isinf(pred):
                        pred = 0.0
                    
                    forecasts.append(float(pred))  # Convert to Python float
                    
                    # Update lags
                    lag2 = lag1
                    lag1 = pred
                    
                forecast = forecasts
            
            # Ensure all values are JSON serializable
            result_item = {
                'medicine_id': int(medicine_id),
                'name': str(group['name'].iloc[0]),
                'mse': mse,
                'r2': r2,
                'accuracy': accuracy,
                'forecast_next_3_months': [int(x) for x in forecast]  # Ensure all floats
            }
            
            # Remove any None values that might cause issues
            result_item = {k: v for k, v in result_item.items() if v is not None}
            
            results.append(result_item)
            
        return Response({'results': results})
class MedicineCSVUploadView(APIView):
    permission_classes = [IsMedicalStaff]   
        
    def post(self, request):
        try:
            # basahin yung CSV file sa backend mismo
            df = pd.read_csv("medicine/medicines-malibiran.csv").rename(columns={
                "Name": "name",
                "Dosage Form": "dosage_form",
                "Strength": "strength",
                "Stock": "stocks",
                "Expiration Date": "expiration_date",
            })

            # insert sa supabase
            supabase.table("medicine_medicine").insert(df.to_dict(orient="records")).execute()

            return Response({"message": "Medicines uploaded successfully"}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# import random
# from datetime import date, timedelta

# from django.db import transaction
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from patient.models import Patient, Prescription
# from medicine.models import Medicine

# from datetime import date, datetime
# from django.db.models import Max
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from queueing.models import Patient, TemporaryStorageQueue
# class AddDummy(APIView):
#     permission_class = [isSecretary]
#     def post(self, request):
#         dummy_data = {
#             "first_name": "John",
#             "middle_name": "M",
#             "last_name": "Doe",
#             "email": "johndoe@example.com",
#             "phone_number": "09123456789",
#             "date_of_birth": date(2024, 9, 15),
#             "gender": "Male",
#             "street_address": "123 Main Street",
#             "barangay": "Barangay Uno",
#             "municipal_city": "Quezon City",
#             "agree_terms": True,
#             "complaint": "Check-up",
#             "priority_level": "Regular"
#         }
#         serializer = PatientRegistrationSerializer(data=dummy_data)
#         if not serializer.is_valid():
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         validated_data = serializer.validated_data
#         validated_data["date_of_birth"] = validated_data["date_of_birth"].strftime("%Y-%m-%d")

#         try:
#             # Handle complaint value
#             complaint_value = validated_data.get('complaint', '')
#             if complaint_value == "Other":
#                 complaint_value = ""  # No free-text in dummy

#             # Determine next queue number
#             last_queue_number = TemporaryStorageQueue.objects.aggregate(
#                 Max('queue_number')
#             )['queue_number__max']
#             queue_number = (last_queue_number or 0) + 1

#             # Create patient record
#             patient = Patient.objects.create(
#                 first_name=validated_data.get('first_name', ''),
#                 middle_name=validated_data.get('middle_name', ''),
#                 last_name=validated_data['last_name'],
#                 email=validated_data['email'],
#                 phone_number=validated_data['phone_number'],
#                 date_of_birth=datetime.strptime(validated_data['date_of_birth'], '%Y-%m-%d').date(),
#                 gender=validated_data.get('gender', ''),
#                 street_address=validated_data.get('street_address', ''),
#                 barangay=validated_data.get('barangay', ''),
#                 municipal_city=validated_data.get('municipal_city', '')
#             )

#             # Create queue entry
#             queue_entry = TemporaryStorageQueue.objects.create(
#                 patient=patient,
#                 priority_level=validated_data.get('priority_level', 'Regular'),
#                 queue_number=queue_number,
#                 complaint=complaint_value,
#                 status='Waiting'
#             )

#             # Return success
#             return Response({
#                 "message": "Dummy patient registered successfully.",
#                 "patient": PatientRegistrationSerializer(patient).data,
#                 "queue_entry": {
#                     "id": queue_entry.id,
#                     "priority_level": queue_entry.priority_level,
#                     "status": queue_entry.status,
#                     "queue_number": queue_entry.queue_number,
#                     "complaint": queue_entry.complaint
#                 }
#             }, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
# from datetime import date
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from queueing.serializers import PreliminaryAssessmentSerializer


# class DummyPreliminaryAssessmentView(APIView):
#     def post(self, request, patient_id, queue_number):
#         try:
#             # Get the patient by custom PK
#             patient = Patient.objects.get(patient_id=patient_id)
            
#             # Get queue entry
#             queue_entry = TemporaryStorageQueue.objects.get(patient=patient, queue_number=queue_number)

#             # Only allow if queue status is Accepted
#             if queue_entry.status != "Queued for Assessment":
#                 return Response({"error": f"Patient's queue status is '{queue_entry.status}', must be 'Accepted'."}, status=status.HTTP_400_BAD_REQUEST)

#             # Update status to next stage
#             queue_entry.status = 'Queued for Treatment'
#             queue_entry.save()

#         except Patient.DoesNotExist:
#             return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
#         except TemporaryStorageQueue.DoesNotExist:
#             return Response({'error': 'Queue entry not found'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         # Dummy assessment data
#         dummy_data = {
#             "blood_pressure": "120/80",
#             "temperature": "36.7",
#             "heart_rate": 75,
#             "respiratory_rate": 18,
#             "pulse_rate": 75,
#             "allergies": "None",
#             "medical_history": "No significant history",
#             "symptoms": "Mild headache",
#             "current_medications": "None",
#             "pain_scale": 2,
#             "pain_location": "Forehead",
#             "smoking_status": "Non-smoker",
#             "alcohol_use": "Occasional",
#             "assessment": "Stable condition"
#         }

#         # Serialize and save
#         serializer = PreliminaryAssessmentSerializer(data=dummy_data, context={'patient': patient})
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'Dummy assessment created successfully', 'queue_number': queue_number}, status=status.HTTP_201_CREATED)
#         else:
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class DummyTreatment(APIView):
#     """
#     Create a dummy Treatment for a patient and mark the queue entry Completed.
#     Mirrors the logic used in PatientTreatmentForm but with hard-coded test data.
#     """

#     def post(self, request, patient_id, queue_number):
#         try:
#             # 1. Resolve patient and queue
#             patient = Patient.objects.get(patient_id=patient_id)
#             queue = TemporaryStorageQueue.objects.get(patient=patient, queue_number=queue_number)

#         except Patient.DoesNotExist:
#             return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
#         except TemporaryStorageQueue.DoesNotExist:
#             return Response({'error': 'Queue entry not found'}, status=status.HTTP_404_NOT_FOUND)

#         # Use an atomic transaction to avoid partial writes
#         try:
#             with transaction.atomic():
#                 # 2. Update queue status to Completed
#                 queue.status = 'Completed'
#                 queue.save()

#                 # 3. Create Treatment record (doctor is request.user - ensured by isDoctor)
#                 treatment = Treatment.objects.create(
#                     patient=patient,
#                     treatment_notes="Dummy treatment notes for testing.",
#                     doctor=request.user
#                 )

#                 # 4. Dummy diagnoses (create and attach)
#                 dummy_diagnoses = [
#                     {
#                         "diagnosis_code": "DUMMY-001",
#                         "diagnosis_description": "Dummy diagnosis A",
#                         "diagnosis_date": date.today()
#                     },
#                     {
#                         "diagnosis_code": "DUMMY-002",
#                         "diagnosis_description": "Dummy diagnosis B",
#                         "diagnosis_date": date.today()
#                     }
#                 ]

#                 for diag in dummy_diagnoses:
#                     diagnosis_obj, created = Diagnosis.objects.get_or_create(
#                         patient=patient,
#                         diagnosis_code=diag["diagnosis_code"],
#                         defaults={
#                             "diagnosis_description": diag["diagnosis_description"],
#                             "diagnosis_date": diag["diagnosis_date"]
#                         }
#                     )
#                     # If get_or_create found an existing record it won't update fields; you can update if desired
#                     treatment.diagnoses.add(diagnosis_obj)

#                 # 5. Dummy prescription(s)
#                 # Ensure there is at least one medicine to reference
#                 medicine = Medicine.objects.first()
#                 if not medicine:
#                     # If no medicine exists in DB, roll back with error
#                     raise ValueError("No Medicine records found in the database. Add a Medicine before creating a prescription.")

#                 # Check expiry for chosen medicine
#                 if medicine.expiration_date and medicine.expiration_date < date.today():
#                     raise ValueError(f"Selected medicine '{medicine.name}' is expired (expiration_date={medicine.expiration_date}).")

#                 start = date.today()
#                 end = start + timedelta(days=7)

#                 # Use get_or_create similar to your real form
#                 prescription_obj, created = Prescription.objects.get_or_create(
#                     patient=patient,
#                     medication=medicine,
#                     dosage="1 tablet",
#                     frequency="Twice a day",
#                     quantity=14,
#                     start_date=start,
#                     end_date=end
#                 )
#                 treatment.prescriptions.add(prescription_obj)

#                 # 6. Return success
#                 return Response({
#                     "message": "Dummy treatment created successfully.",
#                     "treatment_id": treatment.pk,
#                     "queue_number": queue_number,
#                     "diagnoses_created_or_attached": [d.diagnosis_code for d in treatment.diagnoses.all()],
#                     "prescriptions_attached": [p.medication.name for p in treatment.prescriptions.all()]
#                 }, status=status.HTTP_201_CREATED)

#         except ValueError as ve:
#             # clear, user-friendly error (rolled back automatically)
#             return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             # generic error -> rolled back
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# # views_bulk_dummy.py
# import random
# from datetime import date, timedelta, datetime

# from django.db import transaction
# from django.db.models import Max
# from django.contrib.auth import get_user_model

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from patient.models import Patient, Prescription
# from patient.serializers import PatientRegistrationSerializer
# from medicine.models import Medicine
# from queueing.models import TemporaryStorageQueue, PreliminaryAssessment, Treatment, Diagnosis
# from queueing.serializers import PreliminaryAssessmentSerializer

# # Permission from your project (keeps consistency with your earlier code)

# # Faker (optional) — code will work without Faker
# try:
#     from faker import Faker
#     fake = Faker('en_PH')
#     Faker.seed(42)
#     fake.seed_instance(42)
#     USE_FAKER = True
# except Exception:
#     fake = None
#     USE_FAKER = False

# User = get_user_model()

# class BulkDummyFlowAPIView(APIView):
#     """
#     POST: create many dummy patients and run each through:
#       registration -> preliminary assessment -> treatment (diagnoses + prescriptions)
#     Request body:
#       { "count": <int> }  # optional, default 300
#     """
#     permission_classes = [isSecretary]

#     def _rand_phone(self):
#         if USE_FAKER:
#             try:
#                 ph = fake.phone_number()
#                 digits = ''.join(ch for ch in ph if ch.isdigit())
#                 if len(digits) >= 10:
#                     # normalize to 10-digit local format (drop country code if present)
#                     return digits[-10:]
#                 return ph
#             except Exception:
#                 pass
#         # fallback
#         return f"09{random.randint(100000000, 999999999)}"

#     def _rand_name(self):
#         if USE_FAKER:
#             return fake.first_name(), fake.last_name(), fake.random_element(elements=('A','B','C'))  # (first, last, middle)
#         # deterministic fallback
#         i = random.randint(1000, 9999)
#         return f"Test{i}", f"Patient{i}", "M"

#     def _random_dob(self):
#         # random DOB between 1940-01-01 and 2024-12-31
#         start = date(1940, 1, 1)
#         end = date(2024, 12, 31)
#         delta = (end - start).days
#         return start + timedelta(days=random.randint(0, delta))

#     def _random_registration_date(self, start_date, end_date):
#         delta = (end_date - start_date).days
#         return start_date + timedelta(days=random.randint(0, max(delta, 0)))

#     def post(self, request):
#         count = int(request.data.get('count', 300))
#         # Range: from Sept 1, 2024 to Aug 18, 2025 (per your environment)
#         start_date = date(2024, 9, 1)
#         end_date = date(2025, 8, 18)

#         created = 0
#         errors = []

#         # Ensure the four medicines exist (create if missing). Use sensible expiration dates.
#         meds_to_ensure = [
#             (1056, "Cefcillin", "954 mg"),
#             (1048, "Acetocillin", "938 mg"),
#             (1052, "Amoxicillin", "802 mg"),
#             (1050, "Dextrophen", "333 mg"),
#         ]
#         ensured_meds = {}
#         for pk, name, dosage in meds_to_ensure:
#             defaults = {
#                 "name": name,
#                 # try to set a plausible field -- many models use 'dosage' or 'strength'; adjust if different
#                 "dosage": dosage if hasattr(Medicine, 'dosage') or True else dosage,
#                 "expiration_date": end_date + timedelta(days=365)  # at least 1 year in future
#             }
#             med_obj, _ = Medicine.objects.get_or_create(pk=pk, defaults=defaults)
#             ensured_meds[pk] = med_obj

#         # Determine a doctor to attach to Treatments: prefer a staff user, else fallback to request.user
#         doctor_user = User.objects.filter(is_staff=True).first() or request.user

#         for i in range(count):
#             # Per-patient atomic block (uses savepoint so failures for one don't abort others)
#             try:
#                 with transaction.atomic():
#                     # Registration data
#                     first_name, last_name, middle_name = self._rand_name()
#                     dob = self._random_dob()
#                     reg_date = self._random_registration_date(start_date, end_date)

#                     dummy_data = {
#                         "first_name": first_name,
#                         "middle_name": middle_name,
#                         "last_name": last_name,
#                         "email": f"{first_name.lower()}.{last_name.lower()}.{random.randint(1,9999)}@example.com",
#                         "phone_number": self._rand_phone(),
#                         "date_of_birth": dob,
#                         "gender": random.choice(["Male", "Female"]),
#                         "street_address": f"{random.randint(1,999)} Example St.",
#                         "barangay": random.choice(["Barangay Uno","Barangay Dos","Barangay Tres"]),
#                         "municipal_city": random.choice(["Quezon City","Manila","Caloocan"]),
#                         "agree_terms": True,
#                         "complaint": random.choice(["Check-up", "General Illness", "Injury", "Other"]),
#                         "priority_level": random.choice(["Regular","Priority"])
#                     }

#                     # Validate via existing serializer (mirrors your existing registration path)
#                     serializer = PatientRegistrationSerializer(data=dummy_data)
#                     if not serializer.is_valid():
#                         # If serializer rejects, collect error and skip this patient
#                         errors.append({"index": i, "reason": "registration_validation", "details": serializer.errors})
#                         continue

#                     validated = serializer.validated_data
#                     # Create patient
#                     patient = Patient.objects.create(
#                         first_name=validated.get("first_name", ""),
#                         middle_name=validated.get("middle_name", ""),
#                         last_name=validated.get("last_name", ""),
#                         email=validated.get("email", ""),
#                         phone_number=validated.get("phone_number", ""),
#                         date_of_birth=validated.get("date_of_birth"),
#                         gender=validated.get("gender", ""),
#                         street_address=validated.get("street_address", ""),
#                         barangay=validated.get("barangay", ""),
#                         municipal_city=validated.get("municipal_city", "")
#                     )

#                     # Determine next queue_number
#                     last_queue_number = TemporaryStorageQueue.objects.aggregate(Max('queue_number'))['queue_number__max'] or 0
#                     queue_number = last_queue_number + 1

#                     # Create queue entry as 'Waiting' initially
#                     queue_entry = TemporaryStorageQueue.objects.create(
#                         patient=patient,
#                         priority_level=validated.get('priority_level', 'Regular'),
#                         queue_number=queue_number,
#                         complaint=(validated.get('complaint') or ""),
#                         status='Waiting',
#                         created_at=reg_date if hasattr(TemporaryStorageQueue, 'created_at') else None
#                     )

#                     # Simulate the process progression:
#                     # Waiting -> Accepted -> Queued for Assessment -> Queued for Treatment -> Completed
#                     queue_entry.status = 'Accepted'
#                     queue_entry.save()

#                     queue_entry.status = 'Queued for Assessment'
#                     queue_entry.save()

#                     # Create a preliminary assessment using your serializer
#                     assessment_data = {
#                         "blood_pressure": f"{random.randint(100,130)}/{random.randint(60,90)}",
#                         "temperature": f"{round(random.uniform(36.1,38.5), 1)}",
#                         "heart_rate": random.randint(60,100),
#                         "respiratory_rate": random.randint(12,22),
#                         "pulse_rate": random.randint(60,100),
#                         "allergies": random.choice(["None", "Penicillin", "Aspirin"]),
#                         "medical_history": random.choice(["No significant history", "Hypertension"]),
#                         "symptoms": random.choice(["Cough","Fever","Headache","Mild pain"]),
#                         "current_medications": random.choice(["None", "Paracetamol"]),
#                         "pain_scale": random.randint(0,5),
#                         "pain_location": random.choice(["Head","Chest","Abdomen"]),
#                         "smoking_status": random.choice(["Non-smoker", "Former smoker"]),
#                         "alcohol_use": random.choice(["None", "Occasional"]),
#                         "assessment": random.choice(["Stable condition", "Needs observation"])
#                     }
#                     pa_serializer = PreliminaryAssessmentSerializer(data=assessment_data, context={'patient': patient})
#                     if not pa_serializer.is_valid():
#                         # collect error but continue to treatment step if you prefer; here we skip this patient
#                         errors.append({"index": i, "reason": "prelim_validation", "details": pa_serializer.errors})
#                         continue
#                     pa_serializer.save()

#                     # Update status to Queued for Treatment
#                     queue_entry.status = 'Queued for Treatment'
#                     queue_entry.save()

#                     # Create Treatment
#                     treatment = Treatment.objects.create(
#                         patient=patient,
#                         treatment_notes="Auto-generated dummy treatment.",
#                         doctor=doctor_user
#                     )

#                     # Create 1-2 dummy diagnoses and attach
#                     for d_j in range(random.randint(1, 2)):
#                         diag_code = f"DUMMY-{random.randint(1000,9999)}"
#                         diag_desc = random.choice(["Acute upper respiratory infection", "Unspecified fever", "Minor headache"])
#                         diag_date = reg_date
#                         diag_obj, _ = Diagnosis.objects.get_or_create(
#                             patient=patient,
#                             diagnosis_code=diag_code,
#                             defaults={
#                                 "diagnosis_description": diag_desc,
#                                 "diagnosis_date": diag_date
#                             }
#                         )
#                         treatment.diagnoses.add(diag_obj)

#                     # Create 1-2 prescriptions using the ensured medicine set
#                     med_choice_pk = random.choice(list(ensured_meds.keys()))
#                     med_obj = ensured_meds[med_choice_pk]

#                     # check expiry
#                     if getattr(med_obj, "expiration_date", None) and med_obj.expiration_date < date.today():
#                         # skip creating prescription for expired med
#                         errors.append({"index": i, "reason": "medicine_expired", "med": med_obj.name})
#                         # still mark queue as Completed and continue
#                         queue_entry.status = 'Completed'
#                         queue_entry.save()
#                         created += 1
#                         continue

#                     # Build prescription record(s)
#                     start = reg_date
#                     duration_days = random.choice([3,5,7,10])
#                     end = start + timedelta(days=duration_days)

#                     quantity = random.randint(3, 30)
#                     frequency = random.choice(["Once a day", "Twice a day", "Three times a day"])

#                     # Use Prescription model's fields similar to earlier code
#                     prescription_obj, _ = Prescription.objects.get_or_create(
#                         patient=patient,
#                         medication=med_obj,
#                         dosage=f"{med_obj.dosage if getattr(med_obj,'dosage',None) else '1 tablet'}",
#                         frequency=frequency,
#                         quantity=quantity,
#                         start_date=start,
#                         end_date=end
#                     )
#                     treatment.prescriptions.add(prescription_obj)

#                     # Finalize: mark queue Completed
#                     queue_entry.status = 'Completed'
#                     queue_entry.save()

#                     created += 1

#             except Exception as e:
#                 # collect error and continue with next patient
#                 errors.append({"index": i, "error": str(e)})
#                 continue

#         return Response({
#             "message": "Bulk dummy flow completed",
#             "requested": count,
#             "created": created,
#             "errors_count": len(errors),
#             "errors_sample": errors[:10]  # return up to 10 error samples for debugging
#         }, status=status.HTTP_201_CREATED if created > 0 else status.HTTP_400_BAD_REQUEST)
