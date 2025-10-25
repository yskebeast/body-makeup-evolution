from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas import auth as schemas
from app.crud import auth as crud
from app.database.connection import get_db

security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    if not settings.SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in environment variables")
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """トークン検証"""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if not settings.SECRET_KEY:
            raise ValueError("SECRET_KEY is not set in environment variables")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not isinstance(user_id, str):
            raise credentials_exception
        if user_id is None:
            raise credentials_exception
        try:
            user_id = int(user_id)
        except ValueError:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id


def get_current_user(db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    """現在のユーザーを取得"""
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    """アクティブユーザーを取得"""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user
