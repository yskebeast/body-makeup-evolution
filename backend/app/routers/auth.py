from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.config import settings
from app.core.security import create_access_token, get_current_active_user
from app.core.password import verify_password
from app.schemas import auth as schemas
from app.crud import auth as crud
from app.database.connection import get_db

router = APIRouter()


@router.post("/register/", response_model=schemas.User)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.post("/login/", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=user_credentials.email)

    if not user or not verify_password(user_credentials.password, str(user.hashed_password)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "name": user.name}, expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_access_token(data={"sub": str(user.id)}, expires_delta=refresh_token_expires)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": int(access_token_expires.total_seconds()),
        "refresh_expires_in": int(refresh_token_expires.total_seconds()),
    }


@router.get("/userinfo/", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user


@router.patch("/profile/update/", response_model=schemas.UserUpdateResponse)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    if user_update.name is None or user_update.email is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name and email cannot be None")

    user = crud.update_user(db, user_update.user_id, user_update.name, user_update.email)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "email": user.email,
        "name": user.name,
    }


@router.patch("/password/update/", response_model=schemas.PasswordUpdateResponse)
def update_password(password_update: schemas.PasswordUpdate, db: Session = Depends(get_db)):

    return crud.update_user_password(db=db, password_update=password_update)


@router.post("/refresh/", response_model=schemas.TokenRefresh)
async def refresh_token(request: Request, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    print(f"Received refresh token: {refresh_token[:20]}...")

    try:
        if not settings.SECRET_KEY:
            raise ValueError("SECRET_KEY is not set in environment variables")

        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not isinstance(user_id, str):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        try:
            user_id = int(user_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    # 新しいアクセストークンを生成
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "name": user.name}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": int(access_token_expires.total_seconds()),
    }
