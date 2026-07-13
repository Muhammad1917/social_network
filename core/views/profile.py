from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

def CurrentUserProfileView(APIView) :
    Profile = ProfileSerializer()

def UserProfileDetailView(APIView) : 
    pass 

def UserProfileUpdateView(APIView) : 
    pass