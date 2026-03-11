from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse
from app.services.cart_service import (
    add_to_cart,
    clear_cart,
    get_or_create_cart,
    remove_cart_item,
    update_cart_item,
)

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


@router.get("/", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_or_create_cart(db, current_user.id)


@router.post("/items", response_model=CartResponse)
def add_item(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return add_to_cart(db, current_user.id, data.album_id, data.quantity)


@router.put("/items/{item_id}", response_model=CartResponse)
def update_item(
    item_id: str,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_cart_item(db, current_user.id, item_id, data.quantity)


@router.delete("/items/{item_id}", status_code=204)
def remove_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    remove_cart_item(db, current_user.id, item_id)


@router.delete("/", status_code=204)
def clear(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clear_cart(db, current_user.id)
