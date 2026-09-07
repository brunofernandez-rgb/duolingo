from datetime import datetime

from src.repositories.usuario_repository import inicio_de_semana


def test_inicio_de_semana_incluye_todo_el_lunes():
    fecha = datetime(2026, 9, 9, 14, 30)  # miércoles

    assert inicio_de_semana(fecha) == datetime(2026, 9, 7, 0, 0)
