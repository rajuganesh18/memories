import logging
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import User
from app.models.template import AlbumTemplate, AlbumSize, TemplateSize, TemplateSampleImage

logger = logging.getLogger(__name__)


def seed_admin_user() -> None:
    """Create the initial admin user from ADMIN_EMAIL / ADMIN_PASSWORD env vars.

    Skips silently if the env vars are not set or the user already exists.
    """
    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        logger.info("ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed")
        return

    db: Session = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if existing:
            if not existing.is_admin:
                existing.is_admin = True
                db.commit()
                logger.info("Existing user %s promoted to admin", settings.ADMIN_EMAIL)
            else:
                logger.info("Admin user %s already exists", settings.ADMIN_EMAIL)
            return

        admin = User(
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            full_name="Admin",
            is_admin=True,
        )
        db.add(admin)
        db.commit()
        logger.info("Created admin user %s", settings.ADMIN_EMAIL)
    finally:
        db.close()


TEMPLATE_DATA = [
    {
        "name": "Little Star",
        "description": "A minimal album for baby's first year — soft stars, clouds, and gentle doodles on clean white pages.",
        "theme": "baby",
        "photos_required": 20,
    },
    {
        "name": "Tiny Steps",
        "description": "Capture every adorable milestone with whimsical hand-drawn rattles, hearts, and footprints.",
        "theme": "baby",
        "photos_required": 24,
    },
    {
        "name": "Forever Yours",
        "description": "Elegant floral doodles and delicate rings frame your most cherished wedding moments.",
        "theme": "wedding",
        "photos_required": 30,
    },
    {
        "name": "Two Hearts",
        "description": "Minimal hand-drawn hearts and botanical sketches for a timeless wedding keepsake.",
        "theme": "wedding",
        "photos_required": 24,
    },
    {
        "name": "Wanderlust",
        "description": "Compass roses, mountain silhouettes, and paper planes frame your travel adventures.",
        "theme": "travel",
        "photos_required": 20,
    },
    {
        "name": "Passport Stamps",
        "description": "Minimal postcard-style doodles and map sketches for your journey memories.",
        "theme": "travel",
        "photos_required": 24,
    },
    {
        "name": "Make a Wish",
        "description": "Playful balloons, confetti dots, and cake doodles for birthday celebrations.",
        "theme": "birthday",
        "photos_required": 20,
    },
    {
        "name": "Party Time",
        "description": "Fun hand-drawn streamers, stars, and gift boxes surround your birthday memories.",
        "theme": "birthday",
        "photos_required": 24,
    },
    {
        "name": "Our Roots",
        "description": "Gentle tree branches, leaves, and heart doodles weave your family story together.",
        "theme": "family",
        "photos_required": 24,
    },
    {
        "name": "Together",
        "description": "Minimal house sketches, connected hearts, and warm hand-drawn frames for family memories.",
        "theme": "family",
        "photos_required": 20,
    },
    {
        "name": "The Next Chapter",
        "description": "Graduation caps, open books, and star doodles celebrate academic achievements.",
        "theme": "graduation",
        "photos_required": 20,
    },
    {
        "name": "Class of Dreams",
        "description": "Minimal diploma scrolls, laurel wreaths, and constellation doodles for your milestone.",
        "theme": "graduation",
        "photos_required": 24,
    },
]

SIZE_DATA = [
    {"label": "8 x 8 inches", "width_inches": Decimal("8.0"), "height_inches": Decimal("8.0")},
    {"label": "10 x 10 inches", "width_inches": Decimal("10.0"), "height_inches": Decimal("10.0")},
    {"label": "12 x 12 inches", "width_inches": Decimal("12.0"), "height_inches": Decimal("12.0")},
]

PRICE_MAP = {
    "8 x 8 inches": Decimal("1299.00"),
    "10 x 10 inches": Decimal("1799.00"),
    "12 x 12 inches": Decimal("2499.00"),
}


def seed_templates() -> None:
    """Delete all existing templates and create fresh minimal doodle templates."""
    db: Session = SessionLocal()
    try:
        # Delete all existing templates (cascade deletes sizes, sample images)
        db.query(TemplateSampleImage).delete()
        db.query(TemplateSize).delete()
        db.query(AlbumTemplate).delete()
        db.query(AlbumSize).delete()
        db.commit()
        logger.info("Deleted all existing templates and sizes")

        # Create sizes
        sizes = {}
        for size_data in SIZE_DATA:
            size = AlbumSize(**size_data)
            db.add(size)
            db.flush()
            sizes[size_data["label"]] = size
        db.commit()
        logger.info("Created %d album sizes", len(sizes))

        # Create templates with pricing
        for tmpl_data in TEMPLATE_DATA:
            template = AlbumTemplate(**tmpl_data)
            db.add(template)
            db.flush()

            for label, size in sizes.items():
                ts = TemplateSize(
                    template_id=template.id,
                    size_id=size.id,
                    price=PRICE_MAP[label],
                )
                db.add(ts)

        db.commit()
        logger.info("Created %d album templates with pricing", len(TEMPLATE_DATA))
    finally:
        db.close()
