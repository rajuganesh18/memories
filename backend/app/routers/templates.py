from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.template import AlbumTemplateDetailResponse, AlbumTemplateResponse
from app.services.template_service import get_template_detail, get_templates

router = APIRouter(prefix="/api/v1/templates", tags=["templates"])


@router.get("/", response_model=list[AlbumTemplateResponse])
def list_templates(
    theme: str | None = Query(None, description="Filter by theme"),
    db: Session = Depends(get_db),
):
    return get_templates(db, theme=theme)


@router.get("/{template_id}", response_model=AlbumTemplateDetailResponse)
def get_template(template_id: str, db: Session = Depends(get_db)):
    return get_template_detail(db, template_id)
