import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import Site.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chat.settings')

application = ProtocolTypeRouter({
    'https': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            Site.routing.websocket_urlpatterns
        )
    )
})