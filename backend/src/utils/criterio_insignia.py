import re
from dataclasses import dataclass


CRITERIO_PATTERN = re.compile(
    r"^\s*(xp|racha|lecciones_completadas)\s*>=\s*(\d+)\s*$",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class CriterioInsignia:
    metrica: str
    minimo: int


def parsear_criterio(criterio: str) -> CriterioInsignia | None:
    """Interpreta criterios soportados sin ejecutar expresiones arbitrarias."""
    coincidencia = CRITERIO_PATTERN.fullmatch(criterio)
    if not coincidencia:
        return None
    return CriterioInsignia(
        metrica=coincidencia.group(1).lower(),
        minimo=int(coincidencia.group(2)),
    )
