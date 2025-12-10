from django.contrib import admin
from .models import (
    Category, Product, ProductImage, ProductFeature, ProductSpec, ProductHighlight,
    AboutPage, AboutValue, AboutTeamMember, AboutTechFeature, AboutTechStat,
    ContactPage, ContactWorkingHour, ContactFAQ, FooterSettings, ProductOffer, ContactMessage
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1


class ProductSpecInline(admin.TabularInline):
    model = ProductSpec
    extra = 1


class ProductHighlightInline(admin.TabularInline):
    model = ProductHighlight
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category')
    list_filter = ('category',)
    search_fields = ('id', 'name', 'description')
    inlines = [ProductImageInline, ProductFeatureInline, ProductSpecInline, ProductHighlightInline]

    def get_readonly_fields(self, request, obj=None):
        # Make id read-only (and hidden on add form by not including it in fields)
        return ('id',) if obj else ()

    def get_fields(self, request, obj=None):
        base = ('name', 'category', 'description', 'price', 'original_price', 'discount')
        return base + (('id',) if obj else ())


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('key', 'name')
    search_fields = ('key', 'name', 'description')
    fields = ('key', 'name', 'description', 'image')


admin.site.site_header = 'Depod Admin'
admin.site.site_title = 'Depod Admin'
admin.site.index_title = 'Depod Administration'


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title",)
    list_editable = ("is_active",)
    readonly_fields = ("updated_at",)
    fieldsets = (
        ("Başlıq", {"fields": ("title", "subtitle", "is_active")}),
        ("Hekayə & Statistika", {"fields": ("story", "experience_years", "product_models", "happy_customers", "quality_rating")}),
        ("Missiya & Vizyon", {"fields": ("mission", "vision")}),
        ("Dəyərlər Bölməsi", {"fields": ("values_title",)}),
        ("Komanda Bölməsi", {"fields": ("team_description",)}),
        ("Texnologiya", {"fields": ("technology_title", "technology_text")}),
        ("Əlaqə", {"fields": ("contact_title", "contact_text")}),
        ("Sistem", {"fields": ("updated_at",)}),
    )

    actions = ["make_active"]

    def make_active(self, request, queryset):
        # Set only the first selected as active and others inactive
        first = queryset.first()
        if first:
            type(first).objects.exclude(pk=first.pk).update(is_active=False)
            first.is_active = True
            first.save()
        self.message_user(request, "Seçilən səhifə aktiv edildi. Digərləri deaktiv oldu.")
    make_active.short_description = "Seçiləni aktiv et"

class AboutValueInline(admin.TabularInline):
    model = AboutValue
    extra = 1
    fields = ("order", "icon", "title", "text")
    ordering = ("order", "id")

class AboutTeamMemberInline(admin.TabularInline):
    model = AboutTeamMember
    extra = 1
    fields = ("order", "title", "description", "detail")
    ordering = ("order", "id")

class AboutTechFeatureInline(admin.TabularInline):
    model = AboutTechFeature
    extra = 1
    fields = ("order", "text")
    ordering = ("order", "id")

class AboutTechStatInline(admin.TabularInline):
    model = AboutTechStat
    extra = 1
    fields = ("order", "number", "label")
    ordering = ("order", "id")

AboutPageAdmin.inlines = [
    AboutValueInline,
    AboutTeamMemberInline,
    AboutTechFeatureInline,
    AboutTechStatInline,
]


class ContactWorkingHourInline(admin.TabularInline):
    model = ContactWorkingHour
    extra = 1
    fields = ("order", "label", "time")
    ordering = ("order", "id")


class ContactFAQInline(admin.TabularInline):
    model = ContactFAQ
    extra = 1
    fields = ("order", "question", "answer")
    ordering = ("order", "id")


@admin.register(ContactPage)
class ContactPageAdmin(admin.ModelAdmin):
    list_display = ("hero_title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("hero_title",)
    readonly_fields = ("updated_at",)
    list_editable = ("is_active",)
    fieldsets = (
        ("Hero", {"fields": ("hero_title", "hero_subtitle", "is_active")}),
        ("Əlaqə Məlumatı", {"fields": ("email_primary", "email_secondary", "phone_primary", "phone_secondary", "address_line1", "address_line2")}),
        ("Əlaqə Forması", {"fields": ("form_title", "form_text")}),
        ("Sidebar Dəstək", {"fields": ("support_title", "support_text", "support_phone")}),
        ("Sidebar Kataloq", {"fields": ("catalog_title", "catalog_text", "catalog_link")}),
        ("Xəritə", {"fields": ("map_section_title", "map_heading", "map_address", "map_button_text", "map_url")}),
        ("Sistem", {"fields": ("updated_at",)}),
    )

    actions = ["make_active"]

    def make_active(self, request, queryset):
        first = queryset.first()
        if first:
            type(first).objects.exclude(pk=first.pk).update(is_active=False)
            first.is_active = True
            first.save()
        self.message_user(request, "Seçilən kontakt səhifəsi aktiv edildi. Digərləri deaktiv oldu.")
    make_active.short_description = "Seçiləni aktiv et"

    inlines = [ContactWorkingHourInline, ContactFAQInline]


@admin.register(FooterSettings)
class FooterSettingsAdmin(admin.ModelAdmin):
    list_display = ("email", "phone", "is_active", "updated_at")
    list_filter = ("is_active",)
    readonly_fields = ("updated_at",)
    list_editable = ("is_active",)
    fields = ("description", "email", "phone", "bottom_text", "is_active", "updated_at")
    actions = ["make_active"]

    def make_active(self, request, queryset):
        first = queryset.first()
        if first:
            type(first).objects.exclude(pk=first.pk).update(is_active=False)
            first.is_active = True
            first.save()
        self.message_user(request, "Aktiv footer dəyişdirildi.")
    make_active.short_description = "Seçiləni aktiv et"


@admin.register(ProductOffer)
class ProductOfferAdmin(admin.ModelAdmin):
    list_display = ("get_customer_name", "get_product_name", "quantity", "city", "status", "created_at")
    list_filter = ("status", "city", "quantity", "created_at")
    search_fields = ("first_name", "last_name", "phone_number", "email", "product__name")
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("status",)
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Müştəri Məlumatları", {
            "fields": ("first_name", "last_name", "phone_number", "email", "city")
        }),
        ("Məhsul və Təklif", {
            "fields": ("product", "quantity", "offer_text")
        }),
        ("Status və Tarixlər", {
            "fields": ("status", "created_at", "updated_at")
        }),
    )
    
    actions = ["mark_as_reviewed", "mark_as_accepted", "mark_as_rejected"]
    
    def get_customer_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    get_customer_name.short_description = "Müştəri Adı"
    
    def get_product_name(self, obj):
        return obj.product.name
    get_product_name.short_description = "Məhsul"
    
    def mark_as_reviewed(self, request, queryset):
        updated = queryset.update(status='reviewed')
        self.message_user(request, f"{updated} təklif nəzərdən keçirildi olaraq işarələndi.")
    mark_as_reviewed.short_description = "Nəzərdən keçirildi olaraq işarələ"
    
    def mark_as_accepted(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f"{updated} təklif qəbul edildi olaraq işarələndi.")
    mark_as_accepted.short_description = "Qəbul edildi olaraq işarələ"
    
    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f"{updated} təklif rədd edildi olaraq işarələndi.")
    mark_as_rejected.short_description = "Rədd edildi olaraq işarələ"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "phone", "subject", "status", "created_at")
    list_filter = ("status", "subject", "created_at")
    search_fields = ("first_name", "last_name", "email", "phone", "message")
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("status",)
    ordering = ("-created_at",)

    fieldsets = (
        ("Müraciətçi", {"fields": ("first_name", "last_name", "email", "phone")}),
        ("Məzmun", {"fields": ("subject", "message", "privacy_accepted")}),
        ("Status", {"fields": ("status", "created_at", "updated_at")}),
    )

    actions = ["mark_as_read", "archive"]

    def mark_as_read(self, request, queryset):
        updated = queryset.update(status="read")
        self.message_user(request, f"{updated} mesaj oxundu olaraq işarələndi.")
    mark_as_read.short_description = "Oxundu olaraq işarələ"

    def archive(self, request, queryset):
        updated = queryset.update(status="archived")
        self.message_user(request, f"{updated} mesaj arxivləndi.")
    archive.short_description = "Arxivlə"
