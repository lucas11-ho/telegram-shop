from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    telegram_id = Column(String(64), unique=True, index=True, nullable=True)
    username = Column(String(64), index=True, nullable=True)
    first_name = Column(String(128), nullable=True)
    last_name = Column(String(128), nullable=True)
    photo_url = Column(String(512), nullable=True)
    email = Column(String(256), nullable=True)
    password_hash = Column(String(256), nullable=True)

    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    products = relationship("Product", back_populates="owner", cascade="all,delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all,delete-orphan")
    logs = relationship("LogEntry", back_populates="user", cascade="all,delete-orphan")
