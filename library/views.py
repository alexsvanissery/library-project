from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.authtoken.models import Token

from .models import Library, Cart, CartItem, Order, OrderItem

from .serializer import (
    LibrarySerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
)

class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):

        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )

class AdminLoginAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {"error": "You do not have admin access"},
                status=status.HTTP_403_FORBIDDEN
            )

        token, created = Token.objects.get_or_create(
            user=user
        )

        return Response({
            "token": token.key,
            "username": user.username,
            "is_staff": user.is_staff
        })
# =========================
# LIBRARY API
# =========================

class LibraryAPI(APIView):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, id=None):
        if id:
            try:
                item = Library.objects.get(id=id)
                serializer = LibrarySerializer(item)
                return Response(serializer.data)

            except Library.DoesNotExist:
                return Response(
                    {"error": "item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            item = Library.objects.all()
            serializer = LibrarySerializer(item, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = LibrarySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self, request, id):
        try:
            item = Library.objects.get(id=id)

        except Library.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = LibrarySerializer(
            item,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, id):
        try:
            item = Library.objects.get(id=id)
            item.delete()

            return Response(
                {"message": "Item deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )

        except Library.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =========================
# CART API
# =========================

class CartAPI(APIView):
    permission_classes = [AllowAny]

    def get_cart(self):
        cart = Cart.objects.first()

        if not cart:
            cart = Cart.objects.create()

        return cart

    # GET CART
    def get(self, request):
        cart = self.get_cart()

        serializer = CartSerializer(cart)

        return Response(serializer.data)

    # ADD BOOK TO CART
    def post(self, request):

        book_id = request.data.get("book")
        quantity = int(request.data.get("quantity", 1))

        if not book_id:
            return Response(
                {"error": "Book ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            book = Library.objects.get(id=book_id)

        except Library.DoesNotExist:
            return Response(
                {"error": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart = self.get_cart()

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            book=book
        )

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity

        cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# =========================
# CART ITEM API
# =========================

class CartItemAPI(APIView):
    permission_classes = [AllowAny]

    # UPDATE QUANTITY
    def put(self, request, id):

        try:
            cart_item = CartItem.objects.get(id=id)

        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        quantity = int(quantity)

        if quantity <= 0:
            cart_item.delete()

            return Response(
                {"message": "Item removed from cart"}
            )

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data)

    # REMOVE ITEM FROM CART
    def delete(self, request, id):

        try:
            cart_item = CartItem.objects.get(id=id)

        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()

        return Response(
            {"message": "Item removed from cart"},
            status=status.HTTP_204_NO_CONTENT
        )


# =========================
# ORDER API
# =========================

class OrderAPI(APIView):
    permission_classes = [AllowAny]

    # PLACE ORDER
    def post(self, request):

        name = request.data.get("name")
        email = request.data.get("email")
        address = request.data.get("address")
        book_id = request.data.get("book_id")

        if not name or not email or not address:
            return Response(
                {
                    "error": "Name, email and address are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ==========================================
        # BUY NOW - DIRECT PURCHASE
        # ==========================================

        if book_id:

            try:
                book = Library.objects.get(id=book_id)

            except Library.DoesNotExist:
                return Response(
                    {"error": "Book not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            total_price = book.price

            # Create order
            order = Order.objects.create(
                name=name,
                email=email,
                address=address,
                total_price=total_price,
                status="Placed"
            )

            # Create order item
            OrderItem.objects.create(
                order=order,
                book=book,
                quantity=1,
                price=book.price
            )

            serializer = OrderSerializer(order)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        # ==========================================
        # NORMAL CART CHECKOUT
        # ==========================================

        cart = Cart.objects.first()

        if not cart:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = CartItem.objects.filter(
            cart=cart
        ).select_related("book")

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total
        total_price = 0

        for item in cart_items:
            total_price += item.book.price * item.quantity

        # Create order
        order = Order.objects.create(
            name=name,
            email=email,
            address=address,
            total_price=total_price,
            status="Placed"
        )

        # Copy cart items into order items
        for item in cart_items:

            OrderItem.objects.create(
                order=order,
                book=item.book,
                quantity=item.quantity,
                price=item.book.price
            )

        # Clear cart
        cart_items.delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    # GET ALL ORDERS
    def get(self, request):

        orders = Order.objects.all().order_by("-created_at")

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)