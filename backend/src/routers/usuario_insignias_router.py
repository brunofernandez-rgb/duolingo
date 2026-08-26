from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.usuario_insignias_dto import CreateUsuarioInsigniasDTO, UsuarioInsigniasResponseDTO
from src.schemas.usuario_insignias_schema import CreateUsuarioInsigniasSchema
from src.services.usuario_insignias_service import UsuarioInsigniasService

router = APIRouter(prefix="/usuario-insignias", tags=["usuario-insignias"])


@router.post("/", response_model=UsuarioInsigniasResponseDTO, status_code=status.HTTP_201_CREATED)
def otorgar_insignia(payload: CreateUsuarioInsigniasSchema, db: Session = Depends(get_db)):
    dto = CreateUsuarioInsigniasDTO(usuario_id=payload.usuario_id, insignia_id=payload.insignia_id)
    result = UsuarioInsigniasService(db).create(dto)
    if result is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El usuario ya tiene la insignia")
    return result


@router.get("/usuarios/{usuario_id}", response_model=list[UsuarioInsigniasResponseDTO])
def get_insignias_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return UsuarioInsigniasService(db).get_insignias_usuario(usuario_id)
