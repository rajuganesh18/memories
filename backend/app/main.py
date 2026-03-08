from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import admin, auth, templates

app = FastAPI(
    title="Memories - Album E-Commerce API",
    description="API for ordering custom photo albums with predefined templates",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(admin.router)


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "memories-api"}
