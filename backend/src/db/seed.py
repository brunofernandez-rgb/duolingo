from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia


INSIGNIAS_PREDETERMINADAS = (
    {
        "nombre": "Primeros pasos",
        "descripcion": "Alcanzá 100 XP",
        "criterio": "xp >= 100",
    },
    {
        "nombre": "Semana perfecta",
        "descripcion": "Mantené una racha de 7 días",
        "criterio": "racha >= 7",
    },
    {
        "nombre": "Estudiante dedicado",
        "descripcion": "Completá 20 lecciones",
        "criterio": "lecciones_completadas >= 20",
    },
)


def seed_insignias(db: Session) -> None:
    """Crea las insignias iniciales si todavía no existen."""
    criterios_existentes = {
        criterio for (criterio,) in db.query(Insignia.criterio).all()
    }
    nuevas = [
        Insignia(**datos)
        for datos in INSIGNIAS_PREDETERMINADAS
        if datos["criterio"] not in criterios_existentes
    ]
    if nuevas:
        db.add_all(nuevas)
        db.commit()
