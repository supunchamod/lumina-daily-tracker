# Lumina Life Planner ✨

A full-stack kawaii life-planner with gamification.

**Stack:** Laravel 11 (API) · React + Vite + Tailwind CSS v4 · MySQL

---

## Project Structure

```
lumina-daily-tracker/
├── backend/          # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # AuthController, HabitController, TaskController,
│   │   │                           # RewardController, DashboardController
│   │   ├── Models/                 # User, Habit, Task, Reward,
│   │   │                           # DailyLog, UserInput, HealthTracker, Badge
│   │   └── Policies/               # HabitPolicy, TaskPolicy, RewardPolicy
│   ├── config/cors.php
│   ├── database/
│   │   ├── migrations/             # All table migrations (see below)
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── LuminaSeeder.php    # Moods, weather options, badges
│   └── routes/api.php
│
└── frontend/         # React SPA
    ├── src/
    │   ├── components/
    │   │   ├── layout/   # AppLayout, Sidebar
    │   │   └── ui/       # Card, Button, XpBar
    │   ├── lib/axios.js  # Axios instance with auth interceptors
    │   ├── pages/        # LoginPage, DashboardPage
    │   ├── stores/       # authStore (Zustand)
    │   └── index.css     # Tailwind v4 + kawaii theme variables
    └── vite.config.js    # Proxy /api → Laravel dev server
```

---

## Database Schema

| Table              | Purpose                                               |
|--------------------|-------------------------------------------------------|
| `users`            | Auth + gamification (XP, level, streak, avatar)       |
| `habits`           | Recurring habits with frequency, XP reward, streak    |
| `tasks`            | One-off tasks with priority, due date, XP reward      |
| `rewards`          | Custom rewards purchasable with XP                    |
| `daily_logs`       | Daily journal: mood, weather, water intake, sleep     |
| `moods`            | Lookup: mood labels + emojis                          |
| `weather_options`  | Lookup: weather labels + emojis                       |
| `user_inputs`      | Custom text notes with font & color styling           |
| `health_tracker`   | Period & cycle tracking with per-day symptoms         |
| `badges`           | Badge catalogue (condition-driven)                    |
| `badge_user`       | Pivot: badges awarded to users                        |

---

## Local Setup

### Prerequisites

- PHP >= 8.2 + Composer
- Node.js >= 18 + npm
- MySQL >= 8.0

---

### 1 — Clone the repository

```bash
git clone <repo-url>
cd lumina-daily-tracker
```

### 2 — Backend (Laravel 11)

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file and generate app key
cp .env.example .env
php artisan key:generate

# Configure database credentials in .env
# DB_DATABASE=lumina_life_planner
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE lumina_life_planner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations + seed lookup data and a test user
php artisan migrate --seed

# Start the dev server (default: http://localhost:8000)
php artisan serve
```

### 3 — Frontend (React + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server (default: http://localhost:5173)
npm run dev
```

Open **http://localhost:5173** in your browser.
The Vite dev server proxies `/api/*` to `http://localhost:8000`, so no CORS issues during development.

**Default test credentials:**
- Email: `hello@lumina.app`
- Password: `password`

---

## Useful Artisan Commands

```bash
# Re-run all migrations (fresh start)
php artisan migrate:fresh --seed

# Create a new migration
php artisan make:migration create_foo_table

# Create a model with migration
php artisan make:model Foo -m

# Create a new API controller
php artisan make:controller Api/FooController --api

# Run tests
php artisan test
```

---

## API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint                        | Auth | Description            |
|--------|---------------------------------|------|------------------------|
| POST   | `/register`                     | No   | Register               |
| POST   | `/login`                        | No   | Login (returns token)  |
| POST   | `/logout`                       | Yes  | Logout                 |
| GET    | `/user`                         | Yes  | Authenticated user     |
| GET    | `/dashboard`                    | Yes  | Dashboard data         |
| GET    | `/habits`                       | Yes  | List habits            |
| POST   | `/habits`                       | Yes  | Create habit           |
| PUT    | `/habits/{id}`                  | Yes  | Update habit           |
| DELETE | `/habits/{id}`                  | Yes  | Delete habit           |
| POST   | `/habits/{id}/complete`         | Yes  | Mark habit complete    |
| GET    | `/tasks`                        | Yes  | List tasks             |
| POST   | `/tasks`                        | Yes  | Create task            |
| PUT    | `/tasks/{id}`                   | Yes  | Update task            |
| DELETE | `/tasks/{id}`                   | Yes  | Delete task            |
| POST   | `/tasks/{id}/complete`          | Yes  | Mark task complete     |
| GET    | `/rewards`                      | Yes  | List rewards           |
| POST   | `/rewards`                      | Yes  | Create reward          |
| DELETE | `/rewards/{id}`                 | Yes  | Delete reward          |
| POST   | `/rewards/{id}/redeem`          | Yes  | Redeem reward with XP  |

---

## Kawaii Theme

The pastel color palette is defined as CSS custom properties in `frontend/src/index.css` using Tailwind v4's `@theme` block:

| Token              | Value     | Role                      |
|--------------------|-----------|---------------------------|
| `--color-primary`  | `#C084FC` | Soft purple (main brand)  |
| `--color-secondary`| `#F9A8D4` | Soft pink                 |
| `--color-accent`   | `#67E8F9` | Soft cyan                 |
| `--color-blush`    | `#FFD6E0` | Background accents        |
| `--color-lavender` | `#E2D9F3` | Card backgrounds          |
| `--color-mint`     | `#C3F4D7` | Success / positive states |

Typography uses **Nunito** (Google Fonts) — a rounded, friendly typeface perfect for the kawaii aesthetic.
