from django.urls import path

from .views import (
    LibraryAPI,
    CartAPI,
    CartItemAPI,
    OrderAPI,
    AdminLoginAPI,
)


urlpatterns = [

    # Admin Login
    path('admin-login/', AdminLoginAPI.as_view()),

    # Library
    path('library/', LibraryAPI.as_view()),
    path('library/<int:id>/', LibraryAPI.as_view()),

    # Cart
    path('cart/', CartAPI.as_view()),
    path('cart/item/<int:id>/', CartItemAPI.as_view()),

    # Orders
    path('orders/', OrderAPI.as_view()),
]