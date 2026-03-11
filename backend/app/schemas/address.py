from pydantic import BaseModel


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressUpdate(AddressCreate):
    pass


class AddressResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    address_line1: str
    address_line2: str | None
    city: str
    state: str
    pincode: str
    is_default: bool

    model_config = {"from_attributes": True}
