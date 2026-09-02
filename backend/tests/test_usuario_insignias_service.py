import unittest
from types import SimpleNamespace

from src.services.usuario_insignias_service import UsuarioInsigniasService


class UsuarioInsigniasServiceTests(unittest.TestCase):
    def test_reevalua_insignias_al_consultarlas(self):
        usuario = SimpleNamespace(id=1, xp_total=150, racha_dias=0)

        class UsuarioRepo:
            def get_by_id(self, usuario_id):
                return usuario

        class Evaluador:
            usuario_evaluado = None

            def otorgar_cumplidas(self, usuario_actual):
                self.usuario_evaluado = usuario_actual

        class UsuarioInsigniaRepo:
            def get_by_usuario_id_with_join(self, usuario_id):
                return []

        servicio = UsuarioInsigniasService.__new__(UsuarioInsigniasService)
        servicio.usuario_repo = UsuarioRepo()
        servicio.evaluador = Evaluador()
        servicio.repo = UsuarioInsigniaRepo()

        self.assertEqual(servicio.get_insignias_usuario(usuario.id), [])
        self.assertIs(servicio.evaluador.usuario_evaluado, usuario)


if __name__ == "__main__":
    unittest.main()
