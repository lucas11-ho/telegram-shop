from fastapi import APIRouter, Depends, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models import User
from app.services.logger import log
from app.services.telegram import verify_login_widget, verify_webapp_initdata

router = APIRouter(prefix="/auth", tags=["auth"])


class TelegramWidgetPayload(BaseModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None
    photo_url: str | None = None
    auth_date: int
    hash: str


class WebAppAuthBody(BaseModel):
    init_data: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeOut(BaseModel):
    id: int
    telegram_id: str | None
    username: str | None
    first_name: str | None
    last_name: str | None
    photo_url: str | None
    email: str | None
    is_admin: bool


def _issue_user_token(user: User) -> str:
    return create_access_token(subject=f"user:{user.id}", extra={"is_admin": user.is_admin})


def _get_or_create_user_from_telegram(db: Session, telegram_id: str, username: str | None, first_name: str | None, last_name: str | None, photo_url: str | None) -> User:
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        user = User(telegram_id=telegram_id)
        db.add(user)

    user.username = username
    user.first_name = first_name
    user.last_name = last_name
    user.photo_url = photo_url
    db.commit()
    db.refresh(user)
    return user


@router.post("/telegram-widget", response_model=TokenOut)
def login_telegram_widget(payload: TelegramWidgetPayload, db: Session = Depends(get_db)):
    ok, reason = verify_login_widget(payload.model_dump())
    if not ok:
        raise HTTPException(status_code=401, detail=f"Telegram verification failed: {reason}")

    user = _get_or_create_user_from_telegram(
        db,
        telegram_id=str(payload.id),
        username=payload.username,
        first_name=payload.first_name,
        last_name=payload.last_name,
        photo_url=payload.photo_url,
    )
    log(db, "auth.telegram_widget", user_id=user.id)
    return TokenOut(access_token=_issue_user_token(user))


@router.post("/webapp", response_model=TokenOut)
def login_webapp(body: WebAppAuthBody, db: Session = Depends(get_db)):
    ok, reason, parsed = verify_webapp_initdata(body.init_data)
    if not ok:
        raise HTTPException(status_code=401, detail=f"Telegram verification failed: {reason}")

    tg_user = parsed.get("user") or {}
    user = _get_or_create_user_from_telegram(
        db,
        telegram_id=str(tg_user.get("id")),
        username=tg_user.get("username"),
        first_name=tg_user.get("first_name"),
        last_name=tg_user.get("last_name"),
        photo_url=tg_user.get("photo_url"),
    )
    log(db, "auth.webapp", user_id=user.id)
    return TokenOut(access_token=_issue_user_token(user))


@router.post("/admin/login", response_model=TokenOut)
def admin_login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    # Bootstrap admin user in DB if not exists
    admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME, User.is_admin == True).first()  # noqa: E712
    if not admin:
        admin = User(username=settings.ADMIN_USERNAME, is_admin=True, is_active=True, password_hash=hash_password(settings.ADMIN_PASSWORD))
        db.add(admin)
        db.commit()
        db.refresh(admin)

    if username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not admin.password_hash or not verify_password(password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    log(db, "auth.admin_login", user_id=admin.id)
    return TokenOut(access_token=_issue_user_token(admin))


@router.get("/me", response_model=MeOut)
def me(user: User = Depends(get_current_user)):
    return MeOut(
        id=user.id,
        telegram_id=user.telegram_id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        photo_url=user.photo_url,
        email=user.email,
        is_admin=user.is_admin,
    )
