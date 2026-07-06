# 🏥 PharmacyHub - Multi-Tenant Pharmacy Management Platform

A modern multi-pharmacy management platform built with Laravel 11 + React 18, featuring subdomain-based tenancy, Stripe payments, Leaflet maps, and full inventory management.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 (API) |
| Frontend | React 18 + Vite |
| Database | MySQL 8.0 |
| Cache | Redis |
| Multi-tenancy | Subdomain-based |
| Maps | Leaflet + OpenStreetMap |
| Payments | Stripe + COD |
| Auth | Laravel Sanctum |
| Styling | TailwindCSS |

## 📋 Features

### Super Admin
- Dashboard with analytics & Recharts
- Pharmacy management (approve/deactivate)
- Medicine catalog management
- Supply order management
- Reports with CSV/JSON export

### Pharmacy Owner
- Dashboard with sales trends
- Medicine & stock management
- POS system with receipt generation
- Order management with status workflow
- Supply request to admin
- Low stock alerts
- Settings management

### Customer
- Medicine search with Leaflet map
- Pharmacy browsing
- Shopping cart (grouped by pharmacy)
- Checkout with Stripe/COD
- Order history & tracking
- Medicine detail pages

## 🛠️ Installation

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL 8.0
- Composer
- Docker (optional)

### Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/mentha2020/Multi-Tenant-Pharmacy-Management-Platform.git
cd Multi-Tenant-Pharmacy-Management-Platform

# Run setup
chmod +x deploy.sh
./deploy.sh setup
```

### Manual Setup

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# Frontend
cd ../frontend
npm install
npm run dev
```

## 🐳 Docker Commands

```bash
# Start all containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Run artisan commands
docker-compose exec app php artisan [command]

# Run tests
docker-compose exec app php artisan test
```

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run with coverage
php artisan test --coverage
```

## 📁 Project Structure

```
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── SuperAdmin/  # Admin controllers
│   │   │   ├── Pharmacy/    # Pharmacy controllers
│   │   │   └── Customer/    # Customer controllers
│   │   └── Models/          # Eloquent models
│   ├── database/migrations/ # Database schema
│   ├── routes/api.php       # API routes
│   └── tests/               # PHPUnit tests
├── frontend/                # React app
│   └── src/
│       ├── pages/
│       │   ├── admin/       # Admin pages
│       │   ├── pharmacy/    # Pharmacy pages
│       │   └── customer/    # Customer pages
│       ├── layouts/         # Layout components
│       └── store/           # Zustand stores
├── docker-compose.yml       # Docker setup
├── nginx/                   # Nginx config
└── deploy.sh               # Deployment script
```

## 🔧 Environment Variables

See `backend/.env.production` for all required variables.

Key variables:
- `APP_KEY` - Laravel encryption key
- `DB_*` - Database credentials
- `STRIPE_*` - Stripe payment keys
- `PLATFORM_DOMAIN` - Your domain

## 📝 API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/categories` - List categories
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login

### Customer
- `GET /api/customer/medicines/search` - Search medicines
- `GET /api/customer/pharmacies` - List pharmacies
- `POST /api/customer/orders` - Create order
- `GET /api/customer/orders` - List orders

### Pharmacy
- `GET /api/pharmacy/dashboard` - Dashboard stats
- `GET /api/pharmacy/medicines` - List medicines
- `POST /api/pharmacy/medicines` - Add medicine
- `GET /api/pharmacy/stock` - List stock
- `POST /api/pharmacy/pos/sale` - Create POS sale
- `GET /api/pharmacy/low-stock` - Low stock alerts
- `POST /api/pharmacy/supply-requests` - Request supply

### Super Admin
- `GET /api/super-admin/dashboard` - Dashboard stats
- `GET /api/super-admin/pharmacies` - List pharmacies
- `PATCH /api/super-admin/pharmacies/{id}/activate` - Activate pharmacy
- `GET /api/super-admin/medicines` - List medicines
- `GET /api/super-admin/supply-orders` - List supply orders
- `GET /api/super-admin/reports/{type}` - Get reports

## 🚢 Deployment

### Production Deployment

```bash
# 1. Clone on server
git clone <repo>
cd <project>

# 2. Configure environment
cp backend/.env.production backend/.env
nano backend/.env  # Edit credentials

# 3. Run setup
./deploy.sh setup

# 4. Configure SSL (Let's Encrypt)
certbot --nginx -d yourdomain.com
```

### SSL Setup

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renew
certbot renew --dry-run
```

## 📄 License

MIT License

## 👥 Support

- Email: support@pharmacyhub.com
- Issues: GitHub Issues
