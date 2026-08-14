from django.db.models import Count
from django.db.models import Exists
from django.db.models import OuterRef

from core.models import Comment
from core.models import CommentLike


def annotate_comments(queryset, user):

    return queryset.select_related(
        "author"
    ).annotate(

        likes_count=Count(
            "likes",
            distinct=True,
        ),

        replies_count=Count(
            "replies",
            distinct=True,
        ),

        is_liked=Exists(

            CommentLike.objects.filter(
                comment=OuterRef("pk"),
                user=user,
            )

        ),
    )