from datetime import datetime

from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.api.models import Restaurant, Review
from rest_condition import Or
from backend.api.permissions import AllUserRead, AdminUserWrite, UserCreate, OwnerUpdateReply
from .user import UserSerializer


class ReviewRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'background_image_url']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, default=serializers.CurrentUserDefault())
    restaurant = ReviewRestaurantSerializer(read_only=True, required=False)
    restaurant_id = serializers.IntegerField(write_only=True, required=False)
    user_id = serializers.IntegerField(write_only=True, required=False)
    date_visited = serializers.DateTimeField(default=datetime.now)
    comment = serializers.CharField(allow_blank=True, required=False)
    reply = serializers.CharField(allow_blank=True, required=False)
    rating = serializers.FloatField(required=False)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment',  'user', 'restaurant', 'date_visited', 'restaurant_id', 'user_id', 'reply']


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    permission_classes = [Or(AllUserRead, AdminUserWrite, OwnerUpdateReply, UserCreate)]

    def get_queryset(self):
        owner_id = self.request.query_params.get('owner_id')
        is_pending = self.request.query_params.get('is_pending')

        reviews = self.queryset
        if owner_id is not None:
            res_list = owner_restaurants = Restaurant.objects.filter(owner_id=owner_id).values_list('id')
            reviews = reviews.filter(restaurant_id__in=res_list)
        if is_pending:
            reviews = reviews.filter(reply__exact='')
        return reviews

    @action(detail=True, methods=['put'])
    def reply(self, request, pk):
        review = self.get_object()
        reply = self.request.data.get('reply')
        review.reply = reply
        review.save()
        return Response("Success")