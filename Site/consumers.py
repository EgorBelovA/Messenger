import json
import traceback
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import *
from django.contrib.auth import get_user, get_user_model
from django.core.files.storage import FileSystemStorage
import logging

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['room_name']

            self.room_group_name = f'chat_{self.room_name}'

            print(f"ChatConsumer: Connecting to {self.room_group_name}")

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
            
            self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'Chat connected successfully',
                'consumer': 'chat',
                'room': self.room_name
            }))
            
        except Exception as e:
            print(f"ChatConsumer connect error: {e}")
            print(f"Traceback: {traceback.format_exc()}")
            if hasattr(self, 'accept'):
                self.accept()
                self.close(code=1011, reason=f"Connection failed: {str(e)}")

    def disconnect(self, close_code):
        try:
            print(f"ChatConsumer: Disconnecting from {self.room_group_name}, code: {close_code}")
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"ChatConsumer disconnect error: {e}")

    def receive(self, text_data):
        try:
            print(f"ChatConsumer: Received message: {text_data}")
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if not message_type:
                self.send(text_data=json.dumps({'error': 'Missing type field'}))
                return

            allowed_chat_types = ['chat_message', 'message_reaction', 'message_viewed', 'delete_message']
            if message_type not in allowed_chat_types:
                self.send(text_data=json.dumps({
                    'error': f'Message type "{message_type}" not allowed for ChatConsumer',
                    'allowed_types': allowed_chat_types
                }))
                return

            message_data = {
                'type': message_type,
                'message_id': text_data_json.get('message_id'),
                'room_id': text_data_json.get('room_id'),
                'message_text': text_data_json.get('message_text'),
                'contacts_id': text_data_json.get('contacts_id'),
                'room_name': text_data_json.get('room_name'),
                'room_type': text_data_json.get('room_type'),
            }

            message_data = {k: v for k, v in message_data.items() if v is not None}

            print(f"ChatConsumer: Sending to group {self.room_group_name}: {message_data}")

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                message_data
            )
            
        except json.JSONDecodeError as e:
            error_msg = f'Invalid JSON: {str(e)}'
            print(f"ChatConsumer JSON error: {error_msg}")
            self.send(text_data=json.dumps({'error': 'Invalid JSON format'}))
        except Exception as e:
            error_msg = f'Receive error: {str(e)}'
            print(f"ChatConsumer receive error: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Message processing failed'}))

    def chat_message(self, event):
        try:
            print(f"ChatConsumer: Processing chat_message event: {event}")
            message_type = event['type']
            room_id = event.get('room_id')
            
            if not room_id:
                self.send(text_data=json.dumps({'error': 'Missing room_id for chat_message'}))
                return

            room = Room.objects.get(id=room_id)
            message = room.room.latest("id")
            serializer = MessageSerializer(message, many=False)

            self.send(text_data=json.dumps({
                'data': serializer.data, 
                'type': message_type, 
                'room_id': room_id
            }))
            print(f"ChatConsumer: chat_message sent successfully")
            
        except Room.DoesNotExist:
            error_msg = f'Room not found: {room_id}'
            print(f"ChatConsumer: {error_msg}")
            self.send(text_data=json.dumps({'error': error_msg}))
        except Exception as e:
            error_msg = f'chat_message error: {str(e)}'
            print(f"ChatConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Failed to get latest message'}))

    def message_reaction(self, event):
        try:
            print(f"ChatConsumer: Processing message_reaction event: {event}")
            message_type = event['type']
            message_id = event.get('message_id')
            contacts_id = event.get('contacts_id')
            
            if not message_id or not contacts_id:
                self.send(text_data=json.dumps({'error': 'Missing message_id or contacts_id'}))
                return

            user = self.scope.get('user')
            if not user or user.is_anonymous:
                self.send(text_data=json.dumps({'error': 'Not authenticated'}))
                return

            user_id = user.id
            if int(contacts_id) == user_id:
                message = Message.objects.get(id=message_id)
                message.liked = not message.liked
                message.save()
                print(f"ChatConsumer: Message {message_id} liked status updated to {message.liked}")

            self.send(text_data=json.dumps({
                'type': message_type,
                'message_id': message_id,
                'liked': message.liked if 'message' in locals() else None
            }))
            
        except Message.DoesNotExist:
            error_msg = f'Message not found: {message_id}'
            print(f"ChatConsumer: {error_msg}")
            self.send(text_data=json.dumps({'error': error_msg}))
        except Exception as e:
            error_msg = f'message_reaction error: {str(e)}'
            print(f"ChatConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Reaction update failed'}))

    def message_viewed(self, event):
        try:
            print(f"ChatConsumer: Processing message_viewed event: {event}")
            message_type = event['type']
            message_ids = event.get('message_id', [])
            contacts_id = event.get('contacts_id')
            
            if not message_ids or not contacts_id:
                self.send(text_data=json.dumps({'error': 'Missing message_ids or contacts_id'}))
                return

            if not isinstance(message_ids, list):
                message_ids = [message_ids]
                
            updated_ids = []
            for msg_id in message_ids:
                try:
                    message = Message.objects.get(id=msg_id)
                    message.viewed.add(CustomUser.objects.get(id=contacts_id))
                    message.save()
                    updated_ids.append(msg_id)
                except (Message.DoesNotExist, CustomUser.DoesNotExist) as e:
                    print(f"ChatConsumer: Failed to update message {msg_id}: {e}")
                    continue

            self.send(text_data=json.dumps({
                'type': message_type,
                'message_id': updated_ids,
                'updated_count': len(updated_ids)
            }))
            print(f"ChatConsumer: Updated view status for {len(updated_ids)} messages")
            
        except Exception as e:
            error_msg = f'message_viewed error: {str(e)}'
            print(f"ChatConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'View status update failed'}))

    def delete_message(self, event):
        try:
            print(f"ChatConsumer: Processing delete_message event: {event}")
            message_type = event['type']
            message_id = event.get('message_id')
            
            if not message_id:
                self.send(text_data=json.dumps({'error': 'Missing message_id'}))
                return

            message = Message.objects.get(id=message_id)
            message.delete()

            self.send(text_data=json.dumps({
                'type': message_type,
                'message_id': message_id,
                'status': 'deleted'
            }))
            print(f"ChatConsumer: Message {message_id} deleted successfully")
            
        except Message.DoesNotExist:
            error_msg = f'Message not found: {message_id}'
            print(f"ChatConsumer: {error_msg}")
            self.send(text_data=json.dumps({'error': error_msg}))
        except Exception as e:
            error_msg = f'delete_message error: {str(e)}'
            print(f"ChatConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Delete operation failed'}))


class UserConsumer(WebsocketConsumer):
    def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'user_{self.room_name}'

            print(f"UserConsumer: Connecting to {self.room_group_name}")

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
            
            self.send(text_data=json.dumps({
                'type': 'connection_established', 
                'message': 'User connected successfully',
                'consumer': 'user',
                'room': self.room_name
            }))
            
        except Exception as e:
            print(f"UserConsumer connect error: {e}")
            print(f"Traceback: {traceback.format_exc()}")
            if hasattr(self, 'accept'):
                self.accept()
                self.close(code=1011, reason=f"Connection failed: {str(e)}")

    def disconnect(self, close_code):
        try:
            print(f"UserConsumer: Disconnecting from {self.room_group_name}, code: {close_code}")
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"UserConsumer disconnect error: {e}")

    def receive(self, text_data):
        try:
            print(f"UserConsumer: Received message: {text_data}")
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if not message_type:
                self.send(text_data=json.dumps({'error': 'Missing type field'}))
                return

            allowed_user_types = ['create_new_room', 'search_users']
            if message_type not in allowed_user_types:
                self.send(text_data=json.dumps({
                    'error': f'Message type "{message_type}" not allowed for UserConsumer',
                    'allowed_types': allowed_user_types
                }))
                return

            message_data = {
                'type': message_type,
                'message_id': text_data_json.get('message_id'),
                'room_id': text_data_json.get('room_id'),
                'message_text': text_data_json.get('message_text'),
                'contacts_id': text_data_json.get('contacts_id'),
                'room_name': text_data_json.get('room_name'),
                'room_type': text_data_json.get('room_type'),
                'search_substring': text_data_json.get('search_substring'),
            }

            message_data = {k: v for k, v in message_data.items() if v is not None}

            print(f"UserConsumer: Sending to group {self.room_group_name}: {message_data}")

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                message_data
            )
            
        except json.JSONDecodeError as e:
            error_msg = f'Invalid JSON: {str(e)}'
            print(f"UserConsumer JSON error: {error_msg}")
            self.send(text_data=json.dumps({'error': 'Invalid JSON format'}))
        except Exception as e:
            error_msg = f'Receive error: {str(e)}'
            print(f"UserConsumer receive error: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Message processing failed'}))

    def create_new_room(self, event):
        try:
            print(f"UserConsumer: Processing create_new_room event: {event}")
            message_type = event['type']
            room_id = event.get('room_id')
            
            if not room_id:
                self.send(text_data=json.dumps({'error': 'Missing room_id for create_new_room'}))
                return

            room = Room.objects.get(id=room_id)
            serializer = RoomSerializerMessage(room)
            
            self.send(text_data=json.dumps({
                'type': message_type,
                'room': serializer.data,
                'room_id': room_id
            }))
            print(f"UserConsumer: create_new_room sent successfully for room {room_id}")
            
        except Room.DoesNotExist:
            error_msg = f'Room not found: {room_id}'
            print(f"UserConsumer: {error_msg}")
            self.send(text_data=json.dumps({'error': error_msg}))
        except Exception as e:
            error_msg = f'create_new_room error: {str(e)}'
            print(f"UserConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Failed to create room view'}))

    def search_users(self, event):
        try:
            print(f"UserConsumer: Processing search_users event: {event}")
            message_type = event["type"]
            search_substring = event.get('search_substring')
            
            if not search_substring:
                self.send(text_data=json.dumps({
                    "type": message_type, 
                    "search": [],
                    "info": "No search term provided"
                }))
                return

            print(f"UserConsumer: Searching users with substring: '{search_substring}'")
            
            User = get_user_model()
            users = User.objects.filter(
                email__icontains=search_substring
            ).values("id", "email", "image", "username")[:50]
            
            results = list(users)
            
            self.send(text_data=json.dumps({
                "type": message_type, 
                "search": results,
                "search_term": search_substring,
                "count": len(results)
            }))
            print(f"UserConsumer: search_users found {len(results)} users")
            
        except Exception as e:
            error_msg = f'search_users error: {str(e)}'
            print(f"UserConsumer: {error_msg}")
            print(f"Traceback: {traceback.format_exc()}")
            self.send(text_data=json.dumps({'error': 'Search operation failed'}))