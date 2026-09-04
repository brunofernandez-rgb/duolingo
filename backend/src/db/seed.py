from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia
from src.db.models.idioma_model import Idioma


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
    db.add_all(nuevas)
    db.flush()
    criterios_existentes.update(insignia.criterio for insignia in nuevas)
    idiomas = db.query(Idioma).all()
    insignias_idioma = [
        Insignia(
            nombre=f"{idioma.nombre} C1 completado",
            descripcion=f"Completá todas las lecciones del nivel C1 de {idioma.nombre}",
            criterio=f"curso_completado:{idioma.codigo}:C1",
        )
        for idioma in idiomas
        if f"curso_completado:{idioma.codigo}:C1" not in criterios_existentes
    ]
    db.add_all(insignias_idioma)
    if nuevas or insignias_idioma:
        db.commit()
