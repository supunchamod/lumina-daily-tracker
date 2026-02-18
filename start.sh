#!/usr/bin/env bash
# Lumina Daily Tracker — start both dev servers
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# ── 1. Kill any previous instances ─────────────────────────────────────────
pkill -f "php artisan serve" 2>/dev/null || true
pkill -f "vite"              2>/dev/null || true
sleep 1

# ── 2. Ensure SQLite DB exists and is up-to-date ───────────────────────────
cd "$BACKEND"
touch database/database.sqlite
php artisan config:clear -q
php artisan migrate --force -q
php artisan db:seed --force -q 2>/dev/null || true   # safe to re-run seeders

# ── 3. Start Laravel backend ───────────────────────────────────────────────
php artisan serve --host=0.0.0.0 --port=8000 > /tmp/laravel.log 2>&1 &
BACKEND_PID=$!
echo "Laravel  → http://localhost:8000  (PID $BACKEND_PID)"

# ── 4. Start Vite frontend ─────────────────────────────────────────────────
cd "$FRONTEND"
npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/vite.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend → http://localhost:5173  (PID $FRONTEND_PID)"

# ── 5. Wait and confirm both are up ────────────────────────────────────────
echo ""
echo "Waiting for servers to boot..."
for i in $(seq 1 10); do
  sleep 1
  B=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/up 2>/dev/null)
  F=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173    2>/dev/null)
  if [ "$B" = "200" ] && [ "$F" = "200" ]; then
    echo ""
    echo "✓ Both servers are running!"
    echo ""
    echo "  App      → http://localhost:5173"
    echo "  Login    → hello@lumina.app / password"
    echo "  Register → http://localhost:5173/register"
    echo ""
    echo "Logs: tail -f /tmp/laravel.log  |  tail -f /tmp/vite.log"
    exit 0
  fi
done
echo "! Timeout — check /tmp/laravel.log and /tmp/vite.log for errors"
exit 1
