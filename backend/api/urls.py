from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from .views import UserViewSet, RestaurantViewSet, ReviewViewSet, RegistrationView, EmailTokenObtainPairView

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet)
router.register(r'restaurants', RestaurantViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Auth
    path('auth/register', RegistrationView.as_view(), name='registration'),
    path('auth/login', EmailTokenObtainPairView.as_view(), name='token_obtain_pair')
]
