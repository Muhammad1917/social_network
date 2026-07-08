from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth.tokens import default_token_generator
from django.test import TestCase, override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import EmailVerificationToken, User


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.verify_url = '/api/auth/verify-email/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.me_url = '/api/auth/me/'
        self.reset_url = '/api/auth/password-reset/'
        self.reset_confirm_url = '/api/auth/password-reset/confirm/'
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'SecurePass123!',
        }

    def _register_user(self):
        with patch('core.views.auth.send_verification_email'):
            response = self.client.post(self.register_url, self.user_data, format='json')
        return response

    def _verify_user(self, user):
        token = EmailVerificationToken.objects.get(user=user)
        return self.client.get(f'{self.verify_url}?token={token.token}')

    def test_register_creates_inactive_user(self):
        response = self._register_user()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=self.user_data['email'])
        self.assertFalse(user.is_active)
        self.assertTrue(EmailVerificationToken.objects.filter(user=user).exists())

    def test_login_fails_before_verification(self):
        self._register_user()
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_email_activates_user(self):
        self._register_user()
        user = User.objects.get(email=self.user_data['email'])
        response = self._verify_user(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertFalse(EmailVerificationToken.objects.filter(user=user).exists())

    def test_login_returns_jwt_after_verification(self):
        self._register_user()
        user = User.objects.get(email=self.user_data['email'])
        self._verify_user(user)
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_me_requires_authentication(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_user_profile(self):
        self._register_user()
        user = User.objects.get(email=self.user_data['email'])
        self._verify_user(user)
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_logout_blacklists_refresh_token(self):
        self._register_user()
        user = User.objects.get(email=self.user_data['email'])
        self._verify_user(user)
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }, format='json')
        refresh = login_response.data['refresh']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        response = self.client.post(self.logout_url, {'refresh': refresh}, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Exception):
            RefreshToken(refresh)

    def test_password_reset_flow(self):
        self._register_user()
        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        with patch('core.views.auth.send_password_reset_email'):
            response = self.client.post(self.reset_url, {'email': user.email}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        response = self.client.post(self.reset_confirm_url, {
            'uid': uid,
            'token': token,
            'new_password': 'NewSecurePass456!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()
        self.assertTrue(user.check_password('NewSecurePass456!'))

