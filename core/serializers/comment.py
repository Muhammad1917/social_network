from django.db.models import Count, Exists, OuterRef
from rest_framework import serializers

from core.models import (
    Comment,
    CommentLike,
)


class CommentCreateSerializer(serializers.ModelSerializer):
    """
    Used when creating a comment or reply.

    The client provides:
        {
            "content": "...",
            "parent": 123
        }

    parent is optional.
    """

    class Meta:
        model = Comment
        fields = [
            "content",
            "parent",
        ]

    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Comment cannot be empty."
            )

        return value

    def validate_parent(self, parent):
        """
        A reply must belong to the same post as the
        comment being created.

        The post is provided by the view through
        serializer.save(post=post).
        """

        if parent is None:
            return parent

        post = self.context.get("post")

        if post is None:
            raise serializers.ValidationError(
                "Post context is required."
            )

        if parent.post_id != post.id:
            raise serializers.ValidationError(
                "You cannot reply to a comment from another post."
            )

        return parent

    def create(self, validated_data):
        request = self.context["request"]
        post = self.context["post"]

        return Comment.objects.create(
            author=request.user,
            post=post,
            **validated_data,
        )


class CommentSerializer(serializers.ModelSerializer):
    """
    Read serializer used by the API.

    Contains everything the frontend needs to render
    a comment.
    """

    author = serializers.SerializerMethodField()

    likes_count = serializers.IntegerField(
        read_only=True
    )

    replies_count = serializers.IntegerField(
        read_only=True
    )

    is_liked = serializers.BooleanField(
        read_only=True
    )

    class Meta:
        model = Comment

        fields = [
            "id",
            "author",
            "content",
            "parent",
            "likes_count",
            "replies_count",
            "is_liked",
            "created_at",
            "updated_at",
        ]

    def get_author(self, obj):
        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "avatar": getattr(
                getattr(obj.author, "profile", None),
                "avatar",
                None,
            ),
        }