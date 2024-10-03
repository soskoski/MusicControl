from django.urls import path
from .views import RoomView, CreateRoomView

urlpatterns = [
    path('home', RoomView.as_view()),
    path('createRoom',CreateRoomView.as_view())
]
