# SETTLIMAX — Full Stack Setup Guide

## Project Structure
```
settlimax/
├── frontend/     ← React + Vite + TailwindCSS
└── backend/      ← Laravel 10 + Sanctum + MySQL
```

---

## BACKEND SETUP (Laravel)

### Requirements
- PHP >= 8.2
- Composer
- MySQL 8+
- Node (for storage link only)

### Steps

```bash
cd backend

# 1. Install dependencies
composer install

# 2. Copy and configure environment
cp .env.example .env
 
# 3. Edit .env — set your DB credentials and admin details:
#    DB_DATABASE=stackearnx_db
#    DB_USERNAME=root
#    DB_PASSWORD=yourpassword
#    ADMIN_EMAIL=admin@stackearnx.com
#    ADMIN_PASSWORD=Admin@1234

# 4. Generate app key
php artisan key:generate

# 5. Create database (in MySQL)
#    CREATE DATABASE stackearnx_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 6. Run migrations
php artisan migrate

# 7. Seed the database (creates admin + default settings)
php artisan db:seed

# 8. Create storage symlink (for deposit proof images)
php artisan storage:link

# 9. Start the development server
php artisan serve
# API runs at: http://localhost:8000/api
```

### Troubleshooting Registration
If you see "Registration failed":
1. Check `backend/storage/logs/laravel.log` for the specific error.
2. Ensure you have created the `stackearnx_db` database in MySQL.
3. Verify that `DB_USERNAME` and `DB_PASSWORD` in `.env` are correct.
4. Run `php artisan migrate:fresh --seed` to reset the database and ensure all tables exist.
5. If `composer install` fails with **Permission denied**, run your terminal as Administrator and close any programs (like VS Code or XAMPP) that might be using the `backend` folder.
```

### Income Scheduler
Income is released every 18 hours via a scheduled command.
Add this to your server's crontab:
```bash
* * * * * php /home/username/stackearnx_api/artisan schedule:run >> /dev/null 2>&1
```
Or run manually to test:
```bash
php artisan income:release
```

---

## FRONTEND SETUP (React)

### Requirements
- Node.js >= 18
- npm or yarn

### Steps

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env if needed:
#   VITE_API_BASE_URL=http://localhost:8000/api

# 3. Start development server
npm run dev
# Frontend runs at: http://localhost:3000

# 4. Build for production
npm run build
```



## KEY FEATURES

### User Side
- Register/Login with referral code support
- ₦800 welcome bonus + ₦50 daily login bonus
- 12 investment plans (Stack 1–12) from ₦3,000 to ₦150,000
- 25-day investment cycles, income released every 18 hours
- Deposit via bank transfer + proof of payment upload
- Withdrawal requests with 15% charge
- Referral system: ₦20 per signup + 5% commission
- Full transaction history

### Admin Side
- Platform overview dashboard
- User management (credit wallet, activate/deactivate)
- Deposit review (approve/reject with note)
- Withdrawal review (approve/reject, refund on reject)
- Investment tracking
- Transaction log
- Platform settings (bank details, Telegram link)

---

## INVESTMENT PLANS REFERENCE

| Plan     | Cost     | Daily     | Total    | Cycle   |
|----------|----------|-----------|----------|---------|
| Stack 1  | ₦3,000   | ₦750      | ₦18,750  | 25 days |
| Stack 2  | ₦5,000   | ₦1,250    | ₦31,250  | 25 days |
| Stack 3  | ₦7,000   | ₦1,750    | ₦43,750  | 25 days |
| Stack 4  | ₦10,000  | ₦2,500    | ₦62,500  | 25 days |
| Stack 5  | ₦15,000  | ₦3,750    | ₦93,750  | 25 days |
| Stack 6  | ₦20,000  | ₦5,000    | ₦125,000 | 25 days |
| Stack 7  | ₦25,000  | ₦6,250    | ₦156,250 | 25 days |
| Stack 8  | ₦30,000  | ₦7,500    | ₦187,500 | 25 days |
| Stack 9  | ₦50,000  | ₦12,500   | ₦312,500 | 25 days |
| Stack 10 | ₦70,000  | ₦17,500   | ₦437,500 | 25 days |
| Stack 11 | ₦100,000 | ₦25,000   | ₦625,000 | 25 days |
| Stack 12 | ₦150,000 | ₦37,500   | ₦937,500 | 25 days |

---

## PRODUCTION DEPLOYMENT

### Namecheap (cPanel) Deployment Plan

**1. Folder Structure:**
- Upload Laravel `backend` contents to: `/home/username/stackearnx_api`
- Upload React `dist` contents to: `/home/username/public_html`
- Create a symlink from `/home/username/stackearnx_api/public` to `/home/username/public_html/api`

**2. Frontend Router Fix (.htaccess):**
Create a file at `public_html/.htaccess` with this content to fix React "404 on refresh" errors:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Exclude the API directory from React routing
  RewriteCond %{REQUEST_URI} ^/api [NC]
  RewriteRule . - [L]

  # Normal React Routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**3. Environment Config:**
- In `stackearnx_api/.env`, set `APP_URL=https://yourdomain.com/api`
- In React `.env`, set `VITE_API_BASE_URL=https://yourdomain.com/api`
