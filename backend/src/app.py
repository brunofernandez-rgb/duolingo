from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.middlewares.error_middleware import app_error_handler
from src.routers import (
    amigos_router,
    auth_router,
    conductores_router,
    curso_router,
    idioma_router,
    insignia_router,
    leccion_router,
    pasajero_router,
    progreso_router,
    user_router,
    usuario_cursos_router,
    usuario_insignias_router,
    usuario_router,
    solicitud_amistad_router,
)
from src.utils.errors import AppError
from src.db.connection import Base, SessionLocal, engine
from src.db.models.leccion_model import Leccion
from src.db.seed import seed_insignias

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    seed_insignias(db)

app = FastAPI(title="Initial Structure API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)

app.include_router(user_router.router, prefix="/api")
app.include_router(auth_router.router, prefix="/api")
app.include_router(pasajero_router.router, prefix="/api")
app.include_router(conductores_router.router, prefix="/api")
app.include_router(usuario_router.router, prefix="/api")
app.include_router(idioma_router.router, prefix="/api")
app.include_router(curso_router.router, prefix="/api")
app.include_router(leccion_router.router, prefix="/api")
app.include_router(progreso_router.router, prefix="/api")
app.include_router(usuario_cursos_router.router, prefix="/api")
app.include_router(insignia_router.router, prefix="/api")
app.include_router(usuario_insignias_router.router, prefix="/api")
app.include_router(amigos_router.router, prefix="/api")
app.include_router(solicitud_amistad_router.router, prefix="/api")
# TODO: registrar product_router cuando se implemente
# app.include_router(product_router.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
