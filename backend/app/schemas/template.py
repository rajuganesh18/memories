from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel


# --- AlbumSize schemas ---
class AlbumSizeCreate(BaseModel):
    label: str
    width_inches: Decimal
    height_inches: Decimal


class AlbumSizeResponse(BaseModel):
    id: str
    label: str
    width_inches: Decimal
    height_inches: Decimal
    is_active: bool

    model_config = {"from_attributes": True}


# --- TemplateSize schemas ---
class TemplateSizeCreate(BaseModel):
    template_id: str
    size_id: str
    price: Decimal


class TemplateSizeResponse(BaseModel):
    id: str
    size: AlbumSizeResponse
    price: Decimal
    is_available: bool

    model_config = {"from_attributes": True}


class TemplateSizeUpdate(BaseModel):
    price: Decimal | None = None
    is_available: bool | None = None


# --- AlbumTemplate schemas ---
class AlbumTemplateCreate(BaseModel):
    name: str
    description: str | None = None
    theme: str
    cover_image_url: str | None = None
    pages_count: int = 20


class AlbumTemplateUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    theme: str | None = None
    cover_image_url: str | None = None
    pages_count: int | None = None
    is_active: bool | None = None


class AlbumTemplateResponse(BaseModel):
    id: str
    name: str
    description: str | None
    theme: str
    cover_image_url: str | None
    pages_count: int
    photos_per_page: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SampleImageResponse(BaseModel):
    id: str
    image_url: str
    sort_order: int

    model_config = {"from_attributes": True}


# --- TemplatePageLayout schemas ---
class SlotPosition(BaseModel):
    x: float  # percentage 0-100
    y: float
    width: float
    height: float
    shape: Literal["rect", "circle", "ellipse"] = "rect"
    rotation: float = 0  # degrees


class PageLayoutResponse(BaseModel):
    id: str
    page_number: int
    background_image_url: str | None
    slots: list[SlotPosition]

    model_config = {"from_attributes": True}


class PageLayoutUpdate(BaseModel):
    slots: list[SlotPosition]


class AlbumTemplateDetailResponse(AlbumTemplateResponse):
    template_sizes: list[TemplateSizeResponse]
    sample_images: list[SampleImageResponse] = []
    page_layouts: list[PageLayoutResponse] = []
