from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia
from src.db.models.idioma_model import Idioma
from src.db.models.curso_model import Curso
from src.db.models.leccion_model import Leccion
from src.db.models.leccion_vocabulario_model import LeccionVocabulario


# Cada nivel tiene objetivos y vocabulario propios.  No se reutiliza contenido
# de A1 en niveles superiores: el seeder también corrige las bases creadas con
# la versión inicial, que usaba las mismas cinco lecciones para todos los cursos.
LECCIONES_POR_NIVEL = {
    "A1": (
        ("Saludos y presentaciones", 10),
        ("Familia y personas", 10),
        ("Comida y necesidades", 15),
        ("Rutinas cotidianas", 15),
        ("Preguntas básicas", 20),
    ),
    "A2": (
        ("Presentarse en un contexto", 15),
        ("Moverse por la ciudad", 15),
        ("Viajes y reservas", 20),
        ("Trabajo y estudios", 20),
        ("Planes y experiencias", 25),
    ),
    "B1": (
        ("Relatar experiencias personales", 20),
        ("Expresar opiniones y preferencias", 20),
        ("Resolver situaciones cotidianas", 25),
        ("Trabajo, salud y sociedad", 25),
        ("Narrar planes y cambios", 30),
    ),
    "B2": (
        ("Presentaciones estructuradas", 25),
        ("Debates y contraargumentos", 25),
        ("Comunicación profesional", 30),
        ("Medios, cultura y actualidad", 30),
        ("Negociación y toma de decisiones", 35),
    ),
    "C1": (
        ("Presentaciones académicas y profesionales", 30),
        ("Argumentación con matices", 30),
        ("Análisis crítico de fuentes", 35),
        ("Negociación compleja y diplomacia", 35),
        ("Registro formal y discurso especializado", 40),
    ),
}


# emoji, español, inglés, francés, alemán, italiano, portugués.
# Son expresiones representativas del salto de dificultad de cada nivel.
VOCABULARIO_POR_NIVEL = {
    "A1": (
        ("👋", "hola", "hello", "bonjour", "hallo", "ciao", "olá"),
        ("🙋", "me llamo", "my name is", "je m'appelle", "ich heiße", "mi chiamo", "meu nome é"),
        ("🙏", "por favor", "please", "s'il vous plaît", "bitte", "per favore", "por favor"),
        ("❓", "¿dónde está?", "where is it?", "où est-ce ?", "wo ist es?", "dov'è?", "onde fica?"),
        ("✅", "no entiendo", "I do not understand", "je ne comprends pas", "ich verstehe nicht", "non capisco", "não entendo"),
    ),
    "A2": (
        ("🧭", "¿cómo llego a...?", "how do I get to...?", "comment aller à...?", "wie komme ich zu...?", "come arrivo a...?", "como chego a...?"),
        ("📅", "me gustaría reservar", "I would like to book", "je voudrais réserver", "ich möchte reservieren", "vorrei prenotare", "gostaria de reservar"),
        ("💼", "tengo experiencia", "I have experience", "j'ai de l'expérience", "ich habe Erfahrung", "ho esperienza", "tenho experiência"),
        ("🕒", "la semana pasada", "last week", "la semaine dernière", "letzte Woche", "la settimana scorsa", "na semana passada"),
        ("💡", "voy a intentar", "I am going to try", "je vais essayer", "ich werde versuchen", "proverò", "vou tentar"),
    ),
    "B1": (
        ("🗣️", "en mi opinión", "in my opinion", "à mon avis", "meiner Meinung nach", "secondo me", "na minha opinião"),
        ("🔄", "a pesar de", "despite", "malgré", "trotz", "nonostante", "apesar de"),
        ("📖", "me di cuenta de que", "I realized that", "je me suis rendu compte que", "mir wurde klar, dass", "mi sono reso conto che", "percebi que"),
        ("🛠️", "encontrar una solución", "find a solution", "trouver une solution", "eine Lösung finden", "trovare una soluzione", "encontrar uma solução"),
        ("🌱", "habría preferido", "I would have preferred", "j'aurais préféré", "ich hätte lieber", "avrei preferito", "eu teria preferido"),
    ),
    "B2": (
        ("⚖️", "sin embargo", "however", "toutefois", "allerdings", "tuttavia", "no entanto"),
        ("🧩", "por un lado", "on the one hand", "d'une part", "einerseits", "da un lato", "por um lado"),
        ("📊", "los datos sugieren", "the data suggest", "les données suggèrent", "die Daten legen nahe", "i dati suggeriscono", "os dados sugerem"),
        ("🤝", "llegar a un acuerdo", "reach an agreement", "parvenir à un accord", "eine Einigung erzielen", "raggiungere un accordo", "chegar a um acordo"),
        ("🎯", "conviene destacar que", "it is worth noting that", "il convient de souligner que", "es ist hervorzuheben, dass", "vale la pena sottolineare che", "vale destacar que"),
    ),
    "C1": (
        ("🔬", "la evidencia empírica", "the empirical evidence", "les preuves empiriques", "die empirischen Belege", "l'evidenza empirica", "a evidência empírica"),
        ("🪶", "un matiz importante", "an important nuance", "une nuance importante", "eine wichtige Nuance", "una sfumatura importante", "uma nuance importante"),
        ("🧠", "plantear una hipótesis", "put forward a hypothesis", "formuler une hypothèse", "eine Hypothese aufstellen", "formulare un'ipotesi", "formular uma hipótese"),
        ("🏛️", "las implicancias a largo plazo", "the long-term implications", "les implications à long terme", "die langfristigen Auswirkungen", "le implicazioni a lungo termine", "as implicações a longo prazo"),
        ("🤲", "alcanzar un consenso", "reach a consensus", "parvenir à un consensus", "einen Konsens erzielen", "raggiungere un consenso", "chegar a um consenso"),
    ),
}


