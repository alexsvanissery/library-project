from rest_framework import serializers
from .models import Library, Cart, CartItem, Order, OrderItem


class LibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    book_name = serializers.ReadOnlyField(source="book.name")
    book_price = serializers.ReadOnlyField(source="book.price")
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "book",
            "book_name",
            "book_price",
            "quantity",
            "total_price",
        ]

    def get_total_price(self, obj):
        return obj.get_total_price()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id",
            "created_at",
            "items",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    book_name = serializers.ReadOnlyField(source="book.name")

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "book",
            "book_name",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "name",
            "email",
            "address",
            "total_price",
            "status",
            "created_at",
            "items",
        ]