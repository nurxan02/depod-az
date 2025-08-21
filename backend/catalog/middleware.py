from django.utils import timezone
from .models import SiteVisit


class SiteVisitMiddleware:
    """Records one SiteVisit per session per day. Skips /admin and /static."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
    # Switched to explicit per-tab tracking via /api/visit/track/.
    # Avoid creating sessions on GET to prevent over-counting on refresh.
        return self.get_response(request)
