from sqlalchemy.orm import Session
from sqlalchemy import func

from src.db.models.curso_model import Curso
from src.db.models.insignia_model import Insignia
from src.db.models.idioma_model import Idioma
from src.db.models.leccion_model import Leccion
from src.db.models.progreso_model import Progreso
from src.db.models.usuario_model import Usuario
from src.repositories.insignia_repository import InsigniaRepository
from src.repositories.progreso_repository import ProgresoRepository
from src.repositories.usuario_insignias_repository import UsuarioInsigniasRepository
from src.utils.criterio_insignia import parsear_criterio


class EvaluadorInsigniasService:
    def __init__(self, db: Session):
        self.db = db
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
            if insignia.criterio.startswith("curso_completado:"):
                if not self._curso_completado(usuario.id, insignia.criterio):
                    continue
            else:
                criterio = parsear_criterio(insignia.criterio)
                if criterio is None or valores[criterio.metrica] < criterio.minimo:
                    continue
            if self.usuario_insignia_repo.get_by_id(usuario.id, insignia.id):
                continue

            self.usuario_insignia_repo.create(usuario.id, insignia.id)
            otorgadas.append(insignia)

        return otorgadas

    def _curso_completado(self, usuario_id: int, criterio: str) -> bool:
        _, codigo, nivel = criterio.split(":", 2)
        curso = (
            self.db.query(Curso)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(Idioma.codigo == codigo, Curso.nivel == nivel)
            .first()
        )
        if not curso:
            return False
        total = self.db.query(func.count(Leccion.id)).filter(Leccion.curso_id == curso.id).scalar() or 0
        completadas = (
            self.db.query(func.count(Leccion.id))
            .join(Progreso, Progreso.leccion_id == Leccion.id)
            .filter(Leccion.curso_id == curso.id, Progreso.usuario_id == usuario_id, Progreso.completada.is_(True))
            .scalar()
            or 0
        )
        return total > 0 and completadas >= total
