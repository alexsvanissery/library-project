from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
]

# ALWAYS serve media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
