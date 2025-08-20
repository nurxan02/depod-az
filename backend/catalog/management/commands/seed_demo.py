from django.core.management.base import BaseCommand
from catalog.models import Category


class Command(BaseCommand):
    help = "Seed demo categories (minimal)"

    def handle(self, *args, **options):
        cats = {
            'earphone': 'Qulaqlıqlar',
            'powerbank': 'Powerbank',
            'car-charger': 'Avtomobil aksesuarları',
            'charger': 'Şarj Cihazı',
        }
        for key, name in cats.items():
            Category.objects.get_or_create(key=key, defaults={'name': name})
        self.stdout.write(self.style.SUCCESS('Seeded categories'))
