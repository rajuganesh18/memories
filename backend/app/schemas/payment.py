from pydantic import BaseModel


class PaymentCreateRequest(BaseModel):
    order_id: str


class PaymentCreateResponse(BaseModel):
    razorpay_order_id: str
    razorpay_key_id: str
    amount: int
    currency: str


class PaymentVerifyRequest(BaseModel):
    order_id: str
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
