# search/views.py

from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    SearchVector,
)
from django.db.models import F

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import User
from core.models import Post

from core.serializers.search import (
    SearchQuerySerializer,
    SearchProfileSerializer,
    SearchPostSerializer,
)


class SearchView(APIView):

    def get(self, request):
        query_serializer = SearchQuerySerializer(
            data=request.query_params
        )

        query_serializer.is_valid(raise_exception=True)

        search_term = query_serializer.validated_data["q"]

        search_query = SearchQuery(
            search_term,
            search_type="websearch",
        )

        users = self.search_users(search_query)
        posts = self.search_posts(search_query)

        return Response(
            {
                "users": SearchProfileSerializer(
                    users,
                    many=True,
                    context={"request": request},
                ).data,
                "posts": SearchPostSerializer(
                    posts,
                    many=True,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def search_users(search_query):

        search_vector = (
            SearchVector(
                "username",
                weight="A",
            )
            + SearchVector(
                "profile__name",
                weight="B",
            )
            + SearchVector(
                "profile__bio",
                weight="C",
            )
            + SearchVector(
                "profile__location",
                weight="D",
            )
        )

        return (
            User.objects
            .select_related("profile")
            .annotate(
                search=search_vector,
                rank=SearchRank(
                    F("search"),
                    search_query,
                ),
            )
            .filter(
                search=search_query,
            )
            .order_by(
                "-rank",
                "username",
            )[:20]
        )

    @staticmethod
    def search_posts(search_query):

        search_vector = SearchVector(
            "content",
            weight="A",
        )

        return (
            Post.objects
            .select_related(
                "author",
                "author__profile",
            )
            .annotate(
                search=search_vector,
                rank=SearchRank(
                    F("search"),
                    search_query,
                ),
            )
            .filter(
                search=search_query,
            )
            .order_by(
                "-rank",
                "-created_at",
            )[:20]
        )