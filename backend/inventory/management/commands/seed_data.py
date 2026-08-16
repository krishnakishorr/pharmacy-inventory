import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from inventory.models import Medicine

MEDICINES = [
    ("Paracetamol 500mg", "Analgesic"),
    ("Ibuprofen 400mg", "Analgesic"),
    ("Amoxicillin 250mg", "Antibiotic"),
    ("Azithromycin 500mg", "Antibiotic"),
    ("Cefixime 200mg", "Antibiotic"),
    ("Povidone Iodine Solution", "Antiseptic"),
    ("Hydrogen Peroxide 6%", "Antiseptic"),
    ("Oseltamivir 75mg", "Antiviral"),
    ("Atorvastatin 10mg", "Cardiac"),
    ("Amlodipine 5mg", "Cardiac"),
    ("Metoprolol 50mg", "Cardiac"),
    ("Clotrimazole Cream", "Dermatological"),
    ("Hydrocortisone Cream 1%", "Dermatological"),
    ("Omeprazole 20mg", "Gastrointestinal"),
    ("Ranitidine 150mg", "Gastrointestinal"),
    ("ORS Sachets", "Gastrointestinal"),
    ("Salbutamol Inhaler", "Respiratory"),
    ("Cetirizine 10mg", "Respiratory"),
    ("Montelukast 10mg", "Respiratory"),
    ("Vitamin D3 60K", "Supplement"),
    ("Vitamin C 500mg", "Supplement"),
    ("Iron Folic Acid Tablets", "Supplement"),
    ("Calcium Carbonate 500mg", "Supplement"),
    ("Multivitamin Syrup", "Supplement"),
    ("Insulin Glargine", "Other"),
    ("Metformin 500mg", "Other"),
    ("Diclofenac Gel", "Analgesic"),
    ("Aspirin 75mg", "Cardiac"),
    ("Doxycycline 100mg", "Antibiotic"),
    ("Betadine Ointment", "Antiseptic"),
]

SUPPLIERS = ["MedPlus Distributors", "Apollo Pharma Supply", "Kerala State Drugs Ltd", "CarePlus Wholesale", "Sunrise Pharma Traders"]


class Command(BaseCommand):
    help = "Seed the database with dummy pharmacy inventory data"

    def handle(self, *args, **options):
        Medicine.objects.all().delete()
        created = 0
        for i, (name, category) in enumerate(MEDICINES):
            stock = random.choice([0, 5, 8, 15, 20, 25, 40, 60, 80, 120, 150])
            reorder = random.choice([10, 15, 20, 25, 30])
            # spread expiry dates: some expired, some expiring soon, most fine
            bucket = random.random()
            if bucket < 0.1:
                expiry = date.today() - timedelta(days=random.randint(1, 60))
            elif bucket < 0.3:
                expiry = date.today() + timedelta(days=random.randint(1, 59))
            else:
                expiry = date.today() + timedelta(days=random.randint(90, 720))

            Medicine.objects.create(
                name=name,
                category=category,
                batch_number=f"BN{1000 + i}-{random.randint(10,99)}",
                stock_quantity=stock,
                reorder_level=reorder,
                unit_price=round(random.uniform(5, 450), 2),
                supplier=random.choice(SUPPLIERS),
                expiry_date=expiry,
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} medicines."))
