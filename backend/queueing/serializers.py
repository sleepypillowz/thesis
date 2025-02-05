from rest_framework import serializers
from .models import TemporaryStorageQueue

class TemporaryStorageQueueSerializer(serializers.ModelSerializer):
    queueing_number = serializers.SerializerMethodField()

    class Meta:
        model = TemporaryStorageQueue
        fields = ['id', 'queueing_number', 'patient', 'priority_level', 'created_at', 'status']

    def get_queueing_number(self, obj):
        queue = TemporaryStorageQueue.objects.filter(priority_level=obj.priority_level, status='Waiting').order_by('created_at')
        queue_list = list(queue)

        return f'#{queue_list.index(obj) + 1}' if obj in queue_list else 'N/A'
