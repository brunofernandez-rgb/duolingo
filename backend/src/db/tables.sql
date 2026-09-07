CREATE TABLE usuario (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    xp_total INT NOT NULL DEFAULT 0,
    racha_dias INT NOT NULL DEFAULT 0,
    fecha_ultima_actividad TIMESTAMP
);

CREATE TABLE idioma (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    bandera_url VARCHAR(255)
);

CREATE TABLE insignia (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    criterio TEXT NOT NULL
);

CREATE TABLE curso (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idioma_id INT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    CONSTRAINT fk_curso_idioma FOREIGN KEY (idioma_id) REFERENCES idioma(id) ON DELETE CASCADE
);

CREATE TABLE leccion (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    curso_id INT NOT NULL,
    orden INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    xp_recompensa INT NOT NULL DEFAULT 5,
    CONSTRAINT fk_leccion_curso FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE CASCADE,
    CONSTRAINT uq_leccion_curso_orden UNIQUE (curso_id, orden),
    CONSTRAINT ck_leccion_xp_recompensa CHECK (xp_recompensa BETWEEN 5 AND 50)
);

CREATE TABLE leccion_vocabulario (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leccion_id INT NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    fuente VARCHAR(255) NOT NULL,
    traduccion_en VARCHAR(255) NOT NULL,
    traduccion_fr VARCHAR(255) NOT NULL,
    traduccion_de VARCHAR(255) NOT NULL,
    traduccion_it VARCHAR(255) NOT NULL,
    traduccion_pt VARCHAR(255) NOT NULL,
    CONSTRAINT fk_vocabulario_leccion FOREIGN KEY (leccion_id) REFERENCES leccion(id) ON DELETE CASCADE
);

