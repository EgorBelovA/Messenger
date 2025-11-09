from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'socket-server/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'socket-server/user/(?P<room_name>\w+)/$', consumers.UserConsumer.as_asgi()),
]