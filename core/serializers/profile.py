from rest_framework import serializers

from core.models import Profile



class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )


    profile_picture_url = serializers.SerializerMethodField()



    class Meta:

        model = Profile

        fields = [
            "username",
            "name",
            "bio",
            "profile_picture",
            "profile_picture_url",
            "website",
            "location",
            "created_at",
            "updated_at",
        ]



    def get_profile_picture_url(
        self,
        obj
    ):
    
        if not obj.profile_picture:
            return None


        request = self.context.get(
            "request"
        )

        if request:
            return request.build_absolute_uri(
                obj.profile_picture.url
            )


        return obj.profile_picture.url


class ProfileUpdateSerializer(
    serializers.ModelSerializer
):


    class Meta:

        model = Profile

        fields = [
            "name",
            "bio",
            "profile_picture",
            "website",
            "location",
        ]