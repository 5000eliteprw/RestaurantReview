from rest_framework import serializers
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

from ..models import User, Group

ROLE_CHOICES = (('user', 'user'), ('owner', 'owner'), ('admin', 'admin'))


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(write_only=True, choices=ROLE_CHOICES)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'password']

    def save(self, validated_data):

        user = User(email=validated_data['email'],
                    username=validated_data['email'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'])

        password = validated_data['password']
        if len(password) < 3:
            raise serializers.ValidationError('Password length must be greater than 3.')

        try:
            user.set_password(password)
            user.save()

            role = validated_data['role']
            group, _ = Group.objects.get_or_create(name=role)
            user.groups.add(group)
            user.save()
        except Exception as ex:
            raise ValidationError("Invalid parameters")

        return user


class EmailTokenObtainSerializer(TokenObtainSerializer):
    username_field = User.EMAIL_FIELD


class CustomTokenObtainPairSerializer(EmailTokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        password = attrs.get("password")
        user_obj = User.objects.filter(email=attrs.get("email")).first()
        if user_obj is not None:
            credential = {
                'username': user_obj.username,
                'password': password
            }
            user = authenticate(request=self.context['request'], **credential)
            if user is None or not user.is_active:
                raise AuthenticationFailed()

            refresh = self.get_token(user)

            role = ""
            if user.is_superuser:
                role = "admin"
            else:
                role = user.groups.first().name

            data = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": role
                }
            }

            return data
        else:
            raise AuthenticationFailed()


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegistrationView(GenericAPIView):
    serializer_class = RegistrationSerializer

    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response('Registration successful')
