from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)

from core.serializers.profile import (
    ProfileSerializer,
    ProfileUpdateSerializer
)

from core.models import Profile


class MyProfileView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def get(
        self,
        request
    ):

        profile=request.user.profile


        serializer=ProfileSerializer(
            profile,
            context={
                "request":request
            }
        )


        return Response(
            serializer.data
        )



    def patch(
        self,
        request
    ):

        profile=request.user.profile


        serializer=ProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            ProfileSerializer(
                profile,
                context={
                    "request":request
                }
            ).data
        )


class PublicProfileView(APIView):

    permission_classes=[
        AllowAny
    ]


    def get(
        self,
        request,
        username
    ):

        profile=Profile.objects.select_related(
            "user"
        ).get(
            user__username=username
        )


        serializer=ProfileSerializer(
            profile,
            context={
                "request":request
            }
        )


        return Response(
            serializer.data
        )