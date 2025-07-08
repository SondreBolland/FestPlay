import os
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request, post
from django.shortcuts import render, redirect
from pathlib import Path
from .util import *
from api.models import TopSong

from dotenv import load_dotenv
load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")

SPOTIFY_BASE_URL = 'https://accounts.spotify.com'

class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'playlist-modify-public playlist-modify-private'
        
        url = Request('GET', f'{SPOTIFY_BASE_URL}/authorize', params = {
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': SPOTIPY_REDIRECT_URI,
            'client_id': SPOTIPY_CLIENT_ID
        }).prepare().url
        print("Redirect URI used:", url['redirect_uri'])
        return Response({'url': url}, status=status.HTTP_200_OK)
        
def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    response = post(f'{SPOTIFY_BASE_URL}/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': SPOTIPY_REDIRECT_URI,
        'client_id': SPOTIPY_CLIENT_ID,
        'client_secret': SPOTIPY_CLIENT_SECRET
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')
    
    if not request.session.exists(request.session.session_key):
        request.session.create()
    
    session_id = request.session.session_key
    update_or_create_user_tokens(session_id, access_token=access_token, token_type=token_type, refresh_token=refresh_token, expires_in=expires_in)
    
    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class GenerateSpotifyPlaylistView(APIView):
    def post(self, request):
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key

        if not is_spotify_authenticated(session_key):
            return Response({'error': 'User not authenticated with Spotify'}, status=status.HTTP_403_FORBIDDEN)

        playlist_name = request.data.get("playlist_name")
        songs_per_artist = int(request.data.get("songs_per_artist"))
        selected_artist_ids = request.data.get("selected_artists")

        if not selected_artist_ids:
            return Response({'error': 'No artists selected'}, status=status.HTTP_400_BAD_REQUEST)

        songs_and_artists = []
        for artist_id in selected_artist_ids:
            top_songs = (
                TopSong.objects.filter(artist__id=artist_id)
                .select_related("artist")
                .order_by("-count")[:songs_per_artist]
            )
            for song in top_songs:
                songs_and_artists.append((song.title, song.artist.name))

        if not songs_and_artists:
            return Response({'error': 'No songs found for selected artists'}, status=status.HTTP_404_NOT_FOUND)

        playlist_url, missing_tracks, add_tracks = create_spotify_playlist_from_songs(
            session_id=session_key,
            playlist_name=playlist_name,
            songs_and_artists=songs_and_artists
        )
        
        if playlist_url:
            return Response({'playlist_url': playlist_url, 'missing_tracks': missing_tracks}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Failed to create playlist'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)      