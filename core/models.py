import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator
from django.conf import settings

  
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser):
    email = models.EmailField(unique=True)
    has_profile = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

from django.db import models
from django.conf import settings


class Profile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )


    name = models.CharField(
        max_length=100,
        blank=True
    )


    bio = models.TextField(
        max_length=500,
        blank=True
    )


    profile_picture = models.ImageField(
        upload_to="profiles/pictures/",
        blank=True,
        null=True
    )


    website = models.URLField(
        blank=True,
        null=True
    )


    location = models.CharField(
        max_length=100,
        blank=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):
        return self.user.username

from django.conf import settings
from django.db import models


class Post(TimeStampedModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )

    content = models.TextField(max_length=5000)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Post {self.id} by {self.author.username}"


class Comment(TimeStampedModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    post = models.ForeignKey(
        "Post",
        on_delete=models.CASCADE,
        related_name="comments",
    )

    # Null = top-level comment.
    # Non-null = reply to another comment.
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies",
    )

    content = models.TextField(
        max_length=2000,
    )

    class Meta:
        ordering = ["created_at"]

        indexes = [
            models.Index(
                fields=["post", "created_at"],
                name="comment_post_created_idx",
            ),
            models.Index(
                fields=["parent", "created_at"],
                name="comment_parent_created_idx",
            ),
        ]

    def __str__(self):
        return (
            f"Comment {self.pk} "
            f"by {self.author.username}"
        )
class PostLike(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="liked_posts",
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_post_like",
            )
        ]

    def __str__(self):
        return f"{self.user} likes post {self.post_id}"

class CommentLike(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="liked_comments",
    )

    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="unique_comment_like",
            )
        ]

    def __str__(self):
        return f"{self.user} likes comment {self.comment_id}"

class PostMedia(TimeStampedModel):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="media"
    )

    file = models.FileField(
        
        upload_to="posts/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                    "gif",
                    "mp4",
                    "mov",
                    "avi",
                    "webm",
                ]
            )
    ]
    )

    media_type = models.CharField(
        max_length=10,
        choices=MediaType.choices
    )

    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_tokens')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f'Verification token for {self.user.email}'

