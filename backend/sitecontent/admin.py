from django.contrib import admin
from catalog.models import AboutPage, ContactPage, FooterSettings


# Proxy models to group under "Site personalisation"
class AboutPageProxy(AboutPage):
    class Meta:
        proxy = True
        verbose_name = "Haqqında Səhifəsi"
        verbose_name_plural = "Haqqında Səhifəsi"
        app_label = 'sitecontent'


class ContactPageProxy(ContactPage):
    class Meta:
        proxy = True
        verbose_name = "Əlaqə Səhifəsi"
        verbose_name_plural = "Əlaqə Səhifəsi"
        app_label = 'sitecontent'


class FooterSettingsProxy(FooterSettings):
    class Meta:
        proxy = True
        verbose_name = "Footer Hissəsi"
        verbose_name_plural = "Footer Hissəsi"
        app_label = 'sitecontent'


# Reuse existing ModelAdmin classes from catalog
from catalog.admin import (
    AboutPageAdmin as BaseAboutAdmin,
    ContactPageAdmin as BaseContactAdmin,
    FooterSettingsAdmin as BaseFooterAdmin,
)


@admin.register(AboutPageProxy)
class AboutPageAdmin(BaseAboutAdmin):
    pass


@admin.register(ContactPageProxy)
class ContactPageAdmin(BaseContactAdmin):
    pass


@admin.register(FooterSettingsProxy)
class FooterSettingsAdmin(BaseFooterAdmin):
    pass
