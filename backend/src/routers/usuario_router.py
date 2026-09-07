from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.amigos_dto import AmigosResponseDTO, RankingAmigosItemDTO
from src.dtos.progreso_dto import ProgresoCursoDTO
from src.dtos.usuarios_dto import CreateUsuarioDTO, UsuarioResponseDTO
from src.schemas.usuario_schema import ChangePasswordSchema, ChangeUsernameSchema, CreateUsuarioSchema, PasswordConfirmationSchema
from src.services.amigos_service import AmigosService
from src.services.progreso_service import ProgresoService
from src.services.usuario_service import UsuarioService
from src.middlewares.admin_middleware import get_admin_user

ADMIN_EMAIL = "admin@gmail.com"

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/", response_model=UsuarioResponseDTO, status_code=status.HTTP_201_CREATED)
def create_usuario(payload: CreateUsuarioSchema, db: Session = Depends(get_db)):
    dto = CreateUsuarioDTO(email=str(payload.email), nombre=payload.nombre)
    result = UsuarioService(db).create(dto, payload.password)
    if result is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")
    return result


@router.get("/ranking", response_model=list[UsuarioResponseDTO])
def get_ranking_global(
    periodo: str = Query(default="global", pattern="^(global|semanal|mensual)$"),
    db: Session = Depends(get_db),
):
    return UsuarioService(db).get_ranking_global(periodo)


@router.get("/", response_model=list[UsuarioResponseDTO])
def list_usuarios_admin(db: Session = Depends(get_db), _admin=Depends(get_admin_user)):
    return UsuarioService(db).list_all()


@router.get("/{usuario_id}/amigos", response_model=list[AmigosResponseDTO])
def get_amigos_del_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return AmigosService(db).get_amigos(usuario_id)


@router.get("/{usuario_id}/ranking-amigos", response_model=list[RankingAmigosItemDTO])
def get_ranking_amigos_usuario(usuario_id: int, db: Session = Depends(get_db)):
    result = AmigosService(db).get_ranking_amigos(usuario_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return result


@router.get("/{usuario_id}/cursos/{curso_id}/progreso", response_model=ProgresoCursoDTO)
def get_progreso_curso_usuario(usuario_id: int, curso_id: int, db: Session = Depends(get_db)):
    result = ProgresoService(db).get_progreso_curso(usuario_id, curso_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inscripción al curso no encontrada")
    return result


@router.get("/{usuario_id}", response_model=UsuarioResponseDTO)
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    result = UsuarioService(db).get_by_id(usuario_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return result


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_usuario(usuario_id: int, payload: PasswordConfirmationSchema, db: Session = Depends(get_db)):
    usuario = UsuarioService(db).get_by_id(usuario_id)
    if usuario and usuario.email.lower() == ADMIN_EMAIL:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="La cuenta administradora no se puede borrar")
    if not UsuarioService(db).delete_with_password(usuario_id, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")


@router.delete("/{usuario_id}/admin", status_code=status.HTTP_204_NO_CONTENT)
def delete_usuario_admin(usuario_id: int, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    if usuario_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se puede borrar la cuenta administradora")
    if not UsuarioService(db).delete(usuario_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")


@router.post("/{usuario_id}/verificar-password")
def verify_usuario_password(usuario_id: int, payload: PasswordConfirmationSchema, db: Session = Depends(get_db)):
    if not UsuarioService(db).verify_password(usuario_id, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")
    return {"verified": True}


@router.patch("/{usuario_id}/nombre", status_code=status.HTTP_204_NO_CONTENT)
def change_usuario_nombre(usuario_id: int, payload: ChangeUsernameSchema, db: Session = Depends(get_db)):
    if not UsuarioService(db).change_nombre(usuario_id, payload.nombre):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El nombre de usuario ya esta en uso")


@router.patch("/{usuario_id}/password", status_code=status.HTTP_204_NO_CONTENT)
def change_usuario_password(usuario_id: int, payload: ChangePasswordSchema, db: Session = Depends(get_db)):
    if payload.password_actual == payload.password_nueva:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contrasena debe ser diferente de la actual",
        )
    if not UsuarioService(db).change_password(usuario_id, payload.password_actual, payload.password_nueva):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña actual incorrecta")
