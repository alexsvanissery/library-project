from django.urls import path
from .views import LibraryAPI

urlpatterns = [
    path('library/', LibraryAPI.as_view()),
    path('library/<int:id>/', LibraryAPI.as_view()),
]
