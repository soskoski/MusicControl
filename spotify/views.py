from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from django.http import JsonResponse, HttpResponseRedirect
from api.models import Room



class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)
    

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error:
        return JsonResponse({'error': error}, status=400)

    if not code:
        return JsonResponse({'error': 'Authorization code was not provided'}, status=400)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    print("Spotify API response:", response)

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    spotify_user_id = response.get("id")

    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token', 'details' : response}, status=400)

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')

class isAuthenticated(APIView):
    def get(self, request, format=None):
        session_key = self.request.session.session_key
        if session_key is None:
            return Response({'status': False}, status=status.HTTP_200_OK)

        is_authenticated = is_spotify_authenticated(session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
    
# def reauthorize_user(request):
#     session_id = request.session.session_key

#     if not session_id:
#         request.session.create()

#     tokens = get_user_tokens(session_id)
#     if tokens:
#         tokens.delete()

#     scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
#     url = f"https://accounts.spotify.com/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={scopes}"

#     return redirect(url)

class currentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        print(response)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""
        artists = item.get('artists')

        for i, artist in enumerate(artists):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id,
        }

        return Response(song, status=status.HTTP_200_OK)
        
class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guess_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guess_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)
    

class ClearTokens(APIView):
    def deleteTokens(self, request, format=None):
        print("HTTP Method:", request.method)
        session_id = request.session.session_key

        if session_id:
            clear_tokens(session_id)
            return Response({'message': f"Token cleared for session: {session_id}"}, status=status.HTTP_200_OK)
        
        else:
            return Response({'error': "No session id found"}, status=status.HTTP_400_BAD_REQUEST)
