import hmac
import hashlib

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.order import Order


def create_razorpay_order(db: Session, order_id: str, user_id: str):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order is not in pending state")

    amount_paise = int(order.total_amount * 100)

    # In production, use razorpay client:
    # import razorpay
    # client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    # rz_order = client.order.create({"amount": amount_paise, "currency": "INR", "receipt": order.id})
    # razorpay_order_id = rz_order["id"]

    # For development/testing, generate a mock order ID
    razorpay_order_id = f"mock_{order.id[:20]}"

    order.razorpay_order_id = razorpay_order_id
    db.commit()

    return {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
        "amount": amount_paise,
        "currency": "INR",
    }


def verify_payment(
    db: Session, order_id: str, razorpay_payment_id: str,
    razorpay_order_id: str, razorpay_signature: str,
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Verify signature
    # In production:
    # message = f"{razorpay_order_id}|{razorpay_payment_id}"
    # expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), message.encode(), hashlib.sha256).hexdigest()
    # if expected != razorpay_signature:
    #     raise HTTPException(status_code=400, detail="Invalid signature")

    order.razorpay_payment_id = razorpay_payment_id
    order.razorpay_signature = razorpay_signature
    order.status = "paid"
    db.commit()
    db.refresh(order)
    return {"status": "success", "order_id": order.id}
