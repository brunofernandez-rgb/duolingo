from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia
from src.db.models.idioma_model import Idioma
from src.db.models.curso_model import Curso
from src.db.models.leccion_model import Leccion
from src.db.models.leccion_vocabulario_model import LeccionVocabulario


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


# This level is created for every target language.  The prompt is localized by
# the client while the answer comes from the appropriate translation column.
TECNICO_LECCIONES = (
    ("Herramientas", 15, (
        ("🔨", "martillo", "hammer", "marteau", "Hammer", "martello", "martelo"),
        ("🪛", "destornillador", "screwdriver", "tournevis", "Schraubendreher", "cacciavite", "chave de fenda"),
        ("🔧", "llave inglesa", "wrench", "clé à molette", "Schraubenschlüssel", "chiave inglese", "chave inglesa"),
        ("📏", "cinta métrica", "tape measure", "mètre ruban", "Maßband", "metro a nastro", "fita métrica"),
        ("✂️", "alicate", "pliers", "pince", "Zange", "pinza", "alicate"),
        ("🪚", "serrucho", "handsaw", "scie égoïne", "Handsäge", "sega a mano", "serrote"),
    )),
    ("Máquinas", 20, (
        ("⚙️", "taladro", "drill", "perceuse", "Bohrmaschine", "trapano", "furadeira"),
        ("⚙️", "torno", "lathe", "tour", "Drehmaschine", "tornio", "torno"),
        ("⚙️", "amoladora", "angle grinder", "meuleuse", "Winkelschleifer", "smerigliatrice", "esmerilhadeira"),
        ("⚙️", "soldadora", "welder", "poste à souder", "Schweißgerät", "saldatrice", "máquina de solda"),
        ("⚙️", "fresadora", "milling machine", "fraiseuse", "Fräsmaschine", "fresatrice", "fresadora"),
        ("⚙️", "prensa", "press", "presse", "Presse", "pressa", "prensa"),
    )),
    ("Materiales", 20, (
        ("🪵", "madera", "wood", "bois", "Holz", "legno", "madeira"),
        ("🔩", "acero", "steel", "acier", "Stahl", "acciaio", "aço"),
        ("🔩", "aluminio", "aluminum", "aluminium", "Aluminium", "alluminio", "alumínio"),
        ("🧱", "ladrillo", "brick", "brique", "Ziegel", "mattone", "tijolo"),
        ("🧪", "plástico", "plastic", "plastique", "Kunststoff", "plastica", "plástico"),
        ("🧵", "cobre", "copper", "cuivre", "Kupfer", "rame", "cobre"),
    )),
)


def seed_lenguaje_tecnico(db: Session) -> None:
    """Adds the workshop vocabulary level without duplicating existing data."""
    changed = False
    for idioma in db.query(Idioma).all():
        curso = db.query(Curso).filter(Curso.idioma_id == idioma.id, Curso.nivel == "TECNICO").first()
        if curso is None:
            curso = Curso(idioma_id=idioma.id, nivel="TECNICO")
            db.add(curso)
            db.flush()
            changed = True
        for orden, (titulo, xp_recompensa, palabras) in enumerate(TECNICO_LECCIONES, start=1):
            leccion = db.query(Leccion).filter(Leccion.curso_id == curso.id, Leccion.orden == orden).first()
            if leccion is None:
                leccion = Leccion(curso_id=curso.id, orden=orden, titulo=titulo, xp_recompensa=xp_recompensa)
                db.add(leccion)
                db.flush()
                changed = True
            if db.query(LeccionVocabulario).filter(LeccionVocabulario.leccion_id == leccion.id).first():
                continue
            for emoji, fuente, en, fr, de, it, pt in palabras:
                db.add(LeccionVocabulario(
                    leccion_id=leccion.id, emoji=emoji, fuente=fuente,
                    traduccion_en=en, traduccion_fr=fr, traduccion_de=de,
                    traduccion_it=it, traduccion_pt=pt,
                ))
            changed = True
    if changed:
        db.commit()
