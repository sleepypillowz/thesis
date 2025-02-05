from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import TemporaryStorageQueue
from .serializers import TemporaryStorageQueueSerializer
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
                "id, patient_id, status, created_at, priority_level"
            ).eq('status', 'Waiting').eq('priority_level', 'Priority').order('created_at').execute()

            # Fetch Regular Queue
            regular_response = supabase.table(table_name).select(
                "id, patient_id, status, created_at, priority_level"
            ).eq('status', 'Waiting').eq('priority_level', 'Regular').order('created_at').execute()

            # Access the data attribute directly
            priority_patients = priority_response.data if hasattr(priority_response, 'data') else []
            regular_patients = regular_response.data if hasattr(regular_response, 'data') else []

            def get_next_patients(queue):
                current = queue[0] if len(queue) > 0 else None
                next1 = queue[1] if len(queue) > 1 else None
                next2 = queue[2] if len(queue) > 2 else None
                return current, next1, next2

            # For priority queue
            priority_current, priority_next1, priority_next2 = get_next_patients(priority_patients)

            # For regular queue
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

# @api_view(['GET'])
# def registration_queueing(request):
#     # Ensure all Django ORM transactions are committed
#     connection.commit()

#     # Fetch from Django ORM
#     regular_queue = TemporaryStorageQueue.objects.filter(status='Waiting', priority_level='Regular').order_by('created_at')
#     priority_queue = TemporaryStorageQueue.objects.filter(status='Waiting', priority_level='Priority').order_by('created_at')

#     # Serialize queue data
#     regular_data = TemporaryStorageQueueSerializer(regular_queue, many=True).data
#     priority_data = TemporaryStorageQueueSerializer(priority_queue, many=True).data

#     return Response({
#         "regular_queue": regular_data,
#         "priority_queue": priority_data
#     })
