from pydantic import BaseModel

from app.schemas.album import AlbumResponse


class CartItemAdd(BaseModel):
    album_id: str
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: str
    album: AlbumResponse
    quantity: int

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    id: str
    items: list[CartItemResponse]

    model_config = {"from_attributes": True}
