from django.db import models
from django.db.models import Q
from django.utils.text import slugify


class Category(models.Model):
    key = models.SlugField(max_length=50, unique=True, help_text='Identifier used in frontend (e.g., earphone)')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name = 'Kateqoriya'
        verbose_name_plural = 'Kateqoriyalar'

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    id = models.SlugField(primary_key=True, max_length=100, editable=False, help_text='Auto-generated from name (e.g., peak-black)')
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    description = models.TextField(blank=True)
    # prices optional; keep nullable since current frontend hides price
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Məhsul"
        verbose_name_plural = "Məhsullar"
        ordering = ['name']

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        # Auto-generate slug id from name on create
        if not self.id:
            base = slugify(self.name)[:95].strip('-') or 'product'
            slug = base
            i = 2
            # Ensure uniqueness, respect max_length 100
            while type(self).objects.filter(pk=slug).exists():
                suffix = f"-{i}"
                slug = (base[: 100 - len(suffix)] + suffix).strip('-')
                i += 1
            self.id = slug
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class ProductSpec(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specs')
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class ProductHighlight(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='highlights')
    number = models.CharField(max_length=50)
    text = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


# Editable About Page model
class AboutPage(models.Model):
    title = models.CharField(max_length=200, default="Depod Haqqında")
    subtitle = models.CharField(max_length=300, blank=True)
    story = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=5)
    product_models = models.PositiveIntegerField(default=15)
    happy_customers = models.PositiveIntegerField(default=10000)
    quality_rating = models.CharField(max_length=10, default="99%")

    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)

    # Optional headings/descriptions
    values_title = models.CharField(max_length=150, blank=True, default="")
    team_description = models.TextField(blank=True, default="")

    # Legacy JSON fields (kept for backward compat, hidden in admin)
    values = models.JSONField(default=list, blank=True, editable=False, help_text="Deprecated: use AboutValue inlines")
    team = models.JSONField(default=list, blank=True, editable=False, help_text="Deprecated: use AboutTeamMember inlines")

    technology_title = models.CharField(max_length=200, default="Texnologiya və İnnovasiya")
    technology_text = models.TextField(blank=True)
    technology_features = models.JSONField(default=list, blank=True, editable=False, help_text="Deprecated: use AboutTechFeature inlines")
    technology_stats = models.JSONField(default=list, blank=True, editable=False, help_text="Deprecated: use AboutTechStat inlines")

    contact_title = models.CharField(max_length=200, default="Bizimlə Əlaqə Saxlayın")
    contact_text = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False, help_text="Saytda göstəriləcək aktiv səhifə")

    class Meta:
        verbose_name = "Haqqında Səhifəsi"
        verbose_name_plural = "Haqqında Səhifəsi"
        constraints = [
            # Ensure only one AboutPage can be active at a time
            models.UniqueConstraint(
                fields=["is_active"],
                condition=Q(is_active=True),
                name="uniq_active_aboutpage",
            )
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super_save = super().save
        # If setting this instance active, deactivate others first
        if self.is_active and self.pk:
            AboutPage.objects.exclude(pk=self.pk).update(is_active=False)
        super_save(*args, **kwargs)


# Structured content models for better admin UX
class AboutValue(models.Model):
    ICON_CHOICES = [
        ("fa-solid fa-gem", "Gem (Keyfiyyət)"),
        ("fas fa-rocket", "Rocket (İnnovasiya)"),
        ("fa-solid fa-handshake", "Handshake (Güvən)"),
        ("fas fa-bolt", "Bolt (Sürət)"),
        ("fa-solid fa-chevron-up", "Chevron Up (Davamlı İnkişaf)"),
        ("fa-solid fa-trophy", "Trophy (Mükəmməllik)"),
    ]
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='values_items')
    icon = models.CharField(max_length=100, choices=ICON_CHOICES, blank=True)
    title = models.CharField(max_length=100)
    text = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class AboutTeamMember(models.Model):
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='team_items')
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    detail = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class AboutTechFeature(models.Model):
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='feature_items')
    text = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class AboutTechStat(models.Model):
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='tech_stat_items')
    number = models.CharField(max_length=50)
    label = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class FooterSettings(models.Model):
    description = models.TextField(blank=True, default="Keyfiyyətli texnoloji məhsullar istehsalçısı. Yenilikçi həllər və etibarlı məhsullarla sizin xidmətinizdəyik.")
    email = models.CharField(max_length=100, blank=True, default="info@depod.az")
    phone = models.CharField(max_length=50, blank=True, default="+994 XX XXX XX XX")
    bottom_text = models.CharField(max_length=255, blank=True, default="© 2025 Depod. Bütün hüquqlar qorunur.")
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False, help_text="Saytda göstəriləcək aktiv footer")

    class Meta:
        verbose_name = "Footer Hissəsi"
        verbose_name_plural = "Footer Hissəsi"
        constraints = [
            models.UniqueConstraint(
                fields=["is_active"],
                condition=Q(is_active=True),
                name="uniq_active_footer",
            )
        ]

    def __str__(self):
        return f"Footer #{self.pk or 'new'}"

    def save(self, *args, **kwargs):
        super_save = super().save
        if self.is_active and self.pk:
            FooterSettings.objects.exclude(pk=self.pk).update(is_active=False)
        super_save(*args, **kwargs)


