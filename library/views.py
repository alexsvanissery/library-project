from math import expm1

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Library
from .serializer import LibrarySerializer
from rest_framework.permissions import AllowAny

class LibraryAPI(APIView):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = [AllowAny]

    def get(self,request,id=None):
        if id:
            try:
                item=Library.objects.get(id=id)
                serializer=LibrarySerializer(item)
                return Response(serializer.data)
            except Library.DoesNotExist:
                return Response(
                    {"error":"item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            item=Library.objects.all()
            serializer=LibrarySerializer(item,many=True)
            return Response(serializer.data)

    def post(self,request):
        serializer=LibrarySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.error,
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self,request,id):
        try:
            item=Library.objects.get(id=id)
        except Library.DoesNotExist:
            return Response(
                {"error":"Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=LibrarySerializer(item,data=request.data)

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
