# Telegram Shop Frontend (React + Vite + Tailwind)

## Run locally
1. Copy `.env.example` to `.env` and set `VITE_API_URL`.
2. Install deps:
   ```bash
   npm install
   npm run dev
   ```

## Telegram login
- If opened inside Telegram WebApp, the app auto-logs in using `Telegram.WebApp.initData` (backend must have `TELEGRAM_BOT_TOKEN`).
- If opened in a normal browser, set `VITE_TELEGRAM_BOT_USERNAME` and use the Telegram Login Widget.
