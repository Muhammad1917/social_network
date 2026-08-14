from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from core.views.search import SearchView

# from .views.auth import (
#     LoginView,
#     LogoutView,
#     MeView,
#     PasswordResetConfirmView,
#     PasswordResetView,
#     RegisterView,
#     VerifyEmailView,
# )
from core.views.comment import (
    CommentListCreateView,
    CommentDetailView,
    CommentLikeView,
    CommentRepliesView,
)
from django.urls import path

from .views.post import (
    PostListCreateView,
    PostDetailView
)

from .views.like import (
    PostLikeView
)

from .views.comment import (
    CommentListCreateView
)


from .views.auth import (
    DebugAuth
)
from .views.profile import (
    MyProfileView,
    PublicProfileView
)
urlpatterns = [

    # path('api/profile/me'),
    path('api/testauth',DebugAuth.as_view() , name='testauth' ),

    # path('api/profile/<str:typed_username>',UserProfileDataView.as_view() , name='user_profile' ),
    # path('api/profile/edit',UserProfileUpdateView.as_view() , name='update_profile' ),
    # path('api/check_username',UserNameCheckView.as_view() , name="check_username"),
    path(
        "posts/",
        PostListCreateView.as_view()
    ),

    path(
        "posts/<int:pk>/",
        PostDetailView.as_view()
    ),


    path(
        "posts/<int:pk>/like/",
        PostLikeView.as_view()
    ),


   
    path(
        "profiles/me/",
        MyProfileView.as_view()
    ),


    path(
        "profiles/<str:username>/",
        PublicProfileView.as_view()
    ),

    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="post-comments",
    ),

    path(
        "comments/<int:comment_id>/",
        CommentDetailView.as_view(),
        name="comment-detail",
    ),

    path(
        "comments/<int:comment_id>/like/",
        CommentLikeView.as_view(),
        name="comment-like",
    ),

    path(
        "comments/<int:comment_id>/replies/",
        CommentRepliesView.as_view(),
        name="comment-replies",
    ),

    path(
        "search/",
        SearchView.as_view(),
        name="search"
     ),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )