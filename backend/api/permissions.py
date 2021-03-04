from rest_framework import permissions


class AdminUserRead(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user is None:
            return False

        if request.method != 'GET':
            return False

        return request.user.is_superuser


class AdminUserWrite(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user is None:
            return False

        if request.method not in ['POST', 'DELETE', 'PUT']:
            return False

        return request.user.is_superuser


class AllUserRead(permissions.BasePermission):
    def has_permission(self, request, view):

        if request.user is None:
            return False

        if request.method != 'GET':
            return False

        return True


class AllUserWrite(permissions.BasePermission):
    def has_permission(self, request, view):

        if request.user is None:
            return False

        if request.method not in ['POST', 'DELETE', 'PUT']:
            return False

        return True


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.groups.first().name == "owner"


class OwnerUpdateReply(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user is None:
            return False

        if request.method not in ['PUT']:
            return False

        return request.user.groups.first().name == "owner" and request.path.endswith("reply")


class UserCreate(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method not in ['POST']:
            return False

        return request.user.groups.first().name == "user"

