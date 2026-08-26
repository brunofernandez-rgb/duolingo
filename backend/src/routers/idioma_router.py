from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.idioma_dto import CreateIdiomaDTO, IdiomaResponseDTO
from src.schemas.idioma_schema import CreateIdiomaSchema
from src.services.idioma_service import IdiomaService

router = APIRouter(prefix="/idiomas", tags=["idiomas"])


@router.post("/", response_model=IdiomaResponseDTO, status_code=status.HTTP_201_CREATED)
def create_idioma(payload: CreateIdiomaSchema, db: Session = Depends(get_db)):
    result = IdiomaService(db).create(CreateIdiomaDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El código del idioma ya existe")
    return result


@router.get("/{idioma_id}", response_model=IdiomaResponseDTO)
def get_idioma(idioma_id: int, db: Session = Depends(get_db)):
    result = IdiomaService(db).get_by_id(idioma_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Idioma no encontrado")
    return result


@router.delete("/{idioma_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_idioma(idioma_id: int, db: Session = Depends(get_db)):
    if not IdiomaService(db).delete(idioma_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Idioma no encontrado")
