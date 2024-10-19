from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom

urlpatterns = [
    path('home', RoomView.as_view()),
    path('createRoom',CreateRoomView.as_view()),
    path('getRoom',GetRoom.as_view())
]
