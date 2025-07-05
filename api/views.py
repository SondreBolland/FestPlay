from django.core.management import call_command
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Artist
from .serializers import *

from .apis.musicbrainz_api.get_mbid import search_artists


# Create your views here.

class ArtistView(generics.ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    
class CreateArtistView(APIView):
    serializer_class = CreateArtistSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            artist_name = serializer.data.get('name')
            mbid = serializer.data.get('mbid')
            
            queryset = Artist.objects.filter(mbid=mbid)
            if queryset.exists():
                return Response(None, status=status.HTTP_208_ALREADY_REPORTED)

            artist = Artist(name=artist_name, mbid=mbid)
            artist.save()

            # Run management commands here
            try:
                call_command("get_setlists", mbid=mbid)
                call_command("populate_top_songs", mbid=mbid, n_songs=15)
            except Exception as e:
                print(e)
                return Response({"error": f"Artist added, but failed to run commands: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response(ArtistSerializer(artist).data, status=status.HTTP_201_CREATED) 

        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArtistDetailView(generics.DestroyAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

class SearchArtistView(APIView):
    def get(self, request, format=None):
        query = request.query_params.get("q", "")
        if not query:
            return Response({"error": "Missing 'q' parameter"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            results = search_artists(query)
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class TopSongListView(generics.ListAPIView):
    queryset = TopSong.objects.all().select_related('artist')
    serializer_class = TopSongSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['artist__name']

    def get_queryset(self):
        queryset = super().get_queryset()
        artist_id = self.request.query_params.get('artist', None)
        if artist_id:
            queryset = queryset.filter(artist__id=artist_id)
        limit = self.request.query_params.get('limit', None)
        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass
        return queryset
