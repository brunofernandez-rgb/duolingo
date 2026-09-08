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
from sqlalchemy import inspect, text

from src.db.connection import Base, SessionLocal, engine
from src.db.models.leccion_model import Leccion
from src.db.models.progreso_model import Progreso
from src.db.models.usuario_model import Usuario
from src.db.seed import (
    remove_contenido_predeterminado_de_idiomas_personalizados,
    seed_contenido_por_nivel,
    seed_insignias,
    seed_lenguaje_tecnico,
)

Base.metadata.create_all(bind=engine)
with engine.begin() as connection:
    columnas_idioma = {column["name"] for column in inspect(connection).get_columns("idioma")}
    if "bandera_url" not in columnas_idioma:
        connection.execute(text("ALTER TABLE idioma ADD COLUMN bandera_url VARCHAR(255)"))
    columnas_progreso = {column["name"] for column in inspect(connection).get_columns("progreso")}
    if "fecha_completada" not in columnas_progreso:
        connection.execute(text("ALTER TABLE progreso ADD COLUMN fecha_completada TIMESTAMP"))
    if "xp_obtenida" not in columnas_progreso:
        connection.execute(text("ALTER TABLE progreso ADD COLUMN xp_obtenida INTEGER NOT NULL DEFAULT 0"))
with SessionLocal() as db:
    # Existing records did not preserve the original reward or completion time.
    # Backfill from the only available historical values, then keep snapshots for
    # every future completion so retries and reward edits cannot change the history.
    completados = (
        db.query(Progreso, Leccion)
        .join(Leccion, Progreso.leccion_id == Leccion.id)
        .filter(Progreso.completada.is_(True))
        .all()
    )
    for progreso, leccion in completados:
        if progreso.fecha_completada is None:
            progreso.fecha_completada = progreso.fecha
        if progreso.xp_obtenida == 0:
            progreso.xp_obtenida = leccion.xp_recompensa
    if completados:
        db.commit()

    # The header uses the same immutable completion snapshots as activity.
    for usuario in db.query(Usuario).all():
        xp_calculada = sum(
            progreso.xp_obtenida
            for progreso in db.query(Progreso)
            .filter(Progreso.usuario_id == usuario.id, Progreso.completada.is_(True))
            .all()
        )
        if usuario.xp_total != xp_calculada:
            usuario.xp_total = xp_calculada
    db.commit()
    remove_contenido_predeterminado_de_idiomas_personalizados(db)
    seed_contenido_por_nivel(db)
    seed_insignias(db)
    seed_lenguaje_tecnico(db)

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
