from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers

from core.models import User , Profile


class ProfileSerializer(serializers.ModelSerializer) :
    class Meta : 
        model = Profile
        fields = ['user' , 'display_name', 'bio', 'profile_picture']
       
