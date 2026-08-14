# search/serializers.py

from rest_framework import serializers

from core.models import User, Profile
from core.models import Post


class SearchQuerySerializer(serializers.Serializer):
    q = serializers.CharField(
        max_length=100,
        allow_blank=False,
        trim_whitespace=True,
    )

    def validate_q(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Search query must contain at least 2 characters."
            )

        return value


class SearchProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="profile.name", read_only=True)
    profile_picture = serializers.ImageField(
        source="profile.profile_picture",
        read_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "name",
            "profile_picture",
        ]


class SearchPostSerializer(serializers.ModelSerializer):
    author = SearchProfileSerializer(read_only=True)
    rank = serializers.FloatField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "content",
            "author",
            "created_at",
            "updated_at",
            "rank",
        ]