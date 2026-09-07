from src.db.seed import (
    LECCIONES_POR_NIVEL,
    VOCABULARIO_EXTRA_POR_LECCION,
    VOCABULARIO_POR_LECCION,
)


def test_cada_nivel_tiene_cinco_lecciones_propias():
    assert set(LECCIONES_POR_NIVEL) == {"A1", "A2", "B1", "B2", "C1"}
    assert all(len(lecciones) == 5 for lecciones in LECCIONES_POR_NIVEL.values())
    assert len({titulo for lecciones in LECCIONES_POR_NIVEL.values() for titulo, _ in lecciones}) == 25


def test_c1_es_mas_avanzado_que_a1():
    titulos_c1 = {titulo for titulo, _ in LECCIONES_POR_NIVEL["C1"]}

    assert "Presentaciones académicas y profesionales" in titulos_c1
    assert "Argumentación con matices" in titulos_c1
    assert min(xp for _, xp in LECCIONES_POR_NIVEL["C1"]) > max(xp for _, xp in LECCIONES_POR_NIVEL["A1"])
    assert VOCABULARIO_POR_LECCION[("A1", 1)] != VOCABULARIO_POR_LECCION[("C1", 1)]


def test_no_se_repite_vocabulario_entre_lecciones():
    palabras = [
        fuente
        for clave, vocabulario in VOCABULARIO_POR_LECCION.items()
        for _, fuente, *_ in vocabulario + VOCABULARIO_EXTRA_POR_LECCION[clave]
    ]

    assert len(VOCABULARIO_POR_LECCION) == 25
    assert all(len(vocabulario) == 3 for vocabulario in VOCABULARIO_EXTRA_POR_LECCION.values())
    assert all(
        len(VOCABULARIO_POR_LECCION[clave] + VOCABULARIO_EXTRA_POR_LECCION[clave]) == 6
        for clave in VOCABULARIO_POR_LECCION
    )
    assert len(palabras) == len(set(palabras))
