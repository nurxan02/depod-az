import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram_message(text: str) -> bool:
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
    chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', '')
    if not token or not chat_id or not text:
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.ok:
            return True
        logger.warning("Telegram send failed: %s %s", resp.status_code, resp.text)
    except Exception as ex:
        logger.exception("Telegram send exception: %s", ex)
    return False
