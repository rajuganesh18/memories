from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class AlbumCreate(BaseModel):
    template_size_id: str
    title: str


class AlbumPhotoResponse(BaseModel):
    id: str
    photo_url: str
    page_number: int
    position: int
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class AlbumTemplateSizeInfo(BaseModel):
    id: str
    price: Decimal
    size: "AlbumSizeInfo"
    template: "AlbumTemplateInfo"

    model_config = {"from_attributes": True}


class AlbumSizeInfo(BaseModel):
    id: str
    label: str
    width_inches: Decimal
    height_inches: Decimal

    model_config = {"from_attributes": True}


class AlbumTemplateInfo(BaseModel):
    id: str
    name: str
    theme: str
    pages_count: int
    photos_per_page: int

    model_config = {"from_attributes": True}


class AlbumResponse(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime
    template_size: AlbumTemplateSizeInfo

    model_config = {"from_attributes": True}


class AlbumDetailResponse(AlbumResponse):
    photos: list[AlbumPhotoResponse]
