from src.db.models.idioma_model import Idioma
from ..dtos.idioma_dto import IdiomaResponseDTO

def to_idioma_response(idioma: Idioma) -> IdiomaResponseDTO:

    return IdiomaResponseDTO.model_validate(idioma)