import logging

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import User

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