# Vocabulario exclusivo para cada lección.  La clave es (nivel, orden): así no
# se reciclan ni palabras ni expresiones entre cursos, incluso dentro del mismo
# nivel. Cada bloque contiene al menos tres opciones para el ejercicio.
VOCABULARIO_POR_LECCION = {
    ("A1", 1): (("👋", "buenos días", "good morning", "bonjour", "guten Morgen", "buongiorno", "bom dia"), ("😊", "encantado", "pleased to meet you", "enchanté", "sehr erfreut", "piacere", "prazer"), ("🪪", "mi nombre es", "my name is", "je m'appelle", "ich heiße", "mi chiamo", "meu nome é")),
    ("A1", 2): (("👩", "mi madre", "my mother", "ma mère", "meine Mutter", "mia madre", "minha mãe"), ("👨", "mi padre", "my father", "mon père", "mein Vater", "mio padre", "meu pai"), ("🧒", "mi hermano", "my brother", "mon frère", "mein Bruder", "mio fratello", "meu irmão")),
    ("A1", 3): (("🍽️", "el menú", "the menu", "le menu", "die Speisekarte", "il menù", "o cardápio"), ("💧", "tengo sed", "I am thirsty", "j'ai soif", "ich habe Durst", "ho sete", "estou com sede"), ("🥗", "soy vegetariano", "I am vegetarian", "je suis végétarien", "ich bin Vegetarier", "sono vegetariano", "sou vegetariano")),
    ("A1", 4): (("⏰", "me despierto", "I wake up", "je me réveille", "ich wache auf", "mi sveglio", "eu acordo"), ("🏫", "voy a clase", "I go to class", "je vais en cours", "ich gehe zum Unterricht", "vado a lezione", "vou para a aula"), ("🌙", "es hora de dormir", "it is time to sleep", "c'est l'heure de dormir", "es ist Zeit zu schlafen", "è ora di dormire", "é hora de dormir")),
    ("A1", 5): (("🕐", "¿qué hora es?", "what time is it?", "quelle heure est-il ?", "wie spät ist es?", "che ore sono?", "que horas são?"), ("💶", "¿cuánto cuesta?", "how much does it cost?", "combien ça coûte ?", "wie viel kostet es?", "quanto costa?", "quanto custa?"), ("🆘", "¿puede ayudarme?", "can you help me?", "pouvez-vous m'aider ?", "können Sie mir helfen?", "può aiutarmi?", "pode me ajudar?")),
    ("A2", 1): (("🤝", "trabajo como diseñador", "I work as a designer", "je travaille comme designer", "ich arbeite als Designer", "lavoro come designer", "trabalho como designer"), ("🎓", "estudio ingeniería", "I study engineering", "j'étudie l'ingénierie", "ich studiere Ingenieurwesen", "studio ingegneria", "estudo engenharia"), ("📍", "vivo en el centro", "I live downtown", "j'habite au centre-ville", "ich wohne im Zentrum", "vivo in centro", "moro no centro")),
    ("A2", 2): (("🚇", "la próxima parada", "the next stop", "le prochain arrêt", "die nächste Haltestelle", "la prossima fermata", "a próxima parada"), ("↩️", "gire a la izquierda", "turn left", "tournez à gauche", "biegen Sie links ab", "giri a sinistra", "vire à esquerda"), ("🚶", "queda a diez minutos", "it is ten minutes away", "c'est à dix minutes", "es ist zehn Minuten entfernt", "è a dieci minuti", "fica a dez minutos")),
    ("A2", 3): (("🛂", "tarjeta de embarque", "boarding pass", "carte d'embarquement", "Bordkarte", "carta d'imbarco", "cartão de embarque"), ("🛎️", "una habitación doble", "a double room", "une chambre double", "ein Doppelzimmer", "una camera doppia", "um quarto duplo"), ("🧳", "equipaje de mano", "carry-on luggage", "bagage à main", "Handgepäck", "bagaglio a mano", "bagagem de mão")),
    ("A2", 4): (("📧", "enviar un currículum", "send a résumé", "envoyer un CV", "einen Lebenslauf schicken", "inviare un curriculum", "enviar um currículo"), ("🗓️", "una entrevista laboral", "a job interview", "un entretien d'embauche", "ein Vorstellungsgespräch", "un colloquio di lavoro", "uma entrevista de emprego"), ("💻", "trabajo remoto", "remote work", "le travail à distance", "die Fernarbeit", "il lavoro da remoto", "o trabalho remoto")),
    ("A2", 5): (("🎫", "el fin de semana", "the weekend", "le week-end", "das Wochenende", "il fine settimana", "o fim de semana"), ("🌄", "quiero visitar", "I want to visit", "je veux visiter", "ich möchte besuchen", "voglio visitare", "quero visitar"), ("📞", "quedamos mañana", "we will meet tomorrow", "on se voit demain", "wir treffen uns morgen", "ci vediamo domani", "nos vemos amanhã")),
    ("B1", 1): (("📚", "una experiencia inolvidable", "an unforgettable experience", "une expérience inoubliable", "ein unvergessliches Erlebnis", "un'esperienza indimenticabile", "uma experiência inesquecível"), ("🗺️", "cuando viajé solo", "when I travelled alone", "quand j'ai voyagé seul", "als ich allein reiste", "quando ho viaggiato da solo", "quando viajei sozinho"), ("✨", "aprendí mucho", "I learned a lot", "j'ai beaucoup appris", "ich habe viel gelernt", "ho imparato molto", "aprendi muito")),
    ("B1", 2): (("💭", "desde mi punto de vista", "from my point of view", "de mon point de vue", "aus meiner Sicht", "dal mio punto di vista", "do meu ponto de vista"), ("👍", "estoy de acuerdo", "I agree", "je suis d'accord", "ich stimme zu", "sono d'accordo", "concordo"), ("🔍", "depende de la situación", "it depends on the situation", "cela dépend de la situation", "es kommt auf die Situation an", "dipende dalla situazione", "depende da situação")),
    ("B1", 3): (("🔧", "se me ha roto", "it has broken", "ça s'est cassé", "es ist kaputtgegangen", "si è rotto", "quebrou"), ("🏥", "pedir una cita", "make an appointment", "prendre rendez-vous", "einen Termin vereinbaren", "prendere un appuntamento", "marcar uma consulta"), ("📦", "presentar una reclamación", "make a complaint", "déposer une réclamation", "eine Beschwerde einreichen", "presentare un reclamo", "fazer uma reclamação")),
    ("B1", 4): (("🧑‍🤝‍🧑", "la igualdad de oportunidades", "equal opportunities", "l'égalité des chances", "Chancengleichheit", "le pari opportunità", "a igualdade de oportunidades"), ("🩺", "llevar una vida saludable", "lead a healthy life", "mener une vie saine", "ein gesundes Leben führen", "condurre una vita sana", "levar uma vida saudável"), ("🌍", "proteger el medio ambiente", "protect the environment", "protéger l'environnement", "die Umwelt schützen", "proteggere l'ambiente", "proteger o meio ambiente")),
    ("B1", 5): (("🔀", "he cambiado de opinión", "I have changed my mind", "j'ai changé d'avis", "ich habe meine Meinung geändert", "ho cambiato idea", "mudei de ideia"), ("🚀", "espero conseguirlo", "I hope to achieve it", "j'espère y arriver", "ich hoffe, es zu schaffen", "spero di riuscirci", "espero conseguir"), ("🧭", "mi objetivo principal", "my main goal", "mon objectif principal", "mein Hauptziel", "il mio obiettivo principale", "meu objetivo principal")),
    ("B2", 1): (("📽️", "el objetivo de esta presentación", "the aim of this presentation", "l'objectif de cette présentation", "das Ziel dieser Präsentation", "l'obiettivo di questa presentazione", "o objetivo desta apresentação"), ("📈", "analizar los resultados", "analyse the results", "analyser les résultats", "die Ergebnisse analysieren", "analizzare i risultati", "analisar os resultados"), ("🧾", "para concluir", "to conclude", "pour conclure", "abschließend", "per concludere", "para concluir")),
    ("B2", 2): (("⚔️", "un argumento convincente", "a convincing argument", "un argument convaincant", "ein überzeugendes Argument", "un argomento convincente", "um argumento convincente"), ("🧱", "la principal objeción", "the main objection", "la principale objection", "der Haupteinwand", "la principale obiezione", "a principal objeção"), ("🔗", "una conclusión razonable", "a reasonable conclusion", "une conclusion raisonnable", "eine vernünftige Schlussfolgerung", "una conclusione ragionevole", "uma conclusão razoável")),
    ("B2", 3): (("✉️", "adjunto encontrará", "attached you will find", "vous trouverez ci-joint", "anbei finden Sie", "in allegato troverà", "em anexo encontrará"), ("📆", "posponer la reunión", "postpone the meeting", "reporter la réunion", "das Treffen verschieben", "rimandare la riunione", "adiar a reunião"), ("📌", "prioridad del proyecto", "project priority", "priorité du projet", "Projektpriorität", "priorità del progetto", "prioridade do projeto")),
    ("B2", 4): (("📰", "la cobertura mediática", "media coverage", "la couverture médiatique", "die Medienberichterstattung", "la copertura mediatica", "a cobertura da mídia"), ("🎭", "una obra contemporánea", "a contemporary work", "une œuvre contemporaine", "ein zeitgenössisches Werk", "un'opera contemporanea", "uma obra contemporânea"), ("📣", "la opinión pública", "public opinion", "l'opinion publique", "die öffentliche Meinung", "l'opinione pubblica", "a opinião pública")),
    ("B2", 5): (("🤝", "una propuesta alternativa", "an alternative proposal", "une proposition alternative", "ein alternativer Vorschlag", "una proposta alternativa", "uma proposta alternativa"), ("⚖️", "beneficio mutuo", "mutual benefit", "bénéfice mutuel", "gegenseitiger Nutzen", "beneficio reciproco", "benefício mútuo"), ("📝", "establecer las condiciones", "set the conditions", "fixer les conditions", "die Bedingungen festlegen", "stabilire le condizioni", "estabelecer as condições")),
    ("C1", 1): (("🎓", "el marco teórico", "the theoretical framework", "le cadre théorique", "der theoretische Rahmen", "il quadro teorico", "o referencial teórico"), ("📐", "la metodología empleada", "the methodology used", "la méthodologie employée", "die verwendete Methodik", "la metodologia impiegata", "a metodologia empregada"), ("🏁", "las conclusiones preliminares", "the preliminary conclusions", "les conclusions préliminaires", "die vorläufigen Schlussfolgerungen", "le conclusioni preliminari", "as conclusões preliminares")),
    ("C1", 2): (("🪶", "una distinción sutil", "a subtle distinction", "une distinction subtile", "eine subtile Unterscheidung", "una distinzione sottile", "uma distinção sutil"), ("🔎", "conviene relativizar", "it should be qualified", "il convient de nuancer", "man sollte relativieren", "occorre relativizzare", "convém relativizar"), ("🧠", "una postura ambivalente", "an ambivalent stance", "une position ambivalente", "eine ambivalente Haltung", "una posizione ambivalente", "uma posição ambivalente")),
    ("C1", 3): (("📑", "una fuente fidedigna", "a reliable source", "une source fiable", "eine zuverlässige Quelle", "una fonte attendibile", "uma fonte confiável"), ("🧪", "verificar la hipótesis", "verify the hypothesis", "vérifier l'hypothèse", "die Hypothese überprüfen", "verificare l'ipotesi", "verificar a hipótese"), ("⚠️", "un sesgo de confirmación", "a confirmation bias", "un biais de confirmation", "ein Bestätigungsfehler", "un pregiudizio di conferma", "um viés de confirmação")),
    ("C1", 4): (("🕊️", "un punto de inflexión", "a turning point", "un tournant", "ein Wendepunkt", "un punto di svolta", "um ponto de inflexão"), ("🌉", "tender puentes", "build bridges", "jeter des ponts", "Brücken bauen", "costruire ponti", "construir pontes"), ("🤲", "una concesión estratégica", "a strategic concession", "une concession stratégique", "ein strategisches Zugeständnis", "una concessione strategica", "uma concessão estratégica")),
    ("C1", 5): (("🏛️", "un planteamiento riguroso", "a rigorous approach", "une approche rigoureuse", "ein rigoroser Ansatz", "un approccio rigoroso", "uma abordagem rigorosa"), ("📜", "el registro institucional", "the institutional register", "le registre institutionnel", "das institutionelle Register", "il registro istituzionale", "o registro institucional"), ("🎙️", "una formulación precisa", "a precise formulation", "une formulation précise", "eine präzise Formulierung", "una formulazione precisa", "uma formulação precisa")),
}


