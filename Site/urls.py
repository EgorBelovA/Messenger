from django.contrib import admin
from django.urls import path, re_path, include
from Site import views
from django.conf import settings
from django.conf.urls.static import static
from .models import *
from django.views.decorators.cache import cache_page
from django.views.generic.base import TemplateView

from django.views.static import serve as mediaserve

urlpatterns = [
    path('profile/', views.profile, name='profile'),
    path('message_reaction', views.ms_reaction, name='ms_reaction'),
    path('save_profile_avatar', views.save_profile_avatar, name='save_profile_avatar'),
    path('save_room_avatar', views.save_room_avatar, name='save_room_avatar'),
    path('getChats/', views.GetChats.as_view(), name='getChats'),
    path('getContacts/', views.GetContacts.as_view(), name='getContacts'),
    path('GetMessages/<str:room>/', views.GetMessages.as_view(), name='GetMessages'),
    path('get_settings/', views.get_settings, name='get_settings'),
    path('get_general_info/', views.get_general_info, name='get_general_info'),
    path('set_settings', views.set_settings, name='set_settings'),
    path('', views.home, name='home'),
    path('signup/', views.RegisterUser.as_view(), name='signup'),
    # path('accounts/', include('allauth.urls')),
    path('accounts/', include('social_django.urls', namespace='social')),
    # path('login', views.LoginUser.as_view(), name='login'),
    re_path('logout', views.logout_user, name='logout'),
    re_path('delete_account', views.deleteuser, name='delete_account'),
    path('<str:room>/', views.home, name='room'),
    re_path('checkview_users', views.checkview_users, name='checkview_users'),
    re_path('checkview', views.checkview, name='checkview'),
    path('send', views.send, name='send'),
        path(
        "robots.txt",
        TemplateView.as_view(template_name="robots.txt", content_type="text/plain"),
    ),
    # path('getMessages/<str:room>/', views.getMessages, name='getMessages'),
    # path('getLastMessage/<str:room>/', views.getLastMessage, name='getLastMessage'),
]



if settings.DEBUG:
    urlpatterns = [
        path('__debug__/', include('debug_toolbar.urls')),
    ] + urlpatterns

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(f'^{settings.MEDIA_URL.lstrip("/")}(?P<path>.*)$',
            mediaserve, {'document_root': settings.MEDIA_ROOT}),
        re_path(f'^{settings.STATIC_URL.lstrip("/")}(?P<path>.*)$',
            mediaserve, {'document_root': settings.STATIC_ROOT}),
        ]