# Contact Page models
class ContactPage(models.Model):
    # Hero
    hero_title = models.CharField(max_length=200, default="Bizimlə Əlaqə Saxlayın")
    hero_subtitle = models.CharField(max_length=300, blank=True, default="Sizin suallarınız bizim üçün önəmlidir")

    # Contact info
    email_primary = models.CharField(max_length=150, blank=True, default="info@depod.az")
    email_secondary = models.CharField(max_length=150, blank=True, default="support@depod.az")
    phone_primary = models.CharField(max_length=50, blank=True, default="+994 12 XXX XX XX")
    phone_secondary = models.CharField(max_length=50, blank=True, default="+994 50 XXX XX XX")
    address_line1 = models.CharField(max_length=200, blank=True, default="Bakı şəhəri")
    address_line2 = models.CharField(max_length=200, blank=True, default="Azərbaycan")

    # Contact form copy
    form_title = models.CharField(max_length=200, default="Bizimlə Əlaqə Forma")
    form_text = models.TextField(blank=True, default="Suallarınızı, təklif və şikayətlərinizi bizə göndərin. Sizinlə qısa zamanda əlaqə saxlayacağıq.")

    # Sidebar support
    support_title = models.CharField(max_length=200, default="Sürətli Dəstək")
    support_text = models.TextField(blank=True, default="Təcili suallarınız üçün birbaşa bizim dəstək komandamızla əlaqə saxlayın.")
    support_phone = models.CharField(max_length=50, blank=True, default="+994 XX XXX XX XX")

    # Sidebar catalog teaser
    catalog_title = models.CharField(max_length=200, default="Məhsul Kataloqu")
    catalog_text = models.TextField(blank=True, default="Məhsullarımız haqqında ətraflı məlumat əldə edin.")
    catalog_link = models.CharField(max_length=300, blank=True, default="index.html#products")

    # Map section
    map_section_title = models.CharField(max_length=200, default="Məkanımız")
    map_heading = models.CharField(max_length=200, default="Depod Ofisi")
    map_address = models.CharField(max_length=300, default="Bakı şəhəri, Azərbaycan")
    map_button_text = models.CharField(max_length=100, default="Xəritədə Aç")
    map_url = models.CharField(max_length=500, blank=True, default="")

    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False, help_text="Saytda göstəriləcək aktiv əlaqə səhifəsi")

    class Meta:
        verbose_name = "Əlaqə Səhifəsi"
        verbose_name_plural = "Əlaqə Səhifəsi"
        constraints = [
            models.UniqueConstraint(
                fields=["is_active"],
                condition=Q(is_active=True),
                name="uniq_active_contactpage",
            )
        ]

    def __str__(self):
        return self.hero_title

    def save(self, *args, **kwargs):
        super_save = super().save
        if self.is_active and self.pk:
            ContactPage.objects.exclude(pk=self.pk).update(is_active=False)
        super_save(*args, **kwargs)


