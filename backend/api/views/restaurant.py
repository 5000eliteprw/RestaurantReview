from django.db.models import Avg, Max, Min
from rest_framework import serializers, viewsets
from rest_condition import Or
from rest_framework.generics import get_object_or_404

from .review import ReviewSerializer
from .user import UserSerializer

from backend.api.permissions import AdminUserWrite, IsOwnerOrReadOnly
from backend.api.models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    highest_rating = serializers.FloatField(read_only=True)
    lowest_rating = serializers.FloatField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    owner_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'background_image_url', 'owner', 'avg_rating', 'highest_rating',
                  'lowest_rating', 'reviews', 'owner_id']


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.annotate(
            avg_rating=Avg('reviews__rating'),
            highest_rating=Max('reviews__rating'),
            lowest_rating=Min('reviews__rating'))
    serializer_class = RestaurantSerializer
    permission_classes = [Or(AdminUserWrite, IsOwnerOrReadOnly)]

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        owner_id = self.request.query_params.get('owner_id')
        min_rating = self.request.query_params.get('min_rating')
        max_rating = self.request.query_params.get('max_rating')

        restaurants = self.queryset.all()
        if owner_id is not None:
            restaurants = restaurants.filter(owner_id=owner_id)
            restaurants_with_owner = restaurants
        else:
            restaurants_with_owner = restaurants

        if max_rating is not None:
            restaurants = restaurants.filter(avg_rating__lte=max_rating)
            restaurants = restaurants | restaurants_with_owner.filter(avg_rating__isnull=True)
        if min_rating is not None:
            restaurants = restaurants.filter(avg_rating__gte=min_rating)
            if min_rating == '-1':
                restaurants = restaurants | restaurants_with_owner.filter(avg_rating__isnull=True)

        return restaurants.order_by('-avg_rating')
