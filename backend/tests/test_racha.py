from datetime import date, datetime

from src.repositories.usuario_repository import racha_vencida


def test_la_racha_no_vence_si_hubo_actividad_ayer():
    assert not racha_vencida(datetime(2026, 9, 8, 20), date(2026, 9, 9))


def test_la_racha_vence_despues_de_un_dia_sin_actividad():
    assert racha_vencida(datetime(2026, 9, 7, 20), date(2026, 9, 9))


def test_la_racha_sin_fecha_de_actividad_vence():
    assert racha_vencida(None, date(2026, 9, 9))
