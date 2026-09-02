import unittest
from types import SimpleNamespace

from src.services.evaluador_insignias_service import EvaluadorInsigniasService
from src.utils.criterio_insignia import parsear_criterio


class ParsearCriterioTests(unittest.TestCase):
    def test_acepta_las_tres_metricas_soportadas(self):
        casos = {
            "xp >= 100": ("xp", 100),
            "racha>=7": ("racha", 7),
            " lecciones_completadas >= 20 ": ("lecciones_completadas", 20),
        }
        for texto, esperado in casos.items():
            with self.subTest(texto=texto):
                criterio = parsear_criterio(texto)
                self.assertIsNotNone(criterio)
                self.assertEqual((criterio.metrica, criterio.minimo), esperado)

    def test_rechaza_expresiones_no_soportadas(self):
        for texto in ("xp > 100", "nivel >= 2", "xp >= -1", "__import__('os')"):
            with self.subTest(texto=texto):
                self.assertIsNone(parsear_criterio(texto))


class EvaluadorInsigniasTests(unittest.TestCase):
    def test_otorga_cada_insignia_cumplida_una_sola_vez(self):
        insignias = [
            SimpleNamespace(id=1, criterio="xp >= 100"),
            SimpleNamespace(id=2, criterio="racha >= 7"),
            SimpleNamespace(id=3, criterio="lecciones_completadas >= 20"),
        ]

        class InsigniaRepo:
            def get_all(self):
                return insignias

        class ProgresoRepo:
            def count_lecciones_completadas(self, usuario_id):
                return 20

        class UsuarioInsigniaRepo:
            def __init__(self):
                self.registros = set()

            def get_by_id(self, usuario_id, insignia_id):
                return (usuario_id, insignia_id) if (usuario_id, insignia_id) in self.registros else None

            def create(self, usuario_id, insignia_id):
                self.registros.add((usuario_id, insignia_id))

        evaluador = EvaluadorInsigniasService.__new__(EvaluadorInsigniasService)
        evaluador.insignia_repo = InsigniaRepo()
        evaluador.progreso_repo = ProgresoRepo()
        evaluador.usuario_insignia_repo = UsuarioInsigniaRepo()
        usuario = SimpleNamespace(id=10, xp_total=100, racha_dias=7)

        self.assertEqual(len(evaluador.otorgar_cumplidas(usuario)), 3)
        self.assertEqual(evaluador.otorgar_cumplidas(usuario), [])


if __name__ == "__main__":
    unittest.main()
