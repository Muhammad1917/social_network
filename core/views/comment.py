from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.querysets import annotate_comments
from rest_framework.pagination import PageNumberPagination
from core.models import Comment,Post
from core.serializers.comment import (
    CommentSerializer,
    CommentCreateSerializer
)
from rest_framework.generics import (
    DestroyAPIView,
    UpdateAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
)
from django.db import transaction
from django.db.models import Count, Exists, OuterRef

from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from core.models import (
    Post,
    Comment,
    CommentLike,
)

from core.serializers.comment import (
    CommentCreateSerializer,
    CommentSerializer,
)


class CommentListCreateView(ListCreateAPIView):
    """
    GET:
        /posts/<post_id>/comments/

    POST:
        /posts/<post_id>/comments/
    """

    pagination_class = None

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def get_post(self):
        return Post.objects.get(
            pk=self.kwargs["post_id"]
        )

    def get_queryset(self):
        post = self.get_post()

        user = self.request.user

        queryset = (
            Comment.objects
            .filter(
                post=post,
                parent__isnull=True,
            )
            .select_related(
                "author",
                "author__profile",
            )
            .annotate(
                likes_count=Count(
                    "likes",
                    distinct=True,
                ),
                replies_count=Count(
                    "replies",
                    distinct=True,
                ),
            )
        )

        if user.is_authenticated:
            queryset = queryset.annotate(
                is_liked=Exists(
                    CommentLike.objects.filter(
                        comment=OuterRef("pk"),
                        user=user,
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                is_liked=False
            )

        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CommentCreateSerializer

        return CommentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        context["post"] = self.get_post()

        return context

    def perform_create(self, serializer):
        serializer.save()


class CommentDetailView(
    RetrieveUpdateDestroyAPIView
):
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Comment.objects
            .select_related(
                "author",
                "author__profile",
                "post",
            )
            .annotate(
                likes_count=Count(
                    "likes",
                    distinct=True,
                ),
                replies_count=Count(
                    "replies",
                    distinct=True,
                ),
            )
            .annotate(
                is_liked=Exists(
                    CommentLike.objects.filter(
                        comment=OuterRef("pk"),
                        user=user,
                    )
                )
            )
        )

        return queryset

    def get_serializer_class(self):
        if self.request.method in (
            "PATCH",
            "PUT",
        ):
            return CommentCreateSerializer

        return CommentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        comment = getattr(
            self,
            "object",
            None,
        )

        if comment:
            context["post"] = comment.post

        return context

    def get_object(self):
        comment = super().get_object()

        if comment.author_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You can only modify your own comments."
            )

        return comment

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop(
            "partial",
            False,
        )

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        # Re-fetch with annotations.
        instance = self.get_queryset().get(
            pk=instance.pk
        )

        response_serializer = CommentSerializer(
            instance,
            context=self.get_serializer_context(),
        )

        return Response(
            response_serializer.data
        )

class CommentLikeView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, comment_id):
        comment = Comment.objects.get(
            pk=comment_id
        )

        _, created = CommentLike.objects.get_or_create(
            user=request.user,
            comment=comment,
        )

        return Response(
            {
                "is_liked": True,
                "created": created,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, comment_id):
        deleted, _ = CommentLike.objects.filter(
            user=request.user,
            comment_id=comment_id,
        ).delete()

        return Response(
            {
                "is_liked": False,
                "deleted": deleted > 0,
            },
            status=status.HTTP_200_OK,
        )

class CommentRepliesView(ListCreateAPIView):
    permission_classes = [
        AllowAny,
    ]

    pagination_class = None

    def get_queryset(self):
        parent_id = self.kwargs["comment_id"]

        user = self.request.user

        queryset = (
            Comment.objects
            .filter(
                parent_id=parent_id
            )
            .select_related(
                "author",
                "author__profile",
            )
            .annotate(
                likes_count=Count(
                    "likes",
                    distinct=True,
                ),
                replies_count=Count(
                    "replies",
                    distinct=True,
                ),
            )
        )

        if user.is_authenticated:
            queryset = queryset.annotate(
                is_liked=Exists(
                    CommentLike.objects.filter(
                        comment=OuterRef("pk"),
                        user=user,
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                is_liked=False
            )

        return queryset

    serializer_class = CommentSerializer