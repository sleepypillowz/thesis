
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RegistrationQueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Optionally check permissions: e.g. only secretaries
        await self.channel_layer.group_add("registration_queue", self.channel_name)
        await self.accept()
        # Debug
        print(f"✅ WebSocket client connected: {self.channel_name}")
        print(f"📊 Added to group: registration_queue")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("registration_queue", self.channel_name)
        print(f"❌ WebSocket client disconnected: {self.channel_name}")

    async def queue_update(self, event):
        # event["data"] is the payload dictionary
        data = event["data"]
        # Debug
        print(f"📤 Sending queue_update to client: {self.channel_name}")
        print(f"📦 Data being sent: {data}")
        
        try:
            await self.send(text_data=json.dumps(data))
            print(f"✅ Message successfully sent to {self.channel_name}")
        except Exception as e:
            print(f"❌ Error sending message to {self.channel_name}: {e}")

