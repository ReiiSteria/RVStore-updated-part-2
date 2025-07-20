# TopUp Game MIS - Backend API

FastAPI backend untuk Management Information System bisnis topup game.

## 🚀 Quick Start

### 1. Setup Database

1. Buka phpMyAdmin atau MySQL client
2. Import file `database/schema.sql` untuk membuat struktur database
3. Import file `database/dummy_data.sql` untuk data dummy

### 2. Setup Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env file dengan konfigurasi database Anda
nano .env
```

### 3. Test Database Connection

```bash
python database/config.py
```

### 4. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API akan tersedia di: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## 📊 Database Schema

### Tables:
- **admin_users**: User untuk login MIS
- **users**: Customer yang melakukan topup
- **games**: Daftar game yang tersedia
- **products**: Produk topup untuk setiap game
- **orders**: Pesanan topup
- **transactions**: Transaksi yang sudah selesai
- **payment_methods**: Metode pembayaran

### Views:
- **monthly_revenue**: Revenue bulanan
- **game_performance**: Performa setiap game
- **product_performance**: Performa setiap produk
- **user_analytics**: Analitik user

## 🔐 Authentication

Default admin credentials:
- Email: `manager@topupgame.com`
- Password: `password123`

## 📈 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register (admin only)
- `POST /api/v1/auth/refresh` - Refresh token

### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/dashboard/charts` - Chart data

### Transactions
- `GET /api/v1/transactions` - List transactions
- `GET /api/v1/transactions/{id}` - Get transaction detail

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/games` - List games

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/{id}` - Get order detail

### Reports
- `GET /api/v1/reports/sales` - Sales report
- `GET /api/v1/reports/games` - Game performance report
- `GET /api/v1/reports/products` - Product performance report

## 🛠️ Development

### Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## 📝 Environment Variables

Lihat file `.env.example` untuk daftar lengkap environment variables yang diperlukan.

## 🔧 Troubleshooting

### Database Connection Issues
1. Pastikan MySQL service berjalan
2. Cek kredensial database di file `.env`
3. Pastikan database `topup_game_mis` sudah dibuat

### Import Error
1. Pastikan semua dependencies terinstall: `pip install -r requirements.txt`
2. Cek Python version (minimal 3.8)

### Permission Issues
1. Pastikan user MySQL memiliki akses ke database
2. Cek firewall settings jika menggunakan remote database