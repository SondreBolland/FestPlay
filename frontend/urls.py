from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('add-artist', index),
    path('playlist-config', index)
]