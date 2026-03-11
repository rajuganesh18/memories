import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Album(Base):
    __tablename__ = "albums"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    template_size_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("template_sizes.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft / completed
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    photos: Mapped[list["AlbumPhoto"]] = relationship(
        back_populates="album", cascade="all, delete-orphan", order_by="AlbumPhoto.page_number, AlbumPhoto.position"
    )
    template_size = relationship("TemplateSize", lazy="joined")


class AlbumPhoto(Base):
    __tablename__ = "album_photos"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    album_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("albums.id", ondelete="CASCADE"), index=True
    )
    photo_url: Mapped[str] = mapped_column(String(500))
    page_number: Mapped[int] = mapped_column(Integer, default=1)
    position: Mapped[int] = mapped_column(Integer, default=0)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    album: Mapped["Album"] = relationship(back_populates="photos")
