from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.insignia_dto import CreateInsigniaDTO, InsigniaResponseDTO
from src.schemas.insignia_schema import CreateInsigniaSchema
from src.services.insignia_service import InsigniaService

router = APIRouter(prefix="/insignias", tags=["insignias"])


@router.post("/", response_model=InsigniaResponseDTO, status_code=status.HTTP_201_CREATED)
def create_insignia(payload: CreateInsigniaSchema, db: Session = Depends(get_db)):
    dto = CreateInsigniaDTO(**payload.model_dump())
    return InsigniaService(db).create(dto)


@router.get("/{insignia_id}", response_model=InsigniaResponseDTO)
def get_insignia(insignia_id: int, db: Session = Depends(get_db)):
    result = InsigniaService(db).get_by_id(insignia_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Insignia no encontrada")
    return result


@router.delete("/{insignia_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_insignia(insignia_id: int, db: Session = Depends(get_db)):
    if not InsigniaService(db).delete(insignia_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Insignia no encontrada")
