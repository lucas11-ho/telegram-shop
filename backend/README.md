# Telegram Shop Backend (FastAPI)

## Run locally
1. Copy `.env.example` to `.env` and fill values.
2. Create PostgreSQL DB and update `DATABASE_URL`.
3. Install deps:
   ```bash
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
4. Start:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Notes
- This uses `Base.metadata.create_all()` on startup for convenience. For production, add Alembic migrations.
- Uploaded product images are stored in `uploads/` and served via `/static/...`.
