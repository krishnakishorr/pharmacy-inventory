from datetime import date, timedelta
from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    days_to_expiry = serializers.SerializerMethodField()

    class Meta:
        model = Medicine
        fields = [
            "id", "name", "category", "batch_number", "stock_quantity",
            "reorder_level", "unit_price", "supplier", "expiry_date",
            "status", "days_to_expiry", "created_at", "updated_at",
        ]

    def get_days_to_expiry(self, obj):
        return (obj.expiry_date - date.today()).days

    def get_status(self, obj):
        days = (obj.expiry_date - date.today()).days
        if days < 0:
            return "expired"
        if days <= 60:
            return "expiring_soon"
        if obj.stock_quantity <= obj.reorder_level:
            return "low_stock"
        return "ok"

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value

    def validate_unit_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative.")
        return value

    def validate_batch_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Batch number is required.")
        return value
