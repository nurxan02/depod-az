from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import ProductOffer, ContactMessage
from .notifiers import send_telegram_message


def _admin_emails():
    # Prefer Django ADMINS setting if present
    admins = getattr(settings, 'ADMINS', None) or []
    if admins:
        return [e for _, e in admins]
    # Fallback to a single address from env or settings
    addr = getattr(settings, 'DEFAULT_NOTIFY_EMAIL', None) or getattr(settings, 'SERVER_EMAIL', None)
    if addr:
        return [addr]
    return []


@receiver(post_save, sender=ProductOffer)
def notify_new_product_offer(sender, instance: ProductOffer, created, **kwargs):
    if not created:
        return
    recipients = _admin_emails()
    if not recipients:
        return
    subject = "Yeni Məhsul Təklifi"
    base = getattr(settings, 'ADMIN_BASE_URL', '').rstrip('/')
    context = {
        "subject": subject,
        "offer": {
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "phone_number": instance.phone_number,
            "email": instance.email,
            "city_display": instance.get_city_display(),
            "product_name": instance.product.name,
            "quantity": instance.quantity,
            "offer_text": instance.offer_text,
            "created_at": instance.created_at.strftime('%Y-%m-%d %H:%M'),
        },
    "admin_url": f"{base}/admin/catalog/productoffer/{instance.id}/change/" if base else f"/admin/catalog/productoffer/{instance.id}/change/",
        "year": getattr(settings, 'CURRENT_YEAR', None),
    }
    text_body = (
        f"Müştəri: {instance.first_name} {instance.last_name}\n"
        f"Telefon: {instance.phone_number}\n"
        f"Email: {instance.email or '-'}\n"
        f"Şəhər: {instance.get_city_display()}\n"
        f"Məhsul: {instance.product.name}\n"
        f"Miqdar: {instance.quantity}\n"
        f"Mətn: {instance.offer_text or '-'}\n"
        f"Tarix: {instance.created_at:%Y-%m-%d %H:%M}\n"
    )
    html_body = render_to_string("email/product_offer.html", context)
    try:
        msg = EmailMultiAlternatives(subject, text_body, settings.SERVER_EMAIL, recipients)
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=True)
    except Exception:
        pass
    # Telegram notification
    try:
        send_telegram_message(
            (
                f"<b>Yeni Məhsul Təklifi</b>\n"
                f"Müştəri: {instance.first_name} {instance.last_name}\n"
                f"Telefon: {instance.phone_number or '-'}\n"
                f"Şəhər: {instance.get_city_display() or '-'}\n"
                f"Məhsul: {instance.product.name or '-'} — Miqdar: {instance.quantity or '-'}"
                f"\nMətn: {instance.offer_text or '-'}\n"
            )
        )
    except Exception:
        pass


@receiver(post_save, sender=ContactMessage)
def notify_new_contact_message(sender, instance: ContactMessage, created, **kwargs):
    if not created:
        return
    recipients = _admin_emails()
    if not recipients:
        return
    subject = "Yeni Əlaqə Mesajı"
    base = getattr(settings, 'ADMIN_BASE_URL', '').rstrip('/')
    context = {
        "subject": subject,
        "msg": {
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "email": instance.email,
            "phone": instance.phone,
            "subject_display": instance.get_subject_display(),
            "message": instance.message,
            "created_at": instance.created_at.strftime('%Y-%m-%d %H:%M'),
        },
    "admin_url": f"{base}/admin/catalog/contactmessage/{instance.id}/change/" if base else f"/admin/catalog/contactmessage/{instance.id}/change/",
        "year": getattr(settings, 'CURRENT_YEAR', None),
    }
    text_body = (
        f"Müştəri: {instance.first_name} {instance.last_name}\n"
        f"Email: {instance.email}\n"
        f"Telefon: {instance.phone or '-'}\n"
        f"Mövzu: {instance.get_subject_display()}\n\n"
        f"Mesaj:\n{instance.message}\n\n"
        f"Tarix: {instance.created_at:%Y-%m-%d %H:%M}\n"
    )
    html_body = render_to_string("email/contact_message.html", context)
    try:
        msg = EmailMultiAlternatives(subject, text_body, settings.SERVER_EMAIL, recipients)
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=True)
    except Exception:
        pass
    # Telegram notification
    try:
        send_telegram_message(
            (
                f"<b>Yeni Əlaqə Mesajı</b>\n"
                f"Müştəri: {instance.first_name or '-'} {instance.last_name or '-'}\n"
                f"Email: {instance.email or '-'}\n"
                f"Telefon: {instance.phone or '-'}\n"
                f"Mövzu: {instance.get_subject_display() or '-'}\n"
                f"Mesaj: {instance.message or '-'}\n"
            )
        )
    except Exception:
        pass
