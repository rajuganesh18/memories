from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentCreateRequest, PaymentCreateResponse, PaymentVerifyRequest
from app.services.payment_service import create_razorpay_order, verify_payment

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


@router.post("/create", response_model=PaymentCreateResponse)
def create_payment(
    data: PaymentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_razorpay_order(db, data.order_id, current_user.id)


@router.post("/verify")
def verify(
    data: PaymentVerifyRequest,
    db: Session = Depends(get_db),
):
    return verify_payment(
        db, data.order_id, data.razorpay_payment_id,
        data.razorpay_order_id, data.razorpay_signature,
    )
