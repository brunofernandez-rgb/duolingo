from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from src.db.models.leccion_model import Leccion
from src.db.models.progreso_model import Progreso
from src.db.models.usuario_model import Usuario

class UsuariosRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, email: str, nombre: str, password_hash: str, fecha_ultima_actividad: datetime | None = None, xp_total: int = 0, racha_dias: int = 0) -> Usuario:
        usuario = Usuario(email=email, nombre=nombre, password_hash=password_hash, xp_total=xp_total, racha_dias=racha_dias, fecha_ultima_actividad=fecha_ultima_actividad)
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def get_by_id(self, usuario_id: int) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.id == usuario_id).first()

    def get_by_email(self, email: str) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.email == email).first()

    def get_ranking(self, periodo: str = "global", limit: int | None = None) -> list[Usuario]:
        query = self.db.query(Usuario).order_by(Usuario.xp_total.desc(), Usuario.racha_dias.desc(), Usuario.id.asc())
        return query.limit(limit).all() if limit is not None else query.all()

    def get_ranking_semanal(self) -> list[tuple[Usuario, int]]:
        hoy = datetime.now()
        inicio_semana = hoy - timedelta(days=hoy.weekday())
        progresos = (
            self.db.query(Progreso.usuario_id, Progreso.leccion_id, Leccion.xp_recompensa)
            .join(Leccion, Progreso.leccion_id == Leccion.id)
            .filter(Progreso.completada.is_(True), Progreso.fecha >= inicio_semana)
            .all()
        )
        xp_semanal: dict[int, int] = {}
        lecciones_contadas: set[tuple[int, int]] = set()
        for usuario_id, leccion_id, xp_recompensa in progresos:
            clave = (usuario_id, leccion_id)
            if clave not in lecciones_contadas:
                lecciones_contadas.add(clave)
                xp_semanal[usuario_id] = xp_semanal.get(usuario_id, 0) + xp_recompensa
        usuarios = self.db.query(Usuario).all()
        return sorted(
            [(usuario, int(xp_semanal.get(usuario.id, 0))) for usuario in usuarios],
            key=lambda item: (-item[1], -item[0].racha_dias, item[0].id),
        )

    def update(self, usuario: Usuario) -> Usuario:
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def delete(self, usuario: Usuario) -> None:
        self.db.delete(usuario)
        self.db.commit()