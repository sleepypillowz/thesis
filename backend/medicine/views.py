from django.shortcuts import render
import numpy as np
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Medicine
from .serializers import MedicineSerializer
from user.permissions import IsMedicalStaff, isSecretary
from rest_framework.views import APIView

from django.db.models import Q
from patient.serializers import PrescriptionSerializer
from patient.models import Prescription

from backend.supabase_client import supabase
import pandas as pd
from sklearn.model_selection import train_test_split
import lightgbm as lgb
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

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

class Predict(APIView):
    permission_classes = [isSecretary]
    
    def get(self, request):
        medicines = supabase.table('medicine_medicine').select().execute()
        prescriptions = supabase.table('patient_prescription').select().execute()
        
        med_df = pd.DataFrame(medicines.data)
        pres_df = pd.DataFrame(prescriptions.data)
        #print(pres_df['medication_id'].unique())
        
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
            if group.shape[0] < 2:
                continue # if row < 2 skip as data is not enough
           
            group = group.sort_values('month').copy()
            group  = group.set_index('month')
            
            full_month_index = pd.date_range(start=group.index.min(), end=group.index.max(), freq='MS')
            group = group.reindex(full_month_index, fill_value=0)
            group = group.reset_index().rename(columns={'index': 'month'})
            # subtracts the current month to min month -> month index --> earliest month is index 0
            group['month_index'] = (group['month'] - group['month'].min()).dt.days // 30

            # x = month index
            # y = values           
            # print("no reshape",group['month_index'])
            group['lag_1'] = group['quantity'].shift(1).fillna(0)
            group['lag_2'] = group['quantity'].shift(2).fillna(0)
            
            features = ['month_index','lag_1', 'lag_2']
            # group['lag_3'] = group['quantity'].shift(1).fillna(0)
            X = group[features].values #.reshape(-1, 1)
            y = group['quantity'].values
            print(group)
            # train 80% and not shuffled as for time series data is ordered
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, shuffle=False
            )
            print(len(X_train), len(y_train), len(X_test), len(y_test))
            
            if len(X_train) < 2 or len(X_test) < 1:
                continue    
            
            model = LGBMRegressor(
                random_state=42, # seed
                n_estimators=50, # number of trees
                learning_rate=0.01,# how quickly the model to update each tree
                max_depth=2, 
                num_leaves=31,
                min_child_samples=1 # number of data points required
            )
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            
            mse = mean_squared_error(y_test, preds)
            mae = mean_absolute_error(y_test, preds)
            r2 = r2_score(y_test, preds) if len(y_test) > 1 else None    
                         
            if r2 is not None:
                print(f"MSE: {mse:.2f}, MAE: {mae:.2f}, R²: {r2:.2f}")
            else:
                print(f"MSE: {mse:.2f}, MAE: {mae:.2f}, R²: N/A")

            lag1 = group['quantity'].iloc[-1]
            lag2 = group['quantity'].iloc[-2] if len(group)>1 else None 
            
            future_months = group['month_index'].max() + np.arange(1, 4)

            future_df = pd.DataFrame({
                'month_index': future_months,
                'lag_1': [lag1]*3, # 3 -> forecasting next 3 months 
                'lag_2': [lag2]*3,                
            })
            X_future = future_df[features].values
            
            # convert array to list to be json serializable
            forecast = model.predict(X_future).tolist()
            results.append({
                'medicine_id': medicine_id,
                'name': group['name'].iloc[0],
                'mse': mse,
                'r2': r2,
                'forecast_next_3_months': forecast
            })
            
        return Response({'results': results})
        

    