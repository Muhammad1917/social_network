from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):


    def has_object_permission(
        self,
        request,
        view,
        obj
    ):

        return obj.author == request.user


from rest_framework.permissions import BasePermission


class IsCommentOwner(BasePermission):
    """
    Only the author of a comment can modify or delete it.
    """

    message = "You can only modify your own comments."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return obj.author_id == request.user.id


