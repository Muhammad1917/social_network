import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    has_profile = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Profile(models.Model) : 
    user = models.ForeignKey(User , on_delete-models.CASCADE , related='user_profile')
    display_name = models.Charfield(max_length=64)
    bio = models.Textfield(blank = True)
    profile_picture = models.ImageField(null=False ,  blank=False) 
    created_at = models.DateTimeField(auto_add = True)
    updated_at = models.DateTimeField(auto_now_add= True)

    # website
    # location
    # birthday
    # pronouns
    # verified
    # private_account
    # followers_count
    # following_count
    # posts_count
    get_profile_picture_url()

    has_profile_picture():

    delete_old_profile_picture():

    save():


    def __str__(self) :
        return f"Profile of {self.user.username}"
class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_tokens')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f'Verification token for {self.user.email}'

