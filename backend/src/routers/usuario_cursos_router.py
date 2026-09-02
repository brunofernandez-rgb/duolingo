from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.usuario_cursos_dto import CreateUsuarioCursosDTO, UsuarioCursosResponseDTO
from src.schemas.usuariocursos_schema import CreateUsuarioCursosSchema
from src.services.usuario_cursos_service import UsuarioCursosService

router = APIRouter(prefix="/usuario-cursos", tags=["usuario-cursos"])


@router.post("/", response_model=UsuarioCursosResponseDTO, status_code=status.HTTP_201_CREATED)
def inscribir_usuario(payload: CreateUsuarioCursosSchema, db: Session = Depends(get_db)):
    result = UsuarioCursosService(db).create(CreateUsuarioCursosDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El usuario ya está inscrito en ese idioma o el curso no existe",
        )
    return result


@router.get("/usuarios/{usuario_id}", response_model=list[UsuarioCursosResponseDTO])
def get_cursos_del_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return UsuarioCursosService(db).get_cursos_del_usuario(usuario_id)


@router.delete("/usuarios/{usuario_id}/cursos/{curso_id}", status_code=status.HTTP_204_NO_CONTENT)
def desinscribir_usuario(usuario_id: int, curso_id: int, db: Session = Depends(get_db)):
    if not UsuarioCursosService(db).delete(usuario_id, curso_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inscripción no encontrada")
