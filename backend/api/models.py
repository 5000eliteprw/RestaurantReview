from datetime import datetime

from django.db import models
from django.contrib.auth import models as auth_models

__all__ = ['User', 'Restaurant', 'Review', 'Group']

User = auth_models.User
Group = auth_models.Group


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    background_image_url = models.CharField(max_length=1000, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


class Review(models.Model):
    class Meta:
        unique_together = (('user', 'restaurant'),)

    RATING_CHOICES = ((1, 1), (2, 2), (3, 3), (4, 4), (5, 5))
    COMMENT_LENGTH = 200

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_visited = models.DateTimeField(default=datetime.now)
    comment = models.CharField(max_length=COMMENT_LENGTH)
    rating = models.FloatField(choices=RATING_CHOICES, null=False)
    timestamp = models.DateTimeField(auto_now=True)
    reply = models.CharField(max_length=COMMENT_LENGTH, blank=True, default='')
