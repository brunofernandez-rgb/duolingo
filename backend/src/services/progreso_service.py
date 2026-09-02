from datetime import datetime, date
from sqlalchemy.orm import Session

from src.dtos.progreso_dto import CreateProgresoDTO, ProgresoCursoDTO, ProgresoResponseDTO
from src.mappers.progreso_mapper import to_progreso_response
from src.repositories.leccion_repository import LeccionRepository
from src.repositories.progreso_repository import ProgresoRepository
from src.repositories.usuario_cursos_repository import UsuarioCursosRepository
from src.repositories.usuario_repository import UsuariosRepository


class ProgresoService:
    def __init__(self, db: Session):
        self.repo = ProgresoRepository(db)
        self.leccion_repo = LeccionRepository(db)
        self.usuario_repo = UsuariosRepository(db)
        self.usuario_cursos_repo = UsuarioCursosRepository(db)

    def registrar_intento(self, dto: CreateProgresoDTO) -> ProgresoResponseDTO | None:
        if not (0 <= dto.puntaje <= 100):
            return None

        leccion = self.leccion_repo.get_by_id(dto.leccion_id)
        usuario = self.usuario_repo.get_by_id(dto.usuario_id)
        if not leccion or not usuario:
            return None

        es_completada = dto.puntaje >= 60
        progreso_existente = self.repo.get_by_usuario_y_leccion(dto.usuario_id, leccion.id)
        ya_completada = progreso_existente is not None and progreso_existente.completada
        if progreso_existente:
            progreso_existente.puntaje = max(progreso_existente.puntaje, dto.puntaje)
            progreso_existente.completada = ya_completada or es_completada
            progreso = self.repo.update(progreso_existente)
        else:
            progreso = self.repo.create(dto.usuario_id, dto.leccion_id, dto.puntaje, es_completada)

        if es_completada and not ya_completada:
            usuario.xp_total += leccion.xp_recompensa
            ahora = datetime.now()
            if usuario.fecha_ultima_actividad:
                diff = (ahora.date() - usuario.fecha_ultima_actividad.date()).days
                usuario.racha_dias = usuario.racha_dias + 1 if diff == 1 else (1 if diff > 1 else usuario.racha_dias)
            else:
                usuario.racha_dias = 1
            usuario.fecha_ultima_actividad = ahora
            self.usuario_repo.update(usuario)

        res = self.repo.get_by_id_with_leccion_curso(progreso.id)
        return to_progreso_response(res[0], res[1], res[2])

    def get_progreso_curso(self, usuario_id: int, curso_id: int) -> ProgresoCursoDTO | None:
        if not self.usuario_cursos_repo.get_by_id(usuario_id, curso_id):
            return None
        total, completadas, proxima_id = self.repo.get_progreso_curso_join(usuario_id, curso_id)
        pct = round((completadas / total * 100), 2) if total > 0 else 0.0
        return ProgresoCursoDTO(
            curso_id=curso_id,
            total_lecciones=total,
            completadas=completadas,
            porcentaje=pct,
            proxima_leccion_id=proxima_id,
        )

    def get_actividad_diaria(self, usuario_id: int, desde: date, hasta: date) -> list[dict]:
        return self.repo.get_actividad_por_rango(usuario_id, desde, hasta)