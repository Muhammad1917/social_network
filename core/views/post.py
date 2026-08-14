from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from django.db.models import Value, BooleanField
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Exists, OuterRef

from core.models import Post, PostLike
from core.serializers.post import (
    PostSerializer,
    PostCreateSerializer
)



class PostListCreateView(APIView):
    

    def get_permissions(self):

        if self.request.method=="POST":
            return [
                IsAuthenticated()
            ]

        return [
            AllowAny()
        ]



    def get(self, request):

        if request.user.is_authenticated:
            is_liked_query = Exists(
                PostLike.objects.filter(
                    post=OuterRef("pk"),
                    user=request.user,
                )
            )
        else:
            is_liked_query = Value(
                False,
                output_field=BooleanField(),
            )
        
        posts = (
            Post.objects
            .select_related("author")
            .prefetch_related("media")
            .annotate(
                likes_count=Count("likes"),
                comments_count=Count("comments"),
                is_liked=is_liked_query,
            ).order_by(
            "-created_at"
            )
        )

        paginator = PageNumberPagination()

        # Uses PAGE_SIZE from your settings if page_size isn't set here.
        page = paginator.paginate_queryset(posts, request)

        serializer = PostSerializer(
            page,
            many=True,
            context={"request": request},
        )

        return paginator.get_paginated_response(serializer.data)



    def post(self,request):

        serializer = PostCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        post=serializer.save()


        return Response(
            PostSerializer(
                post,
                context={
                    "request":request
                }
            ).data,
            status=201
        )


class PostDetailView(APIView):


    permission_classes=[
        AllowAny
    ]


    def get(self,request,pk):

        post=Post.objects.select_related(
            "author"
        ).prefetch_related(
            "media"
        ).get(
            id=pk
        )


        serializer=PostSerializer(
            post,
            context={
                "request":request
            }
        )

        return Response(
            serializer.data
        )