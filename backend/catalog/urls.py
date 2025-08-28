from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    CategoryViewSet,
    ProductViewSet,
    AboutPageViewSet,
    ContactPageViewSet,
    FooterSettingsViewSet,
    ProductOfferViewSet,
    ContactMessageViewSet,
    admin_dashboard_view,
    analytics_stats,
    analytics_export_pdf,
    track_site_visit,
    visit_debug,
    seed_demo,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'about', AboutPageViewSet, basename='about')
router.register(r'contact', ContactPageViewSet, basename='contact')
router.register(r'footer', FooterSettingsViewSet, basename='footer')
router.register(r'offers', ProductOfferViewSet, basename='offer')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', include(router.urls)),
    # Demo seed (DEV only)
    path('seed/demo/', seed_demo, name='seed_demo'),
    # Custom dashboard (avoid /admin prefix to prevent collision with AdminSite)
    path('dashboard/', admin_dashboard_view, name='admin_dashboard'),
    # Analytics endpoints
    path('dashboard/analytics/stats/', analytics_stats, name='admin_analytics_stats'),
    path('dashboard/analytics/export-pdf/', analytics_export_pdf, name='admin_analytics_export_pdf'),
    # Site visit tracking (per tab/day)
    path('visit/track/', track_site_visit, name='track_site_visit'),
    path('visit/debug/', visit_debug, name='visit_debug'),
]
