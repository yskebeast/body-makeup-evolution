from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # SQL logging
    pool_pre_ping=True,  # Connection health check
    pool_recycle=3600,  # Recreate connection every hour
)

# Create session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
