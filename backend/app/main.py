import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import Base, engine
from app.routers import admin, auth, orders, products

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME)

    # DB tables (for simple setups; for production prefer Alembic)
    Base.metadata.create_all(bind=engine)

    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

    app.include_router(auth.router)
    app.include_router(products.router)
    app.include_router(orders.router)
    app.include_router(admin.router)

    @app.get("/health")
    def health():
        return {"ok": True}

    return app


app = create_app()
