from django.contrib import admin
from .models import Medicine


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "batch_number", "stock_quantity", "expiry_date", "supplier")
    list_filter = ("category",)
    search_fields = ("name", "batch_number", "supplier")
