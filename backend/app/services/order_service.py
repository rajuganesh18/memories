from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.address import Address
from app.models.album import Album
from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem
from app.models.template import TemplateSize


def create_order(db: Session, user_id: str, address_id: str) -> Order:
    # Validate address
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user_id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Address not found")

    # Get cart
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.album).joinedload(Album.template_size))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if not cart or not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    # Calculate total and create order items
    total = Decimal("0")
    order_items = []
    for cart_item in cart.items:
        price = cart_item.album.template_size.price
        total += price * cart_item.quantity
        order_items.append(OrderItem(
            album_id=cart_item.album_id,
            quantity=cart_item.quantity,
            unit_price=price,
        ))

    order = Order(user_id=user_id, address_id=address_id, total_amount=total)
    order.items = order_items
    db.add(order)

    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)
    return _load_order(db, order.id)


def get_user_orders(db: Session, user_id: str):
    return (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.album)
            .joinedload(Album.template_size).joinedload(TemplateSize.size),
            joinedload(Order.items).joinedload(OrderItem.album)
            .joinedload(Album.template_size).joinedload(TemplateSize.template),
            joinedload(Order.address),
        )
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order_detail(db: Session, order_id: str, user_id: str | None = None):
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.album)
        .joinedload(Album.template_size).joinedload(TemplateSize.size),
        joinedload(Order.items).joinedload(OrderItem.album)
        .joinedload(Album.template_size).joinedload(TemplateSize.template),
        joinedload(Order.address),
    )
    if user_id:
        query = query.filter(Order.user_id == user_id)
    order = query.filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def get_all_orders(db: Session, order_status: str | None = None):
    query = db.query(Order).options(
        joinedload(Order.items), joinedload(Order.address),
    )
    if order_status:
        query = query.filter(Order.status == order_status)
    return query.order_by(Order.created_at.desc()).all()


def update_order_status(db: Session, order_id: str, new_status: str):
    valid_statuses = {"pending", "paid", "processing", "shipped", "delivered", "cancelled"}
    if new_status not in valid_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status: {new_status}")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order


def _load_order(db: Session, order_id: str):
    return (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.album)
            .joinedload(Album.template_size).joinedload(TemplateSize.size),
            joinedload(Order.items).joinedload(OrderItem.album)
            .joinedload(Album.template_size).joinedload(TemplateSize.template),
            joinedload(Order.address),
        )
        .filter(Order.id == order_id)
        .first()
    )
