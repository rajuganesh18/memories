"""Remove page layouts, replace pages_count and photos_per_page with photos_required

Revision ID: 003
Revises: 002
Create Date: 2026-03-12
"""

from alembic import op
import sqlalchemy as sa

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_table("template_page_layouts")
    op.add_column("album_templates", sa.Column("photos_required", sa.Integer(), server_default="20", nullable=False))
    op.drop_column("album_templates", "pages_count")
    op.drop_column("album_templates", "photos_per_page")


def downgrade() -> None:
    op.add_column("album_templates", sa.Column("photos_per_page", sa.Integer(), server_default="1", nullable=False))
    op.add_column("album_templates", sa.Column("pages_count", sa.Integer(), server_default="20", nullable=False))
    op.drop_column("album_templates", "photos_required")
    op.create_table(
        "template_page_layouts",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("template_id", sa.String(36), sa.ForeignKey("album_templates.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("page_number", sa.Integer(), nullable=False),
        sa.Column("background_image_url", sa.String(500), nullable=True),
        sa.Column("slots", sa.JSON(), nullable=True, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("template_id", "page_number", name="uq_template_page"),
    )
