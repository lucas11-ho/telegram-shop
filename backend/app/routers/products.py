import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import Product, ProductImage, User
from app.services.logger import log

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


class ProductImageOut(BaseModel):
    id: int
    url: str
    sort_order: int

    class Config:
        from_attributes = True


class ProductOut(BaseModel):
    id: int
    owner_id: int
    name: str
    description: Optional[str] = None
    price: float
    currency: str
    payment_instructions: Optional[str] = None
    images: List[ProductImageOut] = []

    class Config:
        from_attributes = True


@router.get("", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active == 1).order_by(Product.created_at.desc()).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p or p.is_active != 1:
        raise HTTPException(status_code=404, detail="Product not found")
    return p


@router.post("", response_model=ProductOut)
def create_product(
    name: str = Form(...),
    price: float = Form(...),
    currency: str = Form("USD"),
    description: str | None = Form(None),
    payment_instructions: str | None = Form(None),
    images: List[UploadFile] | None = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = Product(
        owner_id=user.id,
        name=name,
        price=price,
        currency=currency,
        description=description,
        payment_instructions=payment_instructions,
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    if images:
        for idx, file in enumerate(images):
            ext = os.path.splitext(file.filename or "")[1].lower() or ".jpg"
            fname = f"{uuid.uuid4().hex}{ext}"
            path = os.path.join(UPLOAD_DIR, fname)
            with open(path, "wb") as f:
                f.write(file.file.read())
            img = ProductImage(product_id=p.id, url=f"/static/{fname}", sort_order=idx)
            db.add(img)
        db.commit()
        db.refresh(p)

    log(db, "product.create", user_id=user.id, meta={"product_id": p.id})
    return p


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if not (user.is_admin or p.owner_id == user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    p.is_active = 0
    db.commit()
    log(db, "product.delete", user_id=user.id, meta={"product_id": p.id})
    return {"ok": True}
