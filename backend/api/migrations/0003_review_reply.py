# Generated by Django 3.1.2 on 2020-10-06 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_restaurant_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='reply',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
    ]