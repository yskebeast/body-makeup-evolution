from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import engine
from app.models import auth as models_auth
from app.routers import auth as routers_auth

# Create database tables
models_auth.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Body Makeup Evolution API", description="API for body makeup evolution application", version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers_auth.router, prefix="/auth", tags=["authentication"])
