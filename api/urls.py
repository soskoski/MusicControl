from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom,Leave

urlpatterns = [
    path('home', RoomView.as_view()),
    path('createRoom',CreateRoomView.as_view()),
    path('getRoom',GetRoom.as_view()),
    path('joinRoom',JoinRoom.as_view()),
    path('UserInRoom',UserInRoom.as_view()),
    path('Leave',Leave.as_view()),

]
