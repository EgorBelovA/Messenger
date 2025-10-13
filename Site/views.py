from django.http import HttpResponse, HttpResponseNotFound, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, reverse
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from .utils import *
from .forms import *
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
import hashlib
from django.views.generic import ListView, CreateView
from django.core.files.storage import FileSystemStorage
from django.utils.safestring import mark_safe
import json
from django.db.models.functions import Lower
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.forms.models import model_to_dict
from social_django import *
from asgiref.sync import sync_to_async



# @login_required(login_url='login')
# def room(request, room = 0):
#     User = get_user_model()
#     all_chats = Room.objects.filter(users=request.user)
#     all_users = User.objects.all()
#     if(room == 0):
#         return render(request, 'room.html', {"all_chats": all_chats, "all_users": all_users})
#     if(Room.objects.filter(id=room).filter(users=request.user).exists()):
#         mes = Message.objects.all()
#         for item in mes:
#             for fl in item.file.all():
#                 print(fl.file)
#         username = request.user
#         opponent = Room.objects.get(id=room).users.exclude(id=request.user.id)[0]
#         room_details = Room.objects.get(id=room)
#         return render(request, 'room.html', {
#             'username': username,
#             'room': room,
#             'room_details': room_details,
#             'users': opponent,
#             "all_chats": all_chats,
#             "all_users": all_users,
#         })
#     else:
#         return redirect('room')


@login_required(login_url='login')
def room(request, room = 0):
    User = get_user_model()
    all_chats = Room.objects.filter(users=request.user)
    all_users = User.objects.all()
    if(room == 0):
        return render(request, 'room.html', {"all_chats": all_chats, "all_users": all_users})
    if(Room.objects.filter(id=room).filter(users=request.user).exists()):
        mes = Message.objects.all()
        for item in mes:
            for fl in item.file.all():
                print(fl.file)
        username = request.user
        opponent = Room.objects.get(id=room).users.exclude(id=request.user.id)[0]
        room_details = Room.objects.filter(id=room)
        return JsonResponse({
            'username': str(username),
            'room': int(room),
            'room_details': list(room_details.values()),
            'users': str(opponent),
            "all_chats": list(all_chats.values()),
            "all_users": list(all_users.values()),
        })
    else:
        return redirect('room')


@login_required(login_url='login')
def checkview(request):
    room = request.POST['chats']
    if (Room.objects.filter(id=room).filter(users=request.user).exists()):
        opponent = Room.objects.get(id=room).users.exclude(id=request.user.id)[0]
        room_details = Room.objects.filter(id=room)
        return JsonResponse({
            # 'room': int(room),
            # 'room_details': list(room_details.values()),
            # # 'users': str(opponent),
            # "opponent": str(opponent.username),
        }, safe=False)
    else:
        return redirect('room')


@login_required(login_url='login')
def checkview_users(request):
    User = get_user_model()
    opponent = User.objects.get(id=request.POST['users'])
    username = request.user.username
    # username_id = request.user.id

    if Room.objects.filter(users=request.user).filter(users=opponent).exists():
        room = str(Room.objects.filter(users=request.user).filter(users=opponent)[0].id)
        return redirect('/'+room+'/?'+str(opponent.username))
    else:
        new_room = Room.objects.create()
        request.user.rooms.add(new_room)
        opponent.rooms.add(new_room)
        new_room.users.add(request.user, opponent)
        new_room.save()

        username = User.objects.filter(id=request.user.id)
        opponent = Room.objects.get(id=new_room.id).users.exclude(id=request.user.id)[0]
        room_details = Room.objects.filter(id=new_room.id)
        return JsonResponse({"id": new_room.id})


@login_required(login_url='login')
def send(request):
    User = get_user_model()
    new_message = ''
    files = request.FILES.getlist('file', False)
    message = request.POST.get('message', False)
    username_id = User.objects.get(id=request.POST.get('username', False))
    room_id = Room.objects.get(id=request.POST.get('room_id', False))
    if(message != "" or files != False):
        new_message = Message.objects.create(value=message, user=username_id, room=room_id)
        new_message.save()
    if (files != False):
        for file in files:
            fss = FileSystemStorage()
            filename = fss.save(file.name[:file.name.rfind('.')].encode(encoding='utf8').hex()+file.name[file.name.rfind('.'):], file)
            # filename = fss.save(file.name, file)
            url = fss.url(filename)
            new_file = File.objects.create(file=url)
            new_file.save()
            new_message.file.add(new_file)
            new_message.save()


    return HttpResponse('Message sent successfully')


# @login_required(login_url='login')
# def getMessages(request, room):
#     room_details = Room.objects.get(id=room)
#     # files_alpha = File.objects.filter(room=room_details.id)
#     messages = Message.objects.filter(room=room_details.id).order_by('id')
#     message = (Message.objects.filter(room=room_details.id).order_by('id').values("id", "date", "user", "room", "viewed", "liked", "file__file").last())
#     message = json.dumps(message, sort_keys=True, default=str)
#     return JsonResponse({"messages": list(messages.values()), "files": {}})


from django.db.models import Max
from datetime import datetime
class GetChats(APIView):
    def get(self, request):
        User = get_user_model()
        # Получаем все чаты пользователя и аннотируем датой последнего сообщения
        all_chats = Room.objects.filter(users=request.user.id).annotate(
            last_message_date=Max('room__date')
        ).order_by('-last_message_date')
        
        serializer = RoomSerializerMessage(all_chats, many=True)
        my_user = request.user.id
        return Response({"all_chats": serializer.data, "my_user": my_user})


