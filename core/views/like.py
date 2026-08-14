from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import (
    Post,
    PostLike
)



class PostLikeView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def post(self,request,pk):

        post=Post.objects.get(
            id=pk
        )


        PostLike.objects.get_or_create(
            user=request.user,
            post=post
        )


        return Response(
            {
                "detail":"liked"
            }
        )



    def delete(self,request,pk):

        PostLike.objects.filter(
            user=request.user,
            post_id=pk
        ).delete()


        return Response(
            {
                "detail":"unliked"
            }
        )