INSERT INTO leccion_vocabulario (leccion_id, emoji, fuente, traduccion_en, traduccion_fr, traduccion_de, traduccion_it, traduccion_pt)
SELECT l.id, v.emoji, v.fuente, v.traduccion_en, v.traduccion_fr, v.traduccion_de, v.traduccion_it, v.traduccion_pt
FROM leccion l
JOIN (VALUES
    (1, '👋', 'hola', 'hello', 'bonjour', 'hallo', 'ciao', 'olá'),
    (1, '😊', 'mucho gusto', 'nice to meet you', 'enchanté', 'freut mich', 'piacere', 'prazer'),
    (1, '🙋', 'me llamo', 'my name is', 'je m''appelle', 'ich heiße', 'mi chiamo', 'meu nome é'),
    (1, '❓', '¿cómo estás?', 'how are you?', 'comment ça va ?', 'wie geht''s?', 'come stai?', 'como vai?'),
    (1, '🙏', 'gracias', 'thank you', 'merci', 'danke', 'grazie', 'obrigado'),
    (1, '👋', 'adiós', 'goodbye', 'au revoir', 'tschüss', 'arrivederci', 'tchau'),
    (2, '1️⃣', 'uno', 'one', 'un', 'eins', 'uno', 'um'),
    (2, '2️⃣', 'dos', 'two', 'deux', 'zwei', 'due', 'dois'),
    (2, '3️⃣', 'tres', 'three', 'trois', 'drei', 'tre', 'três'),
    (2, '4️⃣', 'cuatro', 'four', 'quatre', 'vier', 'quattro', 'quatro'),
    (2, '5️⃣', 'cinco', 'five', 'cinq', 'fünf', 'cinque', 'cinco'),
    (2, '🔟', 'diez', 'ten', 'dix', 'zehn', 'dieci', 'dez'),
    (3, '👩', 'madre', 'mother', 'mère', 'Mutter', 'madre', 'mãe'),
    (3, '👨', 'padre', 'father', 'père', 'Vater', 'padre', 'pai'),
    (3, '👧', 'hermana', 'sister', 'sœur', 'Schwester', 'sorella', 'irmã'),
    (3, '👦', 'hermano', 'brother', 'frère', 'Bruder', 'fratello', 'irmão'),
    (3, '👵', 'abuela', 'grandmother', 'grand-mère', 'Oma', 'nonna', 'avó'),
    (3, '👶', 'bebé', 'baby', 'bébé', 'Baby', 'bambino', 'bebê'),
    (4, '🍎', 'manzana', 'apple', 'pomme', 'Apfel', 'mela', 'maçã'),
    (4, '🍞', 'pan', 'bread', 'pain', 'Brot', 'pane', 'pão'),
    (4, '💧', 'agua', 'water', 'eau', 'Wasser', 'acqua', 'água'),
    (4, '🥛', 'leche', 'milk', 'lait', 'Milch', 'latte', 'leite'),
    (4, '🧀', 'queso', 'cheese', 'fromage', 'Käse', 'formaggio', 'queijo'),
    (4, '☕', 'café', 'coffee', 'café', 'Kaffee', 'caffè', 'café'),
    (5, '🔴', 'rojo', 'red', 'rouge', 'rot', 'rosso', 'vermelho'),
    (5, '🔵', 'azul', 'blue', 'bleu', 'blau', 'blu', 'azul'),
    (5, '🟢', 'verde', 'green', 'vert', 'grün', 'verde', 'verde'),
    (5, '🟡', 'amarillo', 'yellow', 'jaune', 'gelb', 'giallo', 'amarelo'),
    (5, '⚫', 'negro', 'black', 'noir', 'schwarz', 'nero', 'preto'),
    (5, '⚪', 'blanco', 'white', 'blanc', 'weiß', 'bianco', 'branco'),
    (6, '🐧', 'pingüino', 'penguin', 'manchot', 'Pinguin', 'pinguino', 'pinguim'),
    (6, '🐶', 'perro', 'dog', 'chien', 'Hund', 'cane', 'cachorro'),
    (6, '🐱', 'gato', 'cat', 'chat', 'Katze', 'gatto', 'gato'),
    (6, '🐦', 'pájaro', 'bird', 'oiseau', 'Vogel', 'uccello', 'pássaro'),
    (6, '🐟', 'pez', 'fish', 'poisson', 'Fisch', 'pesce', 'peixe'),
    (6, '🐴', 'caballo', 'horse', 'cheval', 'Pferd', 'cavallo', 'cavalo'),
    (7, '🏙️', 'ciudad', 'city', 'ville', 'Stadt', 'città', 'cidade'),
    (7, '🛣️', 'calle', 'street', 'rue', 'Straße', 'strada', 'rua'),
    (7, '🏛️', 'museo', 'museum', 'musée', 'Museum', 'museo', 'museu'),
    (7, '🏪', 'tienda', 'shop', 'magasin', 'Geschäft', 'negozio', 'loja'),
    (7, '🚉', 'estación', 'station', 'gare', 'Bahnhof', 'stazione', 'estação'),
    (7, '🌳', 'parque', 'park', 'parc', 'Park', 'parco', 'parque'),
    (8, '✈️', 'avión', 'plane', 'avion', 'Flugzeug', 'aereo', 'avião'),
    (8, '🎟️', 'billete', 'ticket', 'billet', 'Ticket', 'biglietto', 'bilhete'),
    (8, '🧳', 'maleta', 'suitcase', 'valise', 'Koffer', 'valigia', 'mala'),
    (8, '🏨', 'hotel', 'hotel', 'hôtel', 'Hotel', 'albergo', 'hotel'),
    (8, '🗺️', 'mapa', 'map', 'carte', 'Karte', 'mappa', 'mapa'),
    (8, '🏖️', 'playa', 'beach', 'plage', 'Strand', 'spiaggia', 'praia')
) AS v(orden, emoji, fuente, traduccion_en, traduccion_fr, traduccion_de, traduccion_it, traduccion_pt)
ON v.orden = l.orden
WHERE NOT EXISTS (
    SELECT 1 FROM leccion_vocabulario lv WHERE lv.leccion_id = l.id
);

CREATE TABLE progreso (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    leccion_id INT NOT NULL,
    puntaje INT NOT NULL DEFAULT 0,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_progreso_leccion FOREIGN KEY (leccion_id) REFERENCES leccion(id) ON DELETE CASCADE
);

