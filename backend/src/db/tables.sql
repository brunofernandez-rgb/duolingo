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
    codigo VARCHAR(10) NOT NULL UNIQUE
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
    xp_recompensa INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_leccion_curso FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE CASCADE
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