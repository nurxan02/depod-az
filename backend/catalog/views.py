from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Category, Product, AboutPage, ContactPage, FooterSettings, ProductOffer, ContactMessage
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    AboutPageSerializer,
    ContactPageSerializer,
    FooterSettingsSerializer,
    ProductOfferSerializer,
    ContactMessageSerializer,
)
# AboutPage API viewset
from rest_framework import viewsets
class AboutPageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AboutPageSerializer

    def get_queryset(self):
        qs = AboutPage.objects.all()
        # Prefer active page only
        active_qs = qs.filter(is_active=True)
        if active_qs.exists():
            return active_qs
        # Fallback to first one if none marked active
        return qs[:1]


class ContactPageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContactPageSerializer

    def get_queryset(self):
        qs = ContactPage.objects.all()
        active = qs.filter(is_active=True)
        if active.exists():
            return active
        return qs[:1]


class FooterSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FooterSettingsSerializer

    def get_queryset(self):
        qs = FooterSettings.objects.all()
        active = qs.filter(is_active=True)
        if active.exists():
            return active
        return qs[:1]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    lookup_field = 'key'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related(
        'images', 'features', 'specs', 'highlights'
    )
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'id']
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__key=category)
        return qs

    @action(detail=False, methods=['get'], url_path='by-category/(?P<category>[^/.]+)')
    def by_category(self, request, category=None):
        qs = self.get_queryset().filter(category__key=category)
        page = self.paginate_queryset(qs)
        serializer = ProductListSerializer(page or qs, many=True, context={'request': request})
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class ProductOfferViewSet(viewsets.ModelViewSet):
    queryset = ProductOffer.objects.all()
    serializer_class = ProductOfferSerializer
    http_method_names = ['post']  # Yalnız POST metoduna icazə verir
    authentication_classes = []  # No Session auth -> no CSRF required
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Yeni məhsul təklifi yaradır"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Təklifiniz uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        """Təklifi yadda saxlayarkən əlavə məlumatlar əlavə edir"""
        serializer.save()


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    http_method_names = ["post"]
    authentication_classes = []  # No Session auth -> no CSRF required
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "success": True,
                "message": "Mesajınız uğurla göndərildi.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def perform_create(self, serializer):
        serializer.save()
