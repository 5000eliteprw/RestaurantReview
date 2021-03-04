from django.contrib.auth.models import User, Group
from rest_framework import viewsets, serializers
from rest_condition import Or

from backend.api.permissions import AdminUserRead, AdminUserWrite


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    id = serializers.ReadOnlyField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'role']
        # fields = '__all__'

    def get_role(self, user):
        role = ""
        if user.is_superuser:
            role = "admin"
        else:
            role = user.groups.first().name
        return role

    # def save(self, **kwargs):
    #     user = User(
    #         id=self.data.get('id', None),
    #         username=self.validated_data['username'],
    #     )
    #
    #     user.set_password(self.validated_data['password'])
    #     user.save()
    #     return user

    def save(self, **kwargs):
        super().save(**kwargs)

        if 'role' in self.initial_data:
            role = self.initial_data['role']
            if role == 'admin':
                self.instance.is_superuser = True
            else:
                self.instance.is_superuser = False

                self.instance.groups.clear()
                group, _ = Group.objects.get_or_create(name=role)
                self.instance.groups.add(group)

        if 'password' in self.initial_data:
            password = self.initial_data['password']
            self.instance.set_password(password)

        self.instance.save()

        return self.instance

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [Or(AdminUserRead, AdminUserWrite)]
    http_method_names = ['get', 'post', 'put', 'delete']
