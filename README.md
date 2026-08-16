# RxTrack — Pharmacy Inventory Management Prototype

A lightweight pharmacy inventory prototype built for the MedAura candidate assessment
(Hospital Industry Product Discovery & Prototype Development).

Full context, market research, and methodology are in `Market_Research_Report.pdf`.
This file covers the technical setup.

## Problem

Hospital and clinic pharmacies need a simple way to track stock levels and medicine
expiry dates without adopting a full billing/GST/POS-heavy ERP. RxTrack is a focused
inventory tracker: add, edit, search, and monitor medicines, with a dashboard that
surfaces what needs attention (low stock, expiring soon, expired).

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Django + Django REST Framework
- **Database:** SQLite (Django's built-in default — no separate install needed)

## Features

- Responsive dashboard: total items, stock value, low-stock count, expiring/expired count
- Full CRUD on medicines (name, category, batch number, stock, reorder level, unit price, supplier, expiry date)
- Search (by name, batch number, supplier) and filter (by category, by status)
- Client-side and server-side form validation (no negative stock/price, required fields, unique batch numbers)
- Dummy seed data (30 medicines with a realistic spread of stock levels and expiry dates)
- Shelf-life indicator per medicine, visualising days remaining until expiry

## Project Structure

```
pharmacy-inventory/
├── backend/            Django project (API)
│   ├── config/          project settings & URLs
│   ├── inventory/        app: models, serializers, views, seed command
│   └── manage.py
└── frontend/            React app (Vite)
    └── src/
        ├── components/    Sidebar, Dashboard, Inventory, MedicineForm, ExpiryBar
        └── api.js         API client
```

## Local Setup

Requires **Python 3.10+** and **Node.js 18+** installed on your machine.

### 1. Backend (Django API)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data      # loads 30 dummy medicines
python manage.py runserver
```

The API will run at `http://127.0.0.1:8000/api/`.
Optional: `python manage.py createsuperuser` to access the Django admin at `/admin/`.

### 2. Frontend (React)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` and talk to the Django API automatically.

### 3. Using the app

- **Dashboard** — overview of stock health, low-stock and expiring-soon lists.
- **Inventory** — full medicine list with search, category/status filters, and Add/Edit/Delete.

## API Endpoints

| Method | Endpoint                       | Description                        |
|--------|---------------------------------|-------------------------------------|
| GET    | `/api/medicines/`               | List medicines (supports `?search=`, `?category=`, `?status=`) |
| POST   | `/api/medicines/`               | Create a medicine                   |
| GET    | `/api/medicines/{id}/`          | Retrieve one medicine               |
| PUT    | `/api/medicines/{id}/`          | Update a medicine                   |
| DELETE | `/api/medicines/{id}/`          | Delete a medicine                   |
| GET    | `/api/medicines/dashboard/`     | Dashboard summary stats             |

## Deployment

Not deployed live for this submission (optional per the assessment brief) — the app is
built to run locally following the steps above. `frontend/.env.example` shows how to
point the frontend at a hosted backend URL if deployed later (e.g. Django on Render +
React on Vercel).

## Future Enhancements

- Role-based login (pharmacist vs. admin) instead of open access
- Batch-level FEFO (First-Expiry-First-Out) dispensing logic
- Purchase order generation when stock crosses the reorder level
- Multi-store / multi-branch inventory support
- Barcode scanning for faster stock entry
- Audit log of stock changes over time
