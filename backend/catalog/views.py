from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.admin.views.decorators import staff_member_required
from django.utils import timezone
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.db.models import Count
from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string

from .models import Category, Product, AboutPage, ContactPage, FooterSettings, ProductOffer, ContactMessage, SiteVisit
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


# -------- Admin Dashboard & Analytics ---------
@staff_member_required
def admin_dashboard_view(request):
    return render(request, 'admin/custom_dashboard.html')


@api_view(["GET"])  # ensure DRF negotiation for JSON
@permission_classes([IsAdminUser])
def analytics_stats(request):
    """
    Returns JSON for charts and widgets.
    Query params:
    - range: day|week|month (granularity for the line chart)
    - days: integer window size (default 30)
    """
    granularity = request.GET.get('range', 'day')
    days = int(request.GET.get('days', '30'))
    now = timezone.now()
    since = now - timezone.timedelta(days=days)

    # Line chart: ProductOffer count grouped by day/week/month
    if granularity == 'month':
        trunc = TruncMonth('created_at')
    elif granularity == 'week':
        trunc = TruncWeek('created_at')
    else:
        trunc = TruncDay('created_at')

    offers_qs = (
        ProductOffer.objects.filter(created_at__gte=since)
        .annotate(period=trunc)
        .values('period')
        .order_by('period')
        .annotate(count=Count('id'))
    )
    # Build continuous series with zeros
    from datetime import date
    def daterange(start, end, step='day'):
        cur = start
        while cur <= end:
            yield cur
            if step == 'month':
                # increment month
                y = cur.year + (cur.month // 12)
                m = 1 if cur.month == 12 else cur.month + 1
                cur = cur.replace(year=y, month=m, day=1)
            elif step == 'week':
                cur = cur + timezone.timedelta(weeks=1)
            else:
                cur = cur + timezone.timedelta(days=1)

    counts_map = { (o['period'].date() if hasattr(o['period'], 'date') else o['period']): o['count'] for o in offers_qs }
    step = 'day' if granularity == 'day' else ('week' if granularity == 'week' else 'month')
    start_boundary = since.date().replace(day=1) if step == 'month' else since.date()
    end_boundary = now.date()
    line_labels = []
    line_values = []
    for d in daterange(start_boundary, end_boundary, step):
        key = d
        line_labels.append(d.isoformat())
        line_values.append(int(counts_map.get(key, 0)))

    # Pie chart: by category
    by_category = (
        ProductOffer.objects.filter(created_at__gte=since)
        .values('product__category__name')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    pie_labels = [r['product__category__name'] or 'Digər' for r in by_category]
    pie_values = [r['count'] for r in by_category]

    # Widgets last 90 days
    last90 = now - timezone.timedelta(days=90)
    total_offers_90 = ProductOffer.objects.filter(created_at__gte=last90).count()
    total_contacts_90 = ContactMessage.objects.filter(created_at__gte=last90).count()
    total_visits_90 = SiteVisit.objects.filter(date__gte=last90.date()).count()

    # Recent offers (last 7 days)
    last7 = now - timezone.timedelta(days=7)
    recent_offers = list(
        ProductOffer.objects.filter(created_at__gte=last7)
        .select_related('product__category')
        .values('id', 'first_name', 'last_name', 'product__name', 'quantity', 'status', 'created_at')
        .order_by('-created_at')[:100]
    )

    # Status counts for tabs (based on last 7 days)
    status_counts_qs = (
        ProductOffer.objects.filter(created_at__gte=last7)
        .values('status')
        .annotate(count=Count('id'))
    )
    status_counts = {r['status']: r['count'] for r in status_counts_qs}
    status_counts['all'] = sum(status_counts.values())

    return Response({
        'line': {'labels': line_labels, 'values': line_values},
        'pie': {'labels': pie_labels, 'values': pie_values},
        'widgets': {
            'offers_90': total_offers_90,
            'contacts_90': total_contacts_90,
            'visits_90': total_visits_90,
        },
    'recent_offers': recent_offers,
    'status_counts': status_counts,
    })


@staff_member_required
def analytics_export_pdf(request):
    """Render analytics as PDF.
    Prefers WeasyPrint; falls back to ReportLab if system libs are missing.
    """
    import base64, io, os

    # Gather data (reuse analytics endpoint logic)
    data = analytics_stats(request).data

    line_img = request.POST.get('line_image', '')
    pie_img = request.POST.get('pie_image', '')

    # Preferred: WeasyPrint (HTML/CSS fidelity)
    try:
        from weasyprint import HTML  # type: ignore
        context = {
            'generated_at': timezone.now(),
            'line': data['line'],
            'pie': data['pie'],
            'widgets': data['widgets'],
            'recent_offers': data['recent_offers'],
            'line_image': line_img,
            'pie_image': pie_img,
        }
        html = render_to_string('admin/analytics_pdf.html', context)
        pdf = HTML(string=html, base_url=request.build_absolute_uri('/')).write_pdf()
        resp = HttpResponse(pdf, content_type='application/pdf')
        resp['Content-Disposition'] = 'attachment; filename="analytics.pdf"'
        return resp
    except Exception:
        # Fallback: ReportLab (pure Python)
        try:
            from django.conf import settings
            from reportlab.lib.pagesizes import A4
            from reportlab.lib import colors
            from reportlab.lib.units import cm
            from reportlab.platypus import (
                SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
            )
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.ttfonts import TTFont

            buf = io.BytesIO()
            doc = SimpleDocTemplate(
                buf,
                pagesize=A4,
                title="Analytics",
                leftMargin=1.5*cm,
                rightMargin=1.5*cm,
                topMargin=1.2*cm,
                bottomMargin=1.2*cm,
            )
            styles = getSampleStyleSheet()

            # Optional: register a Unicode font (Azerbaijani/Turkish glyphs)
            font_registered = False
            registered_font_name = 'Helvetica'
            try:
                font_candidates = [
                    os.path.join(settings.BASE_DIR, 'static', 'fonts', 'DejaVuSans.ttf'),
                    os.path.join(settings.BASE_DIR, 'static', 'fonts', 'NotoSans-Regular.ttf'),
                    '/Library/Fonts/Arial Unicode.ttf',
                    '/Library/Fonts/Arial Unicode MS.ttf',
                    '/System/Library/Fonts/Supplemental/NotoSans-Regular.ttf',
                ]
                found_path = next((p for p in font_candidates if os.path.exists(p)), None)
                if found_path:
                    registered_font_name = 'CustomUnicode'
                    pdfmetrics.registerFont(TTFont(registered_font_name, found_path))
                    styles['Normal'].fontName = registered_font_name
                    styles['Title'].fontName = registered_font_name
                    font_registered = True
            except Exception:
                # Ignore and fall back to Helvetica (may miss some glyphs)
                pass

            styles['Title'].fontSize = 20
            styles['Normal'].fontSize = 10

            story = []
            story.append(Paragraph("Depod Analytics", styles['Title']))
            story.append(Paragraph(timezone.now().strftime('%Y-%m-%d %H:%M'), styles['Normal']))
            story.append(Spacer(1, 0.6*cm))

            w = data.get('widgets', {})
            story.append(Paragraph(
                f"Son 90 gün: Təkliflər: <b>{w.get('offers_90',0)}</b> · "
                f"Mesajlar: <b>{w.get('contacts_90',0)}</b> · "
                f"Ziyarətlər: <b>{w.get('visits_90',0)}</b>",
                styles['Normal']
            ))
            story.append(Spacer(1, 0.5*cm))

            # Charts (if provided)
            def add_data_url_image(data_url: str, width_cm: float):
                if not data_url:
                    return
                try:
                    b64 = data_url.split(',', 1)[1] if ',' in data_url else data_url
                    img_bytes = base64.b64decode(b64)
                    bio = io.BytesIO(img_bytes)
                    img = Image(bio)
                    # Preserve aspect ratio
                    ratio = float(getattr(img, 'imageHeight', 1)) / float(getattr(img, 'imageWidth', 1) or 1)
                    img.drawWidth = width_cm
                    img.drawHeight = width_cm * ratio
                    story.append(img)
                    story.append(Spacer(1, 0.5*cm))
                except Exception:
                    pass

            add_data_url_image(line_img, 17*cm)
            add_data_url_image(pie_img, 12*cm)

            # Recent offers table (top 30)
            rec = data.get('recent_offers', [])[:30]
            # If empty, broaden the window to selected 'days' or 30 days to avoid empty PDF tables
            if not rec:
                try:
                    fallback_days = int(request.POST.get('recent_days') or request.POST.get('days') or 30)
                except Exception:
                    fallback_days = 30
                since_fb = timezone.now() - timezone.timedelta(days=fallback_days)
                rec = list(
                    ProductOffer.objects.filter(created_at__gte=since_fb)
                    .values('id', 'first_name', 'last_name', 'product__name', 'quantity', 'status', 'created_at')
                    .order_by('-created_at')[:30]
                )
            table_data = [["ID", "Müştəri", "Məhsul", "Miqdar", "Status", "Tarix"]]
            for r in rec:
                created = r.get('created_at','')
                # Format date as YYYY-MM-DD only
                if hasattr(created, 'date'):
                    created_str = created.date().isoformat()
                else:
                    created_str = str(created)[:10]
                table_data.append([
                    r.get('id',''),
                    f"{r.get('first_name','')} {r.get('last_name','')}",
                    r.get('product__name','') or '',
                    r.get('quantity',''),
                    r.get('status',''),
                    created_str,
                ])

            if len(table_data) == 1:
                table_data.append(["—","—","—","—","—","—"])

            col_widths = [1.5*cm, 3.5*cm, 4.5*cm, 1.8*cm, 2.5*cm, 3.0*cm]
            tbl = Table(table_data, colWidths=col_widths, repeatRows=1)
            header_font = registered_font_name if font_registered else 'Helvetica-Bold'
            body_font = registered_font_name if font_registered else 'Helvetica'
            tbl.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f0f0')),
                ('TEXTCOLOR',(0,0),(-1,0), colors.black),
                ('FONTNAME',(0,0),(-1,0), header_font),
                ('FONTSIZE',(0,0),(-1,0),10),
                ('ALIGN',(0,0),(-1,0),'LEFT'),
                ('FONTNAME',(0,1),(-1,-1), body_font),
                ('FONTSIZE',(0,1),(-1,-1),9),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#fafafa')]),
                ('INNERGRID',(0,0),(-1,-1),0.25,colors.grey),
                ('BOX',(0,0),(-1,-1),0.25,colors.grey),
                ('VALIGN',(0,0),(-1,-1),'TOP'),
            ]))
            story.append(tbl)

            doc.build(story)
            pdf_bytes = buf.getvalue()
            buf.close()
            resp = HttpResponse(pdf_bytes, content_type='application/pdf')
            resp['Content-Disposition'] = 'attachment; filename="analytics.pdf"'
            return resp
        except Exception:
            return HttpResponse(
                "PDF export hazır deyil: WeasyPrint sistem asılılıqları quraşdırılmayıb və ReportLab da mövcud deyil.",
                status=503,
            )
