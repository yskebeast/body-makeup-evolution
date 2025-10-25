from sqlalchemy.ext.declarative import declarative_base

# Create a shared Base class for all models
Base = declarative_base()

# Import all models AFTER Base is defined to ensure they're registered with SQLAlchemy
# This must happen after Base is created to avoid circular imports
def import_models():
    from app.models.auth import User
    from app.models.daily import DailyRecord, Memo
    return User, DailyRecord, Memo

__all__ = ["Base"]
