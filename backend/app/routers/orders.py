from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import Order, OrderItem, Product, User
from app.services.logger import log

router = APIRouter(prefix="/orders", tags=["orders"])


class CreateOrderItem(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=100)


class CreateOrderBody(BaseModel):
    items: List[CreateOrderItem]
    currency: str = "USD"


class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    currency: str

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    total_price: float
    currency: str
    payment_status: str
    items: List[OrderItemOut]

    class Config:
        from_attributes = True


@router.post("", response_model=OrderOut)
def create_order(
    body: CreateOrderBody,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not body.items:
        raise HTTPException(status_code=400, detail="No items")

    total = 0.0
    items_to_create: list[OrderItem] = []

    for it in body.items:
        p = db.query(Product).filter(Product.id == it.product_id, Product.is_active == 1).first()
        if not p:
            raise HTTPException(status_code=404, detail=f"Product {it.product_id} not found")
        if p.currency != body.currency:
            raise HTTPException(status_code=400, detail=f"Currency mismatch for product {p.id}")
        total += float(p.price) * int(it.quantity)
        items_to_create.append(OrderItem(product_id=p.id, quantity=it.quantity, unit_price=p.price, currency=p.currency))

    order = Order(user_id=user.id, total_price=total, currency=body.currency, payment_status="pending")
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in items_to_create:
        item.order_id = order.id
        db.add(item)
    db.commit()
    db.refresh(order)

    log(db, "order.create", user_id=user.id, meta={"order_id": order.id, "total": total})
    return order


@router.get("/mine", response_model=List[OrderOut])
def list_my_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
