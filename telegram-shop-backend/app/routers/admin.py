from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.db.session import get_db
from app.models import LogEntry, Order, Product, User
from app.services.logger import log

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "telegram_id": u.telegram_id,
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "is_admin": u.is_admin,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.is_active = not bool(u.is_active)
    db.commit()
    log(db, "admin.user.toggle_active", user_id=admin.id, meta={"target_user_id": user_id, "is_active": u.is_active})
    return {"ok": True, "is_active": u.is_active}


@router.get("/products")
def list_products(db: Session = Depends(get_db), admin=Depends(require_admin)):
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "owner_id": p.owner_id,
            "name": p.name,
            "price": p.price,
            "currency": p.currency,
            "is_active": bool(p.is_active),
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in products
    ]


@router.patch("/products/{product_id}/toggle-active")
def toggle_product_active(product_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.is_active = 0 if p.is_active == 1 else 1
    db.commit()
    log(db, "admin.product.toggle_active", user_id=admin.id, meta={"product_id": product_id, "is_active": bool(p.is_active)})
    return {"ok": True, "is_active": bool(p.is_active)}


@router.get("/orders")
def list_orders(db: Session = Depends(get_db), admin=Depends(require_admin)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "user_id": o.user_id,
            "total_price": o.total_price,
            "currency": o.currency,
            "payment_status": o.payment_status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]


@router.patch("/orders/{order_id}/set-status")
def set_order_status(order_id: int, status: str, db: Session = Depends(get_db), admin=Depends(require_admin)):
    if status not in {"pending", "paid", "failed", "refunded"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    o = db.query(Order).filter(Order.id == order_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    o.payment_status = status
    db.commit()
    log(db, "admin.order.set_status", user_id=admin.id, meta={"order_id": order_id, "status": status})
    return {"ok": True}


@router.get("/logs")
def list_logs(db: Session = Depends(get_db), admin=Depends(require_admin), limit: int = 200):
    logs_q = db.query(LogEntry).order_by(LogEntry.created_at.desc()).limit(min(limit, 500)).all()
    return [
        {
            "id": l.id,
            "user_id": l.user_id,
            "action": l.action,
            "meta": l.meta,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }
        for l in logs_q
    ]
