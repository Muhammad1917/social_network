from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth import (
    LoginView,
    LogoutView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetView,
    RegisterView,
    VerifyEmailView,
)

from .views.profile import (
    CurrentUserProfileView
)

urlpatterns = [
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/verify-email/', VerifyEmailView.as_view(), name='auth-verify-email'),
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('api/auth/me/', MeView.as_view(), name='auth-me'),
    path('api/auth/password-reset/', PasswordResetView.as_view(), name='auth-password-reset'),
    path('api/auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='auth-password-reset-confirm'),
    
    path('api/profile/me'),
    pth('api/profile/<username> ',CurrentUserProfileView.as_view() , name='profile' )

]