class GetContacts(APIView):
    def get(self, request):
        all_chats = Room.objects.filter(users=request.user.id, room_type="D")
        serializer = RoomSerializerContacts(all_chats, many=True)
        my_user = request.user.id
        return Response({"all_chats": serializer.data, "my_user": my_user})


class GetMessages(APIView):
    def get(self, request, room):
        # messages = Room.objects.get(id=room).room.all().order_by('-id')[:25:-1]
        messages = Room.objects.get(id=room).room.all()
        serializer = MessageSerializer(messages, many=True)
        return Response({"messages": serializer.data})
    def post(self, request):
        Response()


# class GetLastMessage(APIView):
#     def get(self, request, room):
#         message = Room.objects.get(id=room).room.latest("id")
#         serializer = MessageSerializer(message, many=False)
#         print(serializer.data)
#         return Response({"messages": serializer.data})
#     def post(self, request):
#         Response()




# @login_required(login_url='login')
# def home(request):
#     User = get_user_model()
#     all_users = User.objects.exclude(id=request.user.id)
#     username = request.user.rooms
#     all_chats = username.all()
#     opponent = ""
#     for each in all_chats:
#         opponent = each.users.filter(email=request.user)
#
#     return render(request, 'home.html', {"all_users": all_users, "all_chats": all_chats, "opponent": opponent})


@login_required(login_url='login')
def deleteuser(request):
    if request.method == 'POST':
        delete_form = UserDeleteForm(request.POST, instance=request.user)
        user = request.user
        user.delete()
        return redirect('login')
    else:
        delete_form = UserDeleteForm(instance=request.user)

    context = {
        'delete_form': delete_form
    }

    return redirect('login')


def pageNotFound(request, exception):
    return redirect("home")

def pageNotFound500(request):
    return redirect("home")


class RegisterUser(DataMixin, CreateView):
    form_class = CustomUserCreationForm
    # fields = ('username', 'email', 'password', 'first_name')
    template_name = 'pages/signup.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Registration")
        return dict(list(context.items()) + list(c_def.items()))

    # def form_valid(self, form):
    #     user = form.save()
    #     # login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')
    #     login(self.request, user)
    #     return redirect('home')


class LoginUser(DataMixin, LoginView):
    form_class = AuthenticationForm
    template_name = 'pages/login.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Login")
        return dict(list(context.items()) + list(c_def.items()))


def logout_user(request):
    logout(request)
    return redirect('login')


def profile(request):
    return render(request, 'pages/profile.html')


    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Registration")
        return dict(list(context.items()) + list(c_def.items()))


    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('home')


@login_required(login_url='login')
def set_settings(request):
    theme = request.POST.get('theme', False)
    if(not UserSetting.objects.filter(user=request.user).exists()):
        new_settings = UserSetting.objects.create(user=request.user)
        new_settings.save()
    request.user.usersetting.theme = theme
    request.user.usersetting.save()

    return HttpResponse('Message sent successfully')


@login_required(login_url='login')
def get_settings(request):
    if(not UserSetting.objects.filter(user=request.user).exists()):
        new_settings = UserSetting.objects.create(user=request.user)
        new_settings.save()
    settings = {"theme": request.user.usersetting.theme}


    return JsonResponse({"settings": settings}, safe=False)


@login_required(login_url='login')
def ms_reaction(request):
    reaction = request.POST.get('reaction', False)
    mes_id = request.POST.get('message_id', False)
    message = Message.objects.get(id=mes_id)
    if(message.liked):
        message.liked = False
    else:
        message.liked = True
    message.save()
    return HttpResponse('Message saved')


@login_required(login_url='login')
def save_profile_avatar(request):
    avatar = request.FILES.getlist('user_avatar', False)
    if avatar:
        avatar = avatar[0]

    fss = FileSystemStorage()
    filename = fss.save(avatar.name[:avatar.name.rfind('.')].encode(encoding='utf8').hex() + avatar.name[avatar.name.rfind('.'):], avatar)
    url = fss.url(filename)
    request.user.image = url
    request.user.save()
    return HttpResponse('Message saved')


@login_required(login_url='login')
def save_room_avatar(request):
    avatar = request.FILES.getlist('room_avatar', False)
    url = ""
    if avatar:
        avatar = avatar[0]
        fss = FileSystemStorage()
        filename = fss.save(avatar.name[:avatar.name.rfind('.')].encode(encoding='utf8').hex() + avatar.name[avatar.name.rfind('.'):], avatar)
        url = fss.url(filename)
    room_name = request.POST.get('room_name', False)
    contacts_id = json.loads(request.POST.get('contacts_id', False))
    room_type = request.POST.get('room_type', False)
    print("AAA", contacts_id[0])

    if room_type == "G":
        new_room = Room.objects.create(room_type="G", name=room_name, image=url)
        for i in range(len(contacts_id)):
            new_room.users.add(int(contacts_id[i]))
        new_room.save()
        return JsonResponse({"id": new_room.id}, safe=False)

    if room_type == "D":
        new_room = Room.objects.create(room_type="D")
        for i in range(len(contacts_id)):
            new_room.users.add(int(contacts_id[i]))
        new_room.save()
        return JsonResponse({"id": new_room.id}, safe=False)

def get_general_info(request):
    User = get_user_model()
    user = User.objects.filter(id=request.user.id)
    return JsonResponse({"user": list(user.values())}, safe=False)

