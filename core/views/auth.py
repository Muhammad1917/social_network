from datetime import timedelta

from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from core.models import  User
# from core.serializers.auth import (
#     LoginSerializer,
#     PasswordResetConfirmSerializer,
#     PasswordResetSerializer,
#     RegisterSerializer,
    
# )
# from core.services.email import send_password_reset_email, send_verification_email

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response

class DebugAuth(APIView):
    def get(self, request):
        return Response({
            "authorization": request.headers.get("Authorization"),
            "user": str(request.user),
            "authenticated": request.user.is_authenticated,
        })


# class RegisterView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         data = serializer.validated_data

#         user = User.objects.create_user(
#             email=data['email'],
#             username=data['username'],
#             password=data['password'],
#             is_active=False,
#         )

#         verification_token = EmailVerificationToken.objects.create(
#             user=user,
#             expires_at=timezone.now() + timedelta(hours=24),
#         )
#         send_verification_email(user, verification_token.token)

#         return Response(
#             {'detail': 'Registration successful. Please check your email to verify your account.'},
#             status=status.HTTP_201_CREATED,
#         )


# class VerifyEmailView(APIView):
#     permission_classes = [AllowAny]

#     def _verify(self, token):
        

# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
        

# class LogoutView(APIView):
#     def post(self, request):
        
# class MeView(APIView):
#     def get(self, request):
#         return Response(UserSerializer(request.user).data)


# class PasswordResetView(APIView):
#     permission_classes = [AllowAny]


# class PasswordResetConfirmView(APIView):
#     permission_classes = [AllowAny]


# __all__ = [
#     'RegisterView',
#     'VerifyEmailView',
#     'LoginView',
#     'LogoutView',
#     'MeView',
#     'PasswordResetView',
#     'PasswordResetConfirmView',
#     'TokenRefreshView',
# ]