CREATE TABLE usuario_cursos (
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, curso_id),
    CONSTRAINT fk_uc_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_uc_curso FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE CASCADE
);

CREATE TABLE usuario_insignias (
    usuario_id INT NOT NULL,
    insignia_id INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, insignia_id),
    CONSTRAINT fk_ui_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_ui_insignia FOREIGN KEY (insignia_id) REFERENCES insignia(id) ON DELETE CASCADE
);

CREATE TABLE amigos (
    usuario_a INT NOT NULL,
    usuario_b INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_a, usuario_b),
    CONSTRAINT fk_amigos_usuario_a FOREIGN KEY (usuario_a) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_amigos_usuario_b FOREIGN KEY (usuario_b) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT chk_amigos_diferentes CHECK (usuario_a <> usuario_b)
);

CREATE TABLE solicitud_amistad (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitante_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitud_solicitante FOREIGN KEY (solicitante_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT chk_solicitud_usuarios_diferentes CHECK (solicitante_id <> destinatario_id)
);

INSERT INTO idioma (nombre, codigo) VALUES
    ('Español', 'es'),
    ('Inglés', 'en'),
    ('Portugués', 'pt'),
    ('Italiano', 'it'),
    ('Francés', 'fr'),
    ('Alemán', 'de')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO curso (idioma_id, nivel)
SELECT idioma.id, 'A1'
FROM idioma
WHERE NOT EXISTS (
    SELECT 1 FROM curso
    WHERE curso.idioma_id = idioma.id AND curso.nivel = 'A1'
);

INSERT INTO curso (idioma_id, nivel)
SELECT idioma.id, niveles.nivel
FROM idioma
CROSS JOIN (VALUES ('A2'), ('B1'), ('B2'), ('C1')) AS niveles(nivel)
WHERE NOT EXISTS (
    SELECT 1 FROM curso
    WHERE curso.idioma_id = idioma.id AND curso.nivel = niveles.nivel
);

INSERT INTO leccion (curso_id, orden, titulo, xp_recompensa)
SELECT curso.id, lecciones.orden, lecciones.titulo, lecciones.xp_recompensa
FROM curso
CROSS JOIN (VALUES
    (1, 'Saludos y presentaciones', 10),
    (2, 'Personas y familia', 10),
    (3, 'Comida y bebida', 15),
    (4, 'Rutinas diarias', 15),
    (5, 'Conversaciones básicas', 20)
) AS lecciones(orden, titulo, xp_recompensa)
WHERE NOT EXISTS (
    SELECT 1 FROM leccion
    WHERE leccion.curso_id = curso.id AND leccion.orden = lecciones.orden
);

INSERT INTO insignia (nombre, descripcion, criterio)
SELECT idioma.nombre || ' C1 completado',
       'Completá todas las lecciones del nivel C1 de ' || idioma.nombre,
       'curso_completado:' || idioma.codigo || ':C1'
FROM idioma
WHERE NOT EXISTS (
    SELECT 1 FROM insignia
    WHERE insignia.criterio = 'curso_completado:' || idioma.codigo || ':C1'
);

DELETE FROM leccion_vocabulario;

INSERT INTO leccion_vocabulario (leccion_id, emoji, fuente, traduccion_en, traduccion_fr, traduccion_de, traduccion_it, traduccion_pt)
SELECT l.id, v.emoji, v.fuente, v.traduccion_en, v.traduccion_fr, v.traduccion_de, v.traduccion_it, v.traduccion_pt
FROM leccion l
JOIN (VALUES
    (1, '👋', 'hola', 'hello', 'bonjour', 'hallo', 'ciao', 'olá'),
    (1, '😊', 'mucho gusto', 'nice to meet you', 'enchanté', 'freut mich', 'piacere', 'prazer'),
    (1, '🙋', 'me llamo', 'my name is', 'je m''appelle', 'ich heiße', 'mi chiamo', 'meu nome é'),
    (1, '❓', '¿cómo estás?', 'how are you?', 'comment ça va ?', 'wie geht''s?', 'come stai?', 'como vai?'),
    (1, '🙏', 'gracias', 'thank you', 'merci', 'danke', 'grazie', 'obrigado'),
    (1, '👋', 'adiós', 'goodbye', 'au revoir', 'tschüss', 'arrivederci', 'tchau'),
    (2, '👩', 'madre', 'mother', 'mère', 'Mutter', 'madre', 'mãe'),
    (2, '👨', 'padre', 'father', 'père', 'Vater', 'padre', 'pai'),
    (2, '👧', 'hermana', 'sister', 'sœur', 'Schwester', 'sorella', 'irmã'),
    (2, '👦', 'hermano', 'brother', 'frère', 'Bruder', 'fratello', 'irmão'),
    (2, '👵', 'abuela', 'grandmother', 'grand-mère', 'Oma', 'nonna', 'avó'),
    (2, '👶', 'bebé', 'baby', 'bébé', 'Baby', 'bambino', 'bebê'),
    (3, '🍎', 'manzana', 'apple', 'pomme', 'Apfel', 'mela', 'maçã'),
    (3, '🍞', 'pan', 'bread', 'pain', 'Brot', 'pane', 'pão'),
    (3, '💧', 'agua', 'water', 'eau', 'Wasser', 'acqua', 'água'),
    (3, '🥛', 'leche', 'milk', 'lait', 'Milch', 'latte', 'leite'),
    (3, '🧀', 'queso', 'cheese', 'fromage', 'Käse', 'formaggio', 'queijo'),
    (3, '☕', 'café', 'coffee', 'café', 'Kaffee', 'caffè', 'café'),
    (4, '⏰', 'despertarse', 'wake up', 'se réveiller', 'aufwachen', 'svegliarsi', 'acordar'),
    (4, '🍳', 'desayunar', 'have breakfast', 'prendre le petit-déjeuner', 'frühstücken', 'fare colazione', 'tomar café da manhã'),
    (4, '🚿', 'ducharse', 'take a shower', 'prendre une douche', 'duschen', 'fare la doccia', 'tomar banho'),
    (4, '📚', 'estudiar', 'study', 'étudier', 'lernen', 'studiare', 'estudar'),
    (4, '🍽️', 'cenar', 'have dinner', 'dîner', 'zu Abend essen', 'cenare', 'jantar'),
    (4, '🛏️', 'dormir', 'sleep', 'dormir', 'schlafen', 'dormire', 'dormir'),
    (5, '🙏', 'por favor', 'please', 's''il vous plaît', 'bitte', 'per favore', 'por favor'),
    (5, '🙇', 'perdón', 'sorry', 'pardon', 'Entschuldigung', 'scusa', 'desculpa'),
    (5, '📍', '¿dónde está?', 'where is it?', 'où est-ce ?', 'wo ist es?', 'dov''è?', 'onde fica?'),
    (5, '💬', 'no entiendo', 'I do not understand', 'je ne comprends pas', 'ich verstehe nicht', 'non capisco', 'não entendo'),
    (5, '🔁', 'repita, por favor', 'please repeat', 'répétez, s''il vous plaît', 'bitte wiederholen', 'ripeta, per favore', 'repita, por favor'),
    (5, '✅', 'hasta luego', 'see you later', 'à bientôt', 'bis später', 'a dopo', 'até logo')
) AS v(orden, emoji, fuente, traduccion_en, traduccion_fr, traduccion_de, traduccion_it, traduccion_pt)
ON v.orden = l.orden
WHERE NOT EXISTS (
    SELECT 1 FROM leccion_vocabulario lv WHERE lv.leccion_id = l.id AND lv.fuente = v.fuente
);

INSERT INTO insignia (nombre, descripcion, criterio)
SELECT insignias.nombre, insignias.descripcion, insignias.criterio
FROM (VALUES
    ('Primeros pasos', 'Alcanzá 100 XP', 'xp >= 100'),
    ('Semana perfecta', 'Mantené una racha de 7 días', 'racha >= 7'),
    ('Estudiante dedicado', 'Completá 20 lecciones', 'lecciones_completadas >= 20')
) AS insignias(nombre, descripcion, criterio)
WHERE NOT EXISTS (
    SELECT 1 FROM insignia WHERE insignia.criterio = insignias.criterio
);
