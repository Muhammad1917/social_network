from django.conf import settings
from django.core.mail import send_mail


def send_verification_email(user, token):
    verification_url = f'{settings.FRONTEND_URL}/verify-email?token={token}'
    send_mail(
        subject='Verify your email address',
        message=(
            f'Hi {user.username},\n\n'
            f'Please verify your email by clicking the link below:\n\n'
            f'{verification_url}\n\n'
            f'This link expires in 24 hours.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def send_password_reset_email(user, uid, token):
    reset_url = f'{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}'
    send_mail(
        subject='Reset your password',
        message=(
            f'Hi {user.username},\n\n'
            f'Reset your password by clicking the link below:\n\n'
            f'{reset_url}\n\n'
            f'If you did not request this, you can ignore this email.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
