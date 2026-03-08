from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_admin_user
from app.models.user import User
from app.schemas.template import (
    AlbumSizeCreate,
    AlbumSizeResponse,
    AlbumTemplateCreate,
    AlbumTemplateDetailResponse,
    AlbumTemplateResponse,
    AlbumTemplateUpdate,
    TemplateSizeCreate,
    TemplateSizeUpdate,
)
from app.services.template_service import (
    create_size,
    create_template,
    create_template_size,
    delete_template,
    get_sizes,
    get_template_detail,
    get_templates,
    update_template,
    update_template_size,
)

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["admin"],
    dependencies=[Depends(get_admin_user)],
)


# --- Templates ---
@router.get("/templates", response_model=list[AlbumTemplateResponse])
def admin_list_templates(db: Session = Depends(get_db)):
    return get_templates(db, active_only=False)


@router.post("/templates", response_model=AlbumTemplateResponse, status_code=201)
def admin_create_template(
    data: AlbumTemplateCreate, db: Session = Depends(get_db)
):
    return create_template(db, data)


@router.get("/templates/{template_id}", response_model=AlbumTemplateDetailResponse)
def admin_get_template(template_id: str, db: Session = Depends(get_db)):
    return get_template_detail(db, template_id)


@router.put("/templates/{template_id}", response_model=AlbumTemplateResponse)
def admin_update_template(
    template_id: str, data: AlbumTemplateUpdate, db: Session = Depends(get_db)
):
    return update_template(db, template_id, data)


@router.delete("/templates/{template_id}", status_code=204)
def admin_delete_template(template_id: str, db: Session = Depends(get_db)):
    delete_template(db, template_id)


# --- Sizes ---
@router.get("/sizes", response_model=list[AlbumSizeResponse])
def admin_list_sizes(db: Session = Depends(get_db)):
    return get_sizes(db)


@router.post("/sizes", response_model=AlbumSizeResponse, status_code=201)
def admin_create_size(data: AlbumSizeCreate, db: Session = Depends(get_db)):
    return create_size(db, data)


# --- Template-Size pricing ---
@router.post("/template-sizes", status_code=201)
def admin_create_template_size(
    data: TemplateSizeCreate, db: Session = Depends(get_db)
):
    return create_template_size(db, data)


@router.put("/template-sizes/{ts_id}")
def admin_update_template_size(
    ts_id: str, data: TemplateSizeUpdate, db: Session = Depends(get_db)
):
    return update_template_size(db, ts_id, data)
