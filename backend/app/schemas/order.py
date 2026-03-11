from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.address import AddressResponse
from app.schemas.album import AlbumResponse


class OrderCreate(BaseModel):
    address_id: str


class OrderItemResponse(BaseModel):
    id: str
    album: AlbumResponse
    quantity: int
    unit_price: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: str
    total_amount: Decimal
    status: str
    razorpay_order_id: str | None
    created_at: datetime
    address: AddressResponse
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: str
