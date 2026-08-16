from datetime import date, timedelta
from django.db.models import Q, F
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Medicine
from .serializers import MedicineSerializer


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "batch_number", "supplier", "category"]
    ordering_fields = ["name", "stock_quantity", "expiry_date", "unit_price"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        status_filter = self.request.query_params.get("status")
        if category:
            qs = qs.filter(category=category)
        if status_filter == "low_stock":
            qs = qs.filter(stock_quantity__lte=F("reorder_level"))
        elif status_filter == "expiring_soon":
            qs = qs.filter(expiry_date__lte=date.today() + timedelta(days=60), expiry_date__gte=date.today())
        elif status_filter == "expired":
            qs = qs.filter(expiry_date__lt=date.today())
        return qs

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        today = date.today()
        qs = Medicine.objects.all()
        total_items = qs.count()
        total_stock_value = sum(m.stock_quantity * m.unit_price for m in qs)
        low_stock = qs.filter(stock_quantity__lte=F("reorder_level"))
        expiring_soon = qs.filter(expiry_date__lte=today + timedelta(days=60), expiry_date__gte=today)
        expired = qs.filter(expiry_date__lt=today)

        return Response({
            "total_items": total_items,
            "total_stock_value": total_stock_value,
            "low_stock_count": low_stock.count(),
            "expiring_soon_count": expiring_soon.count(),
            "expired_count": expired.count(),
            "low_stock_items": MedicineSerializer(low_stock.order_by("stock_quantity")[:5], many=True).data,
            "expiring_soon_items": MedicineSerializer(expiring_soon.order_by("expiry_date")[:5], many=True).data,
        })
