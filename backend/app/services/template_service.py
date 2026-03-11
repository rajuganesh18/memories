import os
import uuid

from fastapi import HTTPException, UploadFile, status
from PIL import Image
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.models.template import AlbumSize, AlbumTemplate, TemplatePageLayout, TemplateSampleImage, TemplateSize
from app.schemas.template import (
    AlbumSizeCreate,
    AlbumTemplateCreate,
    AlbumTemplateUpdate,
    PageLayoutUpdate,
    TemplateSizeCreate,
    TemplateSizeUpdate,
)


# --- Template operations ---
def get_templates(db: Session, theme: str | None = None, active_only: bool = True):
    query = db.query(AlbumTemplate)
    if active_only:
        query = query.filter(AlbumTemplate.is_active == True)
    if theme:
        query = query.filter(AlbumTemplate.theme == theme)
    return query.order_by(AlbumTemplate.created_at.desc()).all()


def get_template_detail(db: Session, template_id: str):
    template = (
        db.query(AlbumTemplate)
        .options(
            joinedload(AlbumTemplate.template_sizes).joinedload(TemplateSize.size),
            joinedload(AlbumTemplate.sample_images),
            joinedload(AlbumTemplate.page_layouts),
        )
        .filter(AlbumTemplate.id == template_id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return template


def create_template(db: Session, data: AlbumTemplateCreate):
    template = AlbumTemplate(**data.model_dump())
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def update_template(db: Session, template_id: str, data: AlbumTemplateUpdate):
    template = db.query(AlbumTemplate).filter(AlbumTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(template, key, value)
    db.commit()
    db.refresh(template)
    return template


def delete_template(db: Session, template_id: str):
    template = db.query(AlbumTemplate).filter(AlbumTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    db.delete(template)
    db.commit()


# --- Size operations ---
def get_sizes(db: Session):
    return db.query(AlbumSize).filter(AlbumSize.is_active == True).all()


def create_size(db: Session, data: AlbumSizeCreate):
    size = AlbumSize(**data.model_dump())
    db.add(size)
    db.commit()
    db.refresh(size)
    return size


# --- TemplateSize (pricing) operations ---
def create_template_size(db: Session, data: TemplateSizeCreate):
    existing = (
        db.query(TemplateSize)
        .filter(TemplateSize.template_id == data.template_id, TemplateSize.size_id == data.size_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This template-size combination already exists",
        )
    ts = TemplateSize(**data.model_dump())
    db.add(ts)
    db.commit()
    db.refresh(ts)
    return ts


def update_template_size(db: Session, ts_id: str, data: TemplateSizeUpdate):
    ts = db.query(TemplateSize).filter(TemplateSize.id == ts_id).first()
    if not ts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template-size not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ts, key, value)
    db.commit()
    db.refresh(ts)
    return ts


# --- Sample image operations ---
def upload_sample_image(db: Session, template_id: str, file: UploadFile) -> TemplateSampleImage:
    template = db.query(AlbumTemplate).filter(AlbumTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")

    sample_dir = os.path.join(settings.UPLOAD_DIR, "templates", template_id)
    os.makedirs(sample_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "sample.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(sample_dir, filename)

    img = Image.open(file.file)
    img.thumbnail((2048, 2048))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(filepath, "JPEG", quality=85)

    max_order = (
        db.query(TemplateSampleImage.sort_order)
        .filter(TemplateSampleImage.template_id == template_id)
        .order_by(TemplateSampleImage.sort_order.desc())
        .first()
    )
    next_order = (max_order[0] + 1) if max_order else 0

    image_url = f"/uploads/templates/{template_id}/{filename}"
    sample = TemplateSampleImage(
        template_id=template_id,
        image_url=image_url,
        sort_order=next_order,
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)
    return sample


def delete_sample_image(db: Session, template_id: str, image_id: str) -> None:
    sample = (
        db.query(TemplateSampleImage)
        .filter(TemplateSampleImage.id == image_id, TemplateSampleImage.template_id == template_id)
        .first()
    )
    if not sample:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sample image not found")

    filepath = sample.image_url.lstrip("/")
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(sample)
    db.commit()


# --- Page layout operations ---
def upload_page_background(db: Session, template_id: str, page_number: int, file: UploadFile) -> TemplatePageLayout:
    template = db.query(AlbumTemplate).filter(AlbumTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    if page_number < 1 or page_number > template.pages_count:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid page number")

    layout_dir = os.path.join(settings.UPLOAD_DIR, "templates", template_id, "pages")
    os.makedirs(layout_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "page.jpg")[1] or ".jpg"
    filename = f"page_{page_number}_{uuid.uuid4()}{ext}"
    filepath = os.path.join(layout_dir, filename)

    img = Image.open(file.file)
    img.thumbnail((2048, 2048))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(filepath, "JPEG", quality=90)

    bg_url = f"/uploads/templates/{template_id}/pages/{filename}"

    layout = (
        db.query(TemplatePageLayout)
        .filter(TemplatePageLayout.template_id == template_id, TemplatePageLayout.page_number == page_number)
        .first()
    )
    if layout:
        # Remove old background file
        if layout.background_image_url:
            old_path = layout.background_image_url.lstrip("/")
            if os.path.exists(old_path):
                os.remove(old_path)
        layout.background_image_url = bg_url
    else:
        layout = TemplatePageLayout(
            template_id=template_id,
            page_number=page_number,
            background_image_url=bg_url,
            slots=[],
        )
        db.add(layout)

    db.commit()
    db.refresh(layout)
    return layout


def update_page_slots(db: Session, template_id: str, page_number: int, data: PageLayoutUpdate) -> TemplatePageLayout:
    layout = (
        db.query(TemplatePageLayout)
        .filter(TemplatePageLayout.template_id == template_id, TemplatePageLayout.page_number == page_number)
        .first()
    )
    if not layout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page layout not found. Upload a background first.")

    layout.slots = [s.model_dump() for s in data.slots]
    db.commit()
    db.refresh(layout)
    return layout


def delete_page_layout(db: Session, template_id: str, page_number: int) -> None:
    layout = (
        db.query(TemplatePageLayout)
        .filter(TemplatePageLayout.template_id == template_id, TemplatePageLayout.page_number == page_number)
        .first()
    )
    if not layout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page layout not found")

    if layout.background_image_url:
        filepath = layout.background_image_url.lstrip("/")
        if os.path.exists(filepath):
            os.remove(filepath)

    db.delete(layout)
    db.commit()
