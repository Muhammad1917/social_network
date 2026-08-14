from rest_framework import serializers
from core.models import PostMedia


class PostMediaSerializer(serializers.ModelSerializer):

    url = serializers.SerializerMethodField()


    class Meta:
        model = PostMedia
        fields = [
            "id",
            "url",
            "media_type",
            "order",
            "created_at",
        ]


    def get_url(self, obj):
        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url