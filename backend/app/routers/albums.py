from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.album import AlbumCreate, AlbumDetailResponse, AlbumPhotoResponse, AlbumResponse
from app.services.album_service import (
    complete_album,
    create_album,
    delete_photo,
    get_album_detail,
    get_user_albums,
    upload_photo,
)

router = APIRouter(prefix="/api/v1/albums", tags=["albums"])


@router.post("/", response_model=AlbumDetailResponse, status_code=201)
def create(
    data: AlbumCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_album(db, current_user.id, data.template_size_id, data.title)


@router.get("/", response_model=list[AlbumResponse])
def list_albums(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_albums(db, current_user.id)


@router.get("/{album_id}", response_model=AlbumDetailResponse)
def get_album(
    album_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_album_detail(db, album_id, current_user.id)


@router.post("/{album_id}/photos", response_model=AlbumPhotoResponse, status_code=201)
def upload_album_photo(
    album_id: str,
    file: UploadFile = File(...),
    page_number: int = Form(1),
    position: int = Form(0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return upload_photo(db, album_id, current_user.id, file, page_number, position)


@router.delete("/{album_id}/photos/{photo_id}", status_code=204)
def remove_photo(
    album_id: str,
    photo_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_photo(db, album_id, photo_id, current_user.id)


@router.put("/{album_id}/complete", response_model=AlbumDetailResponse)
def mark_complete(
    album_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return complete_album(db, album_id, current_user.id)
