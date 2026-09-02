import unittest

from src.db.seed import INSIGNIAS_PREDETERMINADAS, seed_insignias


class QueryFalsa:
    def __init__(self, criterios):
        self.criterios = criterios

    def all(self):
        return [(criterio,) for criterio in self.criterios]


class SesionFalsa:
    def __init__(self, criterios=()):
        self.criterios = criterios
        self.agregadas = []
        self.commits = 0

    def query(self, campo):
        return QueryFalsa(self.criterios)

    def add_all(self, insignias):
        self.agregadas.extend(insignias)

    def commit(self):
        self.commits += 1


class SeedInsigniasTests(unittest.TestCase):
    def test_crea_las_insignias_en_una_base_vacia(self):
        db = SesionFalsa()

        seed_insignias(db)

        self.assertEqual(len(db.agregadas), len(INSIGNIAS_PREDETERMINADAS))
        self.assertEqual(db.commits, 1)

    def test_no_duplica_insignias_existentes(self):
        criterios = [insignia["criterio"] for insignia in INSIGNIAS_PREDETERMINADAS]
        db = SesionFalsa(criterios)

        seed_insignias(db)

        self.assertEqual(db.agregadas, [])
        self.assertEqual(db.commits, 0)


if __name__ == "__main__":
    unittest.main()
