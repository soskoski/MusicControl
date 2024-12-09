from .models import SpotifyTokens
from django.utils import timezone
from datetime import timedelta
from requests import post
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyTokens.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = expires_in or 3600
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyTokens(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
            print("Token refreshed for session:", session_id)
        print("User is authenticated for session:", session_id)

        # response = execute_spotify_api_request(session_id, "")
        # if "id" in response:
        #     spotify_user_id = response["id"]
        #     if spotify_user_id != tokens.user:
        #         print("Spotify account mismatch, Reauthorizing...")
        #         return False

        return True
    print("User is not authenticated for session:", session_id)
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type':'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in', 3600)
    # refresh_token = response.get('refresh_token', refresh_token)

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}
    
    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, {}, headers=headers)

    print("Spotify API response status:", response.status_code)
    print("Spotify API response body:", response.json())

    if response.status_code == 401:
        print("access token expired")
        refresh_spotify_token(session_id)
        tokens = get_user_tokens(session_id)
        headers['Authorization'] = "Bearer" + tokens.access_token

    
    if response.status_code == 200 or response.status_code == 204:
        return response.json()
    else:
       
        return {'Error': 'Issue with request, status code: ' + str(response.status_code)}


    
def play_song(session_id):
    print("Attempting to pause song for session:", session_id)
    response = execute_spotify_api_request(session_id, "player/play", put_=True)
    print("Spotify response: ", response) 

def pause_song(session_id):
    print("Attempting to pause song for session:", session_id)
    response = execute_spotify_api_request(session_id, "player/pause", put_=True)
    print("Spotify response", response)
    
    