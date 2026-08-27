from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.amigos_dto import AmigosResponseDTO
from src.dtos.usuarios_dto import CreateUsuarioDTO, UsuarioResponseDTO
from src.schemas.usuario_schema import CreateUsuarioSchema
from src.services.amigos_service import AmigosService
from src.services.usuario_service import UsuarioService

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


@router.get("/{usuario_id}/amigos", response_model=list[AmigosResponseDTO])
def get_amigos_del_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return AmigosService(db).get_amigos(usuario_id)


@router.get("/{usuario_id}", response_model=UsuarioResponseDTO)
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    result = UsuarioService(db).get_by_id(usuario_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return result


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    if not UsuarioService(db).delete(usuario_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
