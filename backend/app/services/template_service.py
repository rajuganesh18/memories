from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.template import AlbumSize, AlbumTemplate, TemplateSize
from app.schemas.template import (
    AlbumSizeCreate,
    AlbumTemplateCreate,
    AlbumTemplateUpdate,
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
        .options(joinedload(AlbumTemplate.template_sizes).joinedload(TemplateSize.size))
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
