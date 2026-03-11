"""add template_page_layouts table

Revision ID: 002
Revises:
Create Date: 2026-03-11
"""

from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "template_page_layouts",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "template_id",
            sa.String(36),
            sa.ForeignKey("album_templates.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("page_number", sa.Integer(), nullable=False),
        sa.Column("background_image_url", sa.String(500), nullable=True),
        sa.Column("slots", sa.JSON(), nullable=True, server_default="[]"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("template_id", "page_number", name="uq_template_page"),
    )


def downgrade() -> None:
    op.drop_table("template_page_layouts")
