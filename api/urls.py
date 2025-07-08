from django.urls import path, include
from .views import *

urlpatterns = [
    path('festplay/', include([
    path('artists/', ArtistView.as_view()),
    path('add-artist/', CreateArtistView.as_view()),
    path('top-songs/', TopSongListView.as_view()),
    path("artist-search/", SearchArtistView.as_view()),
    path("artists/<int:pk>/", ArtistDetailView.as_view(), name="delete-artist")
]))
]
