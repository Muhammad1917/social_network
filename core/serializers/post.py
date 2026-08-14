from rest_framework import serializers

from core.models import Post, PostMedia
from .media import PostMediaSerializer



class PostCreateSerializer(serializers.ModelSerializer):

    media = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        write_only=True
    )


    class Meta:
        model = Post
        fields = [
            "content",
            "media",
        ]


    def create(self, validated_data):

        files = validated_data.pop(
            "media",
            []
        )

        request = self.context["request"]

        post = Post.objects.create(
            author=request.user,
            **validated_data
        )


        for index, file in enumerate(files):

            media_type = self.detect_type(file)

            PostMedia.objects.create(
                post=post,
                file=file,
                media_type=media_type,
                order=index
            )


        return post



    def detect_type(self,file):

        content_type = file.content_type


        if content_type.startswith("image/"):
            return PostMedia.MediaType.IMAGE


        if content_type.startswith("video/"):
            return PostMedia.MediaType.VIDEO


        raise serializers.ValidationError(
            "Unsupported file type"
        )



class PostSerializer(serializers.ModelSerializer):

    author = serializers.SerializerMethodField()

    media = PostMediaSerializer(
        many=True,
        read_only=True
    )

    likes_count = serializers.IntegerField(
        read_only=True
    )

    comments_count = serializers.IntegerField(
        read_only=True
    )

    is_liked = serializers.BooleanField(
        read_only=True
    )


    class Meta:
        model = Post

        fields = [
            "id",
            "author",
            "content",
            "media",
            "likes_count",
            "comments_count",
            "is_liked",
            "created_at",
            "updated_at",
        ]



    def get_author(self,obj):

        return {
            "id":obj.author.id,
            "username":obj.author.username
        }