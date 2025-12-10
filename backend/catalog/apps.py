from django.apps import AppConfig


class CatalogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'catalog'
    verbose_name = 'Catalog'

    def ready(self):
        # Import signals so handlers get registered
        try:
            import catalog.signals  # noqa: F401
        except Exception:
            # Avoid breaking startup if migrations are running before models exist
            pass
