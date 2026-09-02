from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia
from src.db.models.usuario_model import Usuario
from src.repositories.insignia_repository import InsigniaRepository
from src.repositories.progreso_repository import ProgresoRepository
from src.repositories.usuario_insignias_repository import UsuarioInsigniasRepository
from src.utils.criterio_insignia import parsear_criterio


class EvaluadorInsigniasService:
    def __init__(self, db: Session):
        self.insignia_repo = InsigniaRepository(db)
        self.progreso_repo = ProgresoRepository(db)
        self.usuario_insignia_repo = UsuarioInsigniasRepository(db)

    def otorgar_cumplidas(self, usuario: Usuario) -> list[Insignia]:
        lecciones_completadas = self.progreso_repo.count_lecciones_completadas(usuario.id)
        valores = {
            "xp": usuario.xp_total,
            "racha": usuario.racha_dias,
            "lecciones_completadas": lecciones_completadas,
        }
        otorgadas: list[Insignia] = []

        for insignia in self.insignia_repo.get_all():
            criterio = parsear_criterio(insignia.criterio)
            if criterio is None or valores[criterio.metrica] < criterio.minimo:
                continue
            if self.usuario_insignia_repo.get_by_id(usuario.id, insignia.id):
                continue

            self.usuario_insignia_repo.create(usuario.id, insignia.id)
            otorgadas.append(insignia)

        return otorgadas
