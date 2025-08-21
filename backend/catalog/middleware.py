from django.utils import timezone
from .models import SiteVisit


class SiteVisitMiddleware:
    """Records one SiteVisit per session per day. Skips /admin and /static."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            path = request.path or ''
            if request.method == 'GET' and not path.startswith('/static/') and not path.startswith('/admin/'):
                if not request.session.session_key:
                    request.session.save()  # ensure we have a key
                session_key = request.session.session_key
                today = timezone.localdate()
                SiteVisit.objects.get_or_create(date=today, session_key=session_key)
        except Exception:
            # Never block the request due to analytics
            pass
        return self.get_response(request)
