import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import *
from django.contrib.auth import get_user
from django.core.files.storage import FileSystemStorage


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_disard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_id = -1
        room_id = -1
        message_text = -1
        contacts_id = -1
        room_name = -1
        room_type = -1
        type = text_data_json['type']
        if text_data.find("message_id") != -1:
            message_id = text_data_json['message_id']
        if text_data.find("room_id") != -1:
            room_id = text_data_json['room_id']
        if text_data.find("message_text") != -1:
            message_text = text_data_json['message_text']
        if text_data.find("contacts_id") != -1:
            contacts_id = text_data_json['contacts_id']
        if text_data.find("room_name") != -1:
            room_name = text_data_json['room_name']
        if text_data.find("room_type") != -1:
            room_type = text_data_json['room_type']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': type,
                'message_id': message_id,
                'room_id': room_id,
                'message_text': message_text,
                'contacts_id': contacts_id,
                'room_name': room_name,
                'room_type': room_type,

            }
        )

    def chat_message(self, event):
        type = event['type']
        room_id = event['room_id']

        message = Room.objects.get(id=room_id).room.latest("id")
        serializer = MessageSerializer(message, many=False)

        self.send(text_data=json.dumps({'data': serializer.data, 'type': type, 'room_id': room_id}))

    def message_reaction(self, event):
        type = event['type']
        message_id = event['message_id']

        message = Message.objects.get(id=message_id)
        if message.liked:
            message.liked = False
        else:
            message.liked = True
        message.save()

        self.send(text_data=json.dumps({
            'type': type,
            'message_id': message_id
        }))

    def message_viewed(self, event):
        type = event['type']
        message_id = event['message_id']
        contacts_id = event['contacts_id']
        for id in message_id:
            message = Message.objects.get(id=id)
            message.viewed.add(CustomUser.objects.get(id=contacts_id))
            message.save()



        self.send(text_data=json.dumps({
            'type': type,
            'message_id': message_id,
        }))

    def delete_message(self, event):
        type = event['type']
        message_id = event['message_id']
        message = Message.objects.get(id=message_id)
        message.viewed = True
        message.save()

        self.send(text_data=json.dumps({
            'type': type,
            'message_id': message_id
        }))


class UserConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_disard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_id = -1
        room_id = -1
        message_text = -1
        contacts_id = -1
        room_name = -1
        room_type = -1
        search_substring = -1

        type = text_data_json['type']
        if text_data.find("message_id") != -1:
            message_id = text_data_json['message_id']
        if text_data.find("room_id") != -1:
            room_id = text_data_json['room_id']
        if text_data.find("message_text") != -1:
            message_text = text_data_json['message_text']
        if text_data.find("contacts_id") != -1:
            contacts_id = text_data_json['contacts_id']
        if text_data.find("room_name") != -1:
            room_name = text_data_json['room_name']
        if text_data.find("room_type") != -1:
            room_type = text_data_json['room_type']
        if text_data.find("search_substring") != -1:
            search_substring = text_data_json['search_substring']


        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': type,
                'message_id': message_id,
                'room_id': room_id,
                'message_text': message_text,
                'contacts_id': contacts_id,
                'room_name': room_name,
                'room_type': room_type,
                'search_substring': search_substring,
            }
        )

    def create_new_room(self, event):
        type = event['type']
        room_id = event['room_id']

        print("A", room_id)

        room = Room.objects.get(id=room_id)
        room = RoomSerializerMessage(room)

        self.send(text_data=json.dumps({
            'type': type,
            'room': room.data,
        }))

    def search_users(self, event):
        type = event["type"]
        search_substring = event['search_substring']
        q = search_substring
        User = get_user_model()
        results = json.dumps(list(User.objects.filter(email__istartswith=q).values("id", "email", "image", "username")), indent=2)


        self.send(text_data=json.dumps({"type": type, "search": results}))