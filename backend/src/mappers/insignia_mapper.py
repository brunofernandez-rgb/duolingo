from src.db.models.insignia_model import Insignia
from ..dtos.insignia_dto import InsigniaResponseDTO

def to_insignia_response(insignia: Insignia) -> InsigniaResponseDTO:

    return InsigniaResponseDTO.model_validate(insignia)