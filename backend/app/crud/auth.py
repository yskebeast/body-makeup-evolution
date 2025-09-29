from sqlalchemy.orm import Session
from app.models import auth as models
from app.schemas import auth as schemas
from app.core.security import get_password_hash, verify_password


def get_user(db: Session, user_id: int):
    """get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    """get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()


def update_user(db: Session, user_id: int, user_name: str, email: str):
    """update user information"""
    result = db.query(models.User).filter(models.User.id == user_id).update({"name": user_name, "email": email})
    db.commit()

    if result == 0:
        return None

    return db.query(models.User).filter(models.User.id == user_id).first()


def update_user_password(db: Session, password_update: schemas.PasswordUpdate):
    """update user password"""
    try:
        user = db.query(models.User).filter(models.User.id == password_update.user_id).first()
        if not user or not verify_password(password_update.current_password, str(user.hashed_password)):
            raise ValueError("Current password is incorrect")

        hashed_password = get_password_hash(password_update.new_password)
        db.query(models.User).filter(models.User.id == password_update.user_id).update(
            {"hashed_password": hashed_password}
        )
        db.commit()

        return {"message": "Password updated successfully", "status": "success"}
    except Exception as e:
        db.rollback()
        raise e


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """get user list"""
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password, is_active=user.is_active)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    """delete user"""
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
