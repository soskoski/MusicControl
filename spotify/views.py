# from django.shortcuts import render, redirect
# from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
# from rest_framework.views import APIView
# from requests import Request, post
# from rest_framework import status
# from rest_framework.response import Response
# from .util import update_or_create_user_tokens, is_spotify_authenticated

# class AuthURL(APIView):
#     def get(self, request, format=None):
#         scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

#         url = Request('GET', 'https://accounts.spotify.com/authorize', params={
#             'scope' : scopes,
#             'response_type' : 'code',
#             'redirect_uri' : REDIRECT_URI,
#             'client_id' : CLIENT_ID
#         }).prepare().url

#         return Response({'url' : url}, status=status.HTTP_200_OK)
    
# def spotify_callback(request, format=None):
#     code = request.GET.get('code')
#     error = request.GET.get('error')

#     if not code:
#         return Response({'error': 'Authorization code was not provided'}, status=status.HTTP_400_BAD_REQUEST)

#     response = post('https://accounts.spotify.com/api/token', data={
#         'grant_type': 'authorization_code',
#         'code': code,
#         'redirect_uri': REDIRECT_URI,
#         'client_id': CLIENT_ID,
#         'client_secret': CLIENT_SECRET
#     }).json()

#     access_token = response.get('access_token')
#     token_type = response.get('token_type')
#     refresh_token = response.get('refresh_token')
#     expires_in = response.get('expires_in')
#     error = response.get('error')

#     if not request.session.exists(request.session.session_key):
#         request.session.create()

#     update_or_create_user_tokens(request.session.session_key, access_token,token_type,expires_in,refresh_token)

#     return redirect('frontend:')

# class isAuthenticated(APIView):
#     def get(self,request, format=None):
#         is_authenticated = is_spotify_authenticated(self.request.session.session_key)
#         return Response({'status': is_authenticated}, status=status.HTTP_200_OK)



from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated
from django.http import JsonResponse, HttpResponseRedirect

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

    # Check if the token request was successful
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token', 'details' : response}, status=400)

    # Ensure session key exists
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