class ContactWorkingHour(models.Model):
    contact = models.ForeignKey(ContactPage, on_delete=models.CASCADE, related_name='working_hours')
    label = models.CharField(max_length=100)  # e.g., "Bazar ertəsi - Cümə"
    time = models.CharField(max_length=100)   # e.g., "09:00 - 18:00"
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class ContactFAQ(models.Model):
    contact = models.ForeignKey(ContactPage, on_delete=models.CASCADE, related_name='faqs')
    question = models.CharField(max_length=200)
    answer = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class ProductOffer(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Gözləyir'),
        ('reviewed', 'Baxılıb'),
        ('accepted', 'Qəbul edilib'),
        ('rejected', 'Rədd edilib'),
    ]
    
    AZERBAIJAN_CITIES = [
        ('baku', 'Bakı'),
        ('ganja', 'Gəncə'),
        ('sumqayit', 'Sumqayıt'),
        ('mingachevir', 'Mingəçevir'),
        ('quba', 'Quba'),
        ('lankaran', 'Lənkəran'),
        ('shaki', 'Şəki'),
        ('yevlax', 'Yevlax'),
        ('nakhchivan', 'Naxçıvan'),
        ('ordubad', 'Ordubad'),
        ('qabala', 'Qəbələ'),
        ('qusar', 'Qusar'),
        ('shamakhi', 'Şamaxı'),
        ('tovuz', 'Tovuz'),
        ('agdam', 'Ağdam'),
        ('barda', 'Bərdə'),
        ('beylagan', 'Beyləqan'),
        ('bilasuvar', 'Biləsuvar'),
        ('dashkasan', 'Daşkəsən'),
        ('fizuli', 'Füzuli'),
        ('gadabay', 'Gədəbəy'),
        ('goranboy', 'Goranboy'),
        ('goychay', 'Göyçay'),
        ('hajigabul', 'Hacıqabul'),
        ('imishli', 'İmişli'),
        ('ismayilli', 'İsmayıllı'),
        ('kalbajar', 'Kəlbəcər'),
        ('kurdamir', 'Kürdəmir'),
        ('lachin', 'Laçın'),
        ('lerik', 'Lerik'),
        ('masalli', 'Masallı'),
        ('neftchala', 'Neftçala'),
        ('oguz', 'Oğuz'),
        ('qakh', 'Qax'),
        ('qazakh', 'Qazax'),
        ('qobustan', 'Qobustan'),
        ('salyan', 'Salyan'),
        ('shamkir', 'Şəmkir'),
        ('shusha', 'Şuşa'),
        ('tartar', 'Tərtər'),
        ('ujar', 'Ucar'),
        ('xankendi', 'Xankəndi'),
        ('yardimli', 'Yardımlı'),
        ('zangilan', 'Zəngilan'),
        ('zaqatala', 'Zaqatala'),
        ('zardab', 'Zərdab'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='offers')
    first_name = models.CharField(max_length=100, verbose_name='Ad')
    last_name = models.CharField(max_length=100, verbose_name='Soyad')
    phone_number = models.CharField(max_length=20, verbose_name='Telefon nömrəsi')
    city = models.CharField(max_length=50, choices=AZERBAIJAN_CITIES, verbose_name='Şəhər')
    email = models.EmailField(blank=True, null=True, verbose_name='Email (İstəyə görə)')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Miqdar (ədəd)')
    offer_text = models.TextField(blank=True, verbose_name='Təklif mətn (istəyə görə)')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yaradılma tarixi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Yenilənmə tarixi')

    class Meta:
        verbose_name = 'Məhsul Təklifi'
        verbose_name_plural = 'Məhsul Təklifləri'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.product.name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def category_name(self):
        return self.product.category.name if self.product.category else "Kateqoriya yoxdur"


class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ("product-inquiry", "Məhsul haqqında sual"),
        ("technical-support", "Texniki dəstək"),
        ("complaint", "Şikayət"),
        ("suggestion", "Təklif"),
        ("partnership", "Əməkdaşlıq"),
        ("other", "Digər"),
    ]

    STATUS_CHOICES = [
        ("new", "Yeni"),
        ("read", "Oxunub"),
        ("archived", "Arxivləndi"),
    ]

    first_name = models.CharField(max_length=100, verbose_name="Ad")
    last_name = models.CharField(max_length=100, verbose_name="Soyad")
    email = models.EmailField(verbose_name="E-poçt")
    phone = models.CharField(max_length=30, blank=True, verbose_name="Telefon")
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES, verbose_name="Mövzu")
    message = models.TextField(verbose_name="Mesaj")
    privacy_accepted = models.BooleanField(default=False, verbose_name="Məxfilik qəbul edildi")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new", verbose_name="Status")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Göndərilmə tarixi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yenilənmə tarixi")

    class Meta:
        verbose_name = "Əlaqə Mesajı"
        verbose_name_plural = "Əlaqə Mesajları"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name} - {self.get_subject_display()}"


# Simple unique daily site visits (per session)
class SiteVisit(models.Model):
    date = models.DateField(db_index=True)
    session_key = models.CharField(max_length=40, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("date", "session_key")
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["session_key"]),
        ]
        verbose_name = "Sayt Ziyarəti"
        verbose_name_plural = "Sayt Ziyarətləri"

    def __str__(self) -> str:
        return f"{self.date} - {self.session_key}"
