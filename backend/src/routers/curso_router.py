from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.curso_dto import CreateCursoDTO, CursoResponseDTO
from src.schemas.curso_schema import CreateCursoSchema
from src.services.curso_service import CursoService

router = APIRouter(prefix="/cursos", tags=["cursos"])


@router.post("/", response_model=CursoResponseDTO, status_code=status.HTTP_201_CREATED)
def create_curso(payload: CreateCursoSchema, db: Session = Depends(get_db)):
    result = CursoService(db).create(CreateCursoDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el curso")
    return result


@router.get("/{curso_id}", response_model=CursoResponseDTO)
def get_curso(curso_id: int, db: Session = Depends(get_db)):
    result = CursoService(db).get_by_id(curso_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado")
    return result


@router.delete("/{curso_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_curso(curso_id: int, db: Session = Depends(get_db)):
    if not CursoService(db).delete(curso_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado")
