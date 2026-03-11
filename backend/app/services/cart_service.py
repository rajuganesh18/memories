from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.album import Album
from app.models.cart import Cart, CartItem
from app.models.template import TemplateSize


def get_or_create_cart(db: Session, user_id: str) -> Cart:
    cart = (
        db.query(Cart)
        .options(
            joinedload(Cart.items)
            .joinedload(CartItem.album)
            .joinedload(Album.template_size)
            .joinedload(TemplateSize.size),
            joinedload(Cart.items)
            .joinedload(CartItem.album)
            .joinedload(Album.template_size)
            .joinedload(TemplateSize.template),
        )
        .filter(Cart.user_id == user_id)
        .first()
    )
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        cart.items = []
    return cart


def add_to_cart(db: Session, user_id: str, album_id: str, quantity: int):
    album = db.query(Album).filter(Album.id == album_id, Album.user_id == user_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    if album.status != "completed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album must be completed before adding to cart")

    cart = get_or_create_cart(db, user_id)
    existing = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.album_id == album_id).first()
    if existing:
        existing.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, album_id=album_id, quantity=quantity)
        db.add(item)
    db.commit()
    return get_or_create_cart(db, user_id)


def update_cart_item(db: Session, user_id: str, item_id: str, quantity: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity
    db.commit()
    return get_or_create_cart(db, user_id)


def remove_cart_item(db: Session, user_id: str, item_id: str):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    db.delete(item)
    db.commit()


def clear_cart(db: Session, user_id: str):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if cart:
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
