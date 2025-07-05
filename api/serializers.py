from rest_framework import serializers
from .models import Song, Setlist, TopSong, Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('id', 'name', 'mbid')
        
class CreateArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('name', 'mbid')
        extra_kwargs = {
            'name': {'validators': []},
            'mbid': {'validators': []},
        }
        
class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'name']

class SetlistSerializer(serializers.ModelSerializer):
    artist = serializers.StringRelatedField()  # show artist name instead of id
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Setlist
        fields = ['id', 'artist', 'date', 'songs', 'setlistfm_id']

class TopSongSerializer(serializers.ModelSerializer):
    artist = serializers.StringRelatedField()

    class Meta:
        model = TopSong
        fields = ['id', 'artist', 'title', 'count', 'n_setlists', 'updated_at']

class ArtistDetailSerializer(serializers.ModelSerializer):
    setlists = SetlistSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = ('id', 'name', 'mbid', 'setlists')
