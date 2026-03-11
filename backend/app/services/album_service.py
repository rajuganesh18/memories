import os
import uuid

from fastapi import HTTPException, UploadFile, status
from PIL import Image
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.models.album import Album, AlbumPhoto
from app.models.template import TemplateSize


def get_user_albums(db: Session, user_id: str):
    return (
        db.query(Album)
        .options(
            joinedload(Album.template_size)
            .joinedload(TemplateSize.size),
            joinedload(Album.template_size)
            .joinedload(TemplateSize.template),
        )
        .filter(Album.user_id == user_id)
        .order_by(Album.created_at.desc())
        .all()
    )


def get_album_detail(db: Session, album_id: str, user_id: str):
    album = (
        db.query(Album)
        .options(
            joinedload(Album.photos),
            joinedload(Album.template_size)
            .joinedload(TemplateSize.size),
            joinedload(Album.template_size)
            .joinedload(TemplateSize.template),
        )
        .filter(Album.id == album_id, Album.user_id == user_id)
        .first()
    )
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    return album


def create_album(db: Session, user_id: str, template_size_id: str, title: str):
    ts = db.query(TemplateSize).filter(TemplateSize.id == template_size_id).first()
    if not ts or not ts.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unavailable template-size combination",
        )
    album = Album(user_id=user_id, template_size_id=template_size_id, title=title)
    db.add(album)
    db.commit()
    db.refresh(album)
    return get_album_detail(db, album.id, user_id)


def upload_photo(
    db: Session, album_id: str, user_id: str, file: UploadFile, page_number: int, position: int
):
    album = db.query(Album).filter(Album.id == album_id, Album.user_id == user_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    if album.status == "completed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album is already completed")

    # Save file
    album_dir = os.path.join(settings.UPLOAD_DIR, album_id)
    os.makedirs(album_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "photo.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(album_dir, filename)

    # Read and compress image
    img = Image.open(file.file)
    img.thumbnail((2048, 2048))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(filepath, "JPEG", quality=85)

    photo_url = f"/uploads/{album_id}/{filename}"
    photo = AlbumPhoto(
        album_id=album_id,
        photo_url=photo_url,
        page_number=page_number,
        position=position,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


def delete_photo(db: Session, album_id: str, photo_id: str, user_id: str):
    album = db.query(Album).filter(Album.id == album_id, Album.user_id == user_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")

    photo = db.query(AlbumPhoto).filter(AlbumPhoto.id == photo_id, AlbumPhoto.album_id == album_id).first()
    if not photo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")

    # Remove file
    filepath = photo.photo_url.lstrip("/")
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(photo)
    db.commit()


def complete_album(db: Session, album_id: str, user_id: str):
    album = db.query(Album).filter(Album.id == album_id, Album.user_id == user_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    album.status = "completed"
    db.commit()
    db.refresh(album)
    return get_album_detail(db, album.id, user_id)
