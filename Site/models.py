from django.db import models
from django.utils.translation import gettext_lazy as _
from django import forms
from django.contrib.auth.models import AbstractUser
# from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from datetime import datetime
from .managers import CustomUserManager
import hashlib
from binascii import hexlify
import os
from rest_framework import serializers
from django.contrib.auth import get_user_model


class Room(models.Model):

    ROOM_TYPES = [
        ('D', 'DIALOG'),
        ('G', 'GROUP'),
        ('C', 'CHANNEL'),
    ]

    name = models.CharField(max_length=255, null=True, blank=True)
    users = models.ManyToManyField("CustomUser", related_name="users")
    room_type = models.CharField(max_length=1, choices=ROOM_TYPES, default='D')
    image = models.ImageField(max_length=255, null=True, upload_to='images/', blank=True)

    class Meta:
        ordering = ["-id"]





class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    username = models.TextField(max_length=100, unique=False, null=True)
    image = models.ImageField(max_length=255, null=True, upload_to='images/', blank=True)
    rooms = models.ManyToManyField(Room, blank=True)


    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']

        if password1 and password2 and password1 != password2:
            raise ValidationError("Password don't match")
        return password2

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


# class RegisterForm(CustomUser):
#     first_name = forms.CharField(max_length=30, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Name'}), error_messages={'required': 'Please enter your name'})
#     username = forms.CharField(max_length=100, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Username'}), error_messages={'required': 'Please enter your name'})
#     email = forms.EmailField(label='', max_length=254, help_text='', widget=forms.EmailInput(attrs={'placeholder': 'Email-address'}))
#     password1 = forms.CharField(label='', required=True,
#                                 widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}))
#     password2 = forms.CharField(label='', required=True,
#                                 widget=forms.PasswordInput(attrs={'placeholder': 'Enter the same password'}))
#
#     def clean_password2(self):
#         password1 = self.cleaned_data['password1']
#         password2 = self.cleaned_data['password2']
#
#         if password1 and password2 and password1 != password2:
#             raise ValidationError("Password don't match")
#         return password2
#
#     class Meta:
#         model = CustomUser
#         fields = ('first_name',)


class File(models.Model):
    file = models.FileField(max_length=255, null=True, blank=True, upload_to='images/')

    def get_absolute_url(self):
        return f'/person/{self.name}/'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"
        read_only_fields = ["file"]


class Sticker(models.Model):
    file = models.FileField(max_length=255, null=True, blank=True, upload_to='images/')
    name = models.ForeignKey("StickerCollection", blank=True, related_name="sticker", on_delete=models.PROTECT)

    def get_absolute_url(self):
        return f'/person/{self.name}/'


class StickerCollection(models.Model):
    name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    value = models.TextField(max_length=10000, null=True)
    date = models.DateTimeField(default=datetime.now, blank=True)
    user = models.ForeignKey("CustomUser", blank=True, related_name="user", on_delete=models.PROTECT)
    room = models.ForeignKey("Room", blank=True, related_name="room", on_delete=models.CASCADE)
    file = models.ManyToManyField("File", blank=True, related_name="files")
    viewed = models.ManyToManyField("CustomUser", blank=True, related_name="viewed")
    liked = models.IntegerField(default=0)
    allowed_users = models.ManyToManyField("CustomUser", blank=True)
    forwarded = models.ForeignKey("CustomUser", blank=True, related_name="forwarded", on_delete=models.PROTECT, null=True)

    class Meta:
        ordering = ['id']


class MessageSerializer(serializers.ModelSerializer):
    file = FileSerializer(many=True)

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["value", "file", "forwarded", "allowed_users", "viewed", "room", "user", "date", 'liked']


class MessageSerializerRoom(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("viewed", "user")
        read_only_fields = fields


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("name", "image", "room_type", "id")
        read_only_fields = fields





class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "image")
        read_only_fields = fields


class RoomSerializerMessage(serializers.ModelSerializer):
    # room = MessageSerializerRoom(many=True, read_only=True)
    users = UserSerializer(many=True, read_only=True)
    # last_message = serializers.Field(source="latest")

    class Meta:
        model = Room
        fields = ("name", "users", "room_type", "id", "image")
        read_only_fields = fields


class RoomSerializerContacts(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ("users",)
        read_only_fields = fields


class UserSetting(models.Model):
    THEMES = [
        ('D', 'DARK'),
        ('L', 'LIGHT'),
    ]
    theme = models.CharField(max_length=1, choices=THEMES, default='D')
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, default=None, blank=True)









# class Profile(models.Model):
#     user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='images/', default='default_avatar.jpg', null=True, blank=True)


class RemoveUser(forms.Form):
    username = forms.CharField()


class UserDeleteForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = []




