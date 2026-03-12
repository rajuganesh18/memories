import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AlbumTemplate(Base):
    __tablename__ = "album_templates"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    theme: Mapped[str] = mapped_column(String(50), index=True)
    cover_image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    photos_required: Mapped[int] = mapped_column(Integer, default=20)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    template_sizes: Mapped[list["TemplateSize"]] = relationship(
        back_populates="template", cascade="all, delete-orphan"
    )
    sample_images: Mapped[list["TemplateSampleImage"]] = relationship(
        back_populates="template", cascade="all, delete-orphan", order_by="TemplateSampleImage.sort_order"
    )


class AlbumSize(Base):
    __tablename__ = "album_sizes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    label: Mapped[str] = mapped_column(String(50))
    width_inches: Mapped[Decimal] = mapped_column(Numeric(5, 1))
    height_inches: Mapped[Decimal] = mapped_column(Numeric(5, 1))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    template_sizes: Mapped[list["TemplateSize"]] = relationship(
        back_populates="size"
    )


class TemplateSize(Base):
    __tablename__ = "template_sizes"
    __table_args__ = (
        UniqueConstraint("template_id", "size_id", name="uq_template_size"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    template_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("album_templates.id", ondelete="CASCADE")
    )
    size_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("album_sizes.id", ondelete="CASCADE")
    )
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    template: Mapped["AlbumTemplate"] = relationship(back_populates="template_sizes")
    size: Mapped["AlbumSize"] = relationship(back_populates="template_sizes")


class TemplateSampleImage(Base):
    __tablename__ = "template_sample_images"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    template_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("album_templates.id", ondelete="CASCADE"), index=True
    )
    image_url: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    template: Mapped["AlbumTemplate"] = relationship(back_populates="sample_images")


