# Generated by Django 3.2.18 on 2023-04-21 18:51

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0010_auto_20230419_1958'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.TextField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='value',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='viewed',
            field=models.ManyToManyField(blank=True, related_name='viewed', to=settings.AUTH_USER_MODEL),
        ),
    ]
