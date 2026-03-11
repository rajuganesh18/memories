"""initial schema - all base tables

Revision ID: 001
Revises:
Create Date: 2026-03-11
"""

from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("is_admin", sa.Boolean(), server_default=sa.false()),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # album_templates
    op.create_table(
        "album_templates",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("theme", sa.String(50), nullable=False, index=True),
        sa.Column("cover_image_url", sa.String(500), nullable=True),
        sa.Column("pages_count", sa.Integer(), server_default="20"),
        sa.Column("photos_per_page", sa.Integer(), server_default="1"),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # album_sizes
    op.create_table(
        "album_sizes",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("label", sa.String(50), nullable=False),
        sa.Column("width_inches", sa.Numeric(5, 1), nullable=False),
        sa.Column("height_inches", sa.Numeric(5, 1), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true()),
    )

    # template_sizes
    op.create_table(
        "template_sizes",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "template_id",
            sa.String(36),
            sa.ForeignKey("album_templates.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "size_id",
            sa.String(36),
            sa.ForeignKey("album_sizes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_available", sa.Boolean(), server_default=sa.true()),
        sa.UniqueConstraint("template_id", "size_id", name="uq_template_size"),
    )

    # template_sample_images
    op.create_table(
        "template_sample_images",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "template_id",
            sa.String(36),
            sa.ForeignKey("album_templates.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("image_url", sa.String(500), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # albums
    op.create_table(
        "albums",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "template_size_id",
            sa.String(36),
            sa.ForeignKey("template_sizes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("status", sa.String(20), server_default="'draft'"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # album_photos
    op.create_table(
        "album_photos",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "album_id",
            sa.String(36),
            sa.ForeignKey("albums.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("photo_url", sa.String(500), nullable=False),
        sa.Column("page_number", sa.Integer(), server_default="1"),
        sa.Column("position", sa.Integer(), server_default="0"),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # addresses
    op.create_table(
        "addresses",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("address_line1", sa.String(255), nullable=False),
        sa.Column("address_line2", sa.String(255), nullable=True),
        sa.Column("city", sa.String(100), nullable=False),
        sa.Column("state", sa.String(100), nullable=False),
        sa.Column("pincode", sa.String(10), nullable=False),
        sa.Column("is_default", sa.Boolean(), server_default=sa.false()),
    )

    # carts
    op.create_table(
        "carts",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # cart_items
    op.create_table(
        "cart_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "cart_id",
            sa.String(36),
            sa.ForeignKey("carts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "album_id",
            sa.String(36),
            sa.ForeignKey("albums.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("quantity", sa.Integer(), server_default="1"),
    )

    # orders
    op.create_table(
        "orders",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "address_id",
            sa.String(36),
            sa.ForeignKey("addresses.id"),
            nullable=False,
        ),
        sa.Column("total_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.String(20), server_default="'pending'"),
        sa.Column("razorpay_order_id", sa.String(100), nullable=True),
        sa.Column("razorpay_payment_id", sa.String(100), nullable=True),
        sa.Column("razorpay_signature", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # order_items
    op.create_table(
        "order_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "order_id",
            sa.String(36),
            sa.ForeignKey("orders.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "album_id",
            sa.String(36),
            sa.ForeignKey("albums.id"),
            nullable=False,
        ),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("cart_items")
    op.drop_table("carts")
    op.drop_table("addresses")
    op.drop_table("album_photos")
    op.drop_table("albums")
    op.drop_table("template_sample_images")
    op.drop_table("template_sizes")
    op.drop_table("album_sizes")
    op.drop_table("album_templates")
    op.drop_table("users")