def seed_contenido_por_nivel(db: Session) -> None:
    """Crea y actualiza las lecciones CEFR con contenido diferenciado por nivel."""
    changed = False
    for idioma in db.query(Idioma).all():
        for nivel, lecciones in LECCIONES_POR_NIVEL.items():
            curso = db.query(Curso).filter(Curso.idioma_id == idioma.id, Curso.nivel == nivel).first()
            if curso is None:
                curso = Curso(idioma_id=idioma.id, nivel=nivel)
                db.add(curso)
                db.flush()
                changed = True

            for orden, (titulo, xp_recompensa) in enumerate(lecciones, start=1):
                leccion = db.query(Leccion).filter(Leccion.curso_id == curso.id, Leccion.orden == orden).first()
                if leccion is None:
                    leccion = Leccion(curso_id=curso.id, orden=orden, titulo=titulo, xp_recompensa=xp_recompensa)
                    db.add(leccion)
                    db.flush()
                    changed = True
                elif leccion.titulo != titulo or leccion.xp_recompensa != xp_recompensa:
                    leccion.titulo = titulo
                    leccion.xp_recompensa = xp_recompensa
                    changed = True

                palabras = VOCABULARIO_POR_LECCION[(nivel, orden)]
                actuales = [
                    (p.emoji, p.fuente, p.traduccion_en, p.traduccion_fr, p.traduccion_de, p.traduccion_it, p.traduccion_pt)
                    for p in leccion.vocabulario
                ]
                if actuales == list(palabras):
                    continue
                db.query(LeccionVocabulario).filter(LeccionVocabulario.leccion_id == leccion.id).delete()
                for emoji, fuente, en, fr, de, it, pt in palabras:
                    db.add(LeccionVocabulario(
                        leccion_id=leccion.id, emoji=emoji, fuente=fuente,
                        traduccion_en=en, traduccion_fr=fr, traduccion_de=de,
                        traduccion_it=it, traduccion_pt=pt,
                    ))
                changed = True
    if changed:
        db.commit()


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
