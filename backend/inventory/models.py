from django.db import models
from django.core.validators import MinValueValidator


class Medicine(models.Model):
    CATEGORY_CHOICES = [
        ("Analgesic", "Analgesic"),
        ("Antibiotic", "Antibiotic"),
        ("Antiseptic", "Antiseptic"),
        ("Antiviral", "Antiviral"),
        ("Cardiac", "Cardiac"),
        ("Dermatological", "Dermatological"),
        ("Gastrointestinal", "Gastrointestinal"),
        ("Respiratory", "Respiratory"),
        ("Supplement", "Supplement"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Other")
    batch_number = models.CharField(max_length=50, unique=True)
    stock_quantity = models.IntegerField(validators=[MinValueValidator(0)])
    reorder_level = models.IntegerField(validators=[MinValueValidator(0)], default=20)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    supplier = models.CharField(max_length=150)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.batch_number})"
