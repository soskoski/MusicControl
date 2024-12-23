from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', isAuthenticated.as_view()),
    path('current-song', currentSong.as_view()),
    path('play', PlaySong.as_view()),
    path('pause', PauseSong.as_view()),
    path('revoke-token', RevokeSpotifyToken.as_view()),
    path('skip', SkipSong.as_view()),
    path('previous', SkipPreviousSong.as_view()),
]