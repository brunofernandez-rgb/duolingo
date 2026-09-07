const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export interface ApiUsuario {
  id: number;
  email: string;
  nombre: string;
  xp_total: number;
  racha_dias: number;
  fecha_ultima_actividad: string | null;
}

export interface ApiIdioma {
  id: number;
  nombre: string;
  codigo: string;
  bandera_url: string | null;
}

export interface ApiCurso {
  id: number;
  idioma_id: number;
  nivel: string;
  idioma_nombre: string;
  idioma_codigo: string;
}

export interface ApiLeccion {
  id: number;
  curso_id: number;
  orden: number;
  titulo: string;
  xp_recompensa: number;
  curso_nivel: string;
  idioma_id: number;
  idioma_nombre: string;
  idioma_codigo: string;
  vocabulario: { emoji: string; fuente: string; traduccion: string; significados: Record<string, string> }[];
}

export interface CreateVocabulario {
  fuente: string;
  traduccion: string;
}

export interface ApiInscripcion {
  usuario_id: number;
  curso_id: number;
  fecha_inscripcion: string;
  curso_nivel: string;
  idioma_id: number;
  idioma_nombre: string;
  idioma_codigo: string;
}

export interface ApiToken {
  access_token: string;
  token_type: string;
}

export interface ApiProgresoCurso {
  curso_id: number;
  total_lecciones: number;
  completadas: number;
  porcentaje: number;
  proxima_leccion_id: number | null;
}

export interface ApiActividadDiaria {
  fecha: string;
  xp: number;
  lecciones_completadas: number;
}

export interface ApiRankingUser extends ApiUsuario {}

export interface ApiAmigo {
  usuario_a: number;
  usuario_b: number;
  amigo_id: number;
  amigo_email: string;
  amigo_nombre: string;
  amigo_xp_total: number;
  amigo_racha_dias: number;
  fecha: string;
}

export interface ApiRankingAmigosItem {
  posicion: number;
  usuario_id: number;
  nombre: string;
  email: string;
  xp_total: number;
  racha_dias: number;
}

export interface ApiSolicitudAmistad {
  id: number;
  solicitante_id: number;
  destinatario_id: number;
  estado: string;
  fecha: string;
  solicitante_nombre: string;
  solicitante_email: string;
}

export interface ApiInsignia {
  usuario_id: number;
  insignia_id: number;
  fecha: string;
  insignia_nombre: string;
  insignia_descripcion: string | null;
  insignia_criterio: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("pingu.token");
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = "No se pudo completar la solicitud";
    try {
      const body = (await response.json()) as { detail?: string; message?: string };
      message = body.detail ?? body.message ?? message;
    } catch {
      // Keep a useful generic message for non-JSON errors.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<ApiToken>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  resetPassword: (email: string, password: string) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (nombre: string, email: string, password: string) =>
    request<ApiToken>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nombre, email, password }),
    }),
  usuario: (id: number) => request<ApiUsuario>(`/usuarios/${id}`),
  verificarPassword: (id: number, password: string) =>
    request<{ verified: boolean }>(`/usuarios/${id}/verificar-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  eliminarCuenta: (id: number, password: string) =>
    request<void>(`/usuarios/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
  cambiarPassword: (id: number, passwordActual: string, passwordNueva: string) =>
    request<void>(`/usuarios/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password_actual: passwordActual, password_nueva: passwordNueva }),
    }),
  cambiarNombre: (id: number, nombre: string) =>
    request<void>(`/usuarios/${id}/nombre`, {
      method: "PATCH",
      body: JSON.stringify({ nombre }),
    }),
  usuariosAdmin: () => request<ApiUsuario[]>("/usuarios/"),
  eliminarUsuarioComoAdmin: (id: number) =>
    request<void>(`/usuarios/${id}/admin`, { method: "DELETE" }),
  idiomas: () => request<ApiIdioma[]>("/idiomas/"),
  crearIdioma: (nombre: string, codigo: string, bandera_url: string) => request<ApiIdioma>("/idiomas/", {
    method: "POST",
    body: JSON.stringify({ nombre, codigo, bandera_url }),
  }),
  eliminarIdioma: (id: number) => request<void>(`/idiomas/${id}`, { method: "DELETE" }),
  cursos: () => request<ApiCurso[]>("/cursos/"),
  crearCurso: (idioma_id: number, nivel: string) => request<ApiCurso>("/cursos/", {
    method: "POST",
    body: JSON.stringify({ idioma_id, nivel }),
  }),
  curso: (id: number) => request<ApiCurso>(`/cursos/${id}`),
  lecciones: (cursoId: number) => request<ApiLeccion[]>(`/lecciones/curso/${cursoId}`),
  leccion: (id: number) => request<ApiLeccion>(`/lecciones/${id}`),
  crearLeccion: (curso_id: number, orden: number, titulo: string, xp_recompensa: number, vocabulario: CreateVocabulario[]) => request<ApiLeccion>("/lecciones/", {
    method: "POST",
    body: JSON.stringify({ curso_id, orden, titulo, xp_recompensa, vocabulario }),
  }),
  eliminarCurso: (id: number) => request<void>(`/cursos/${id}`, { method: "DELETE" }),
  eliminarLeccion: (id: number) => request<void>(`/lecciones/${id}`, { method: "DELETE" }),
  progresoCurso: (usuarioId: number, cursoId: number) =>
    request<ApiProgresoCurso>(`/usuarios/${usuarioId}/cursos/${cursoId}/progreso`),
  actividad: (usuarioId: number, desde: string, hasta: string) =>
    request<ApiActividadDiaria[]>(`/progresos/usuarios/${usuarioId}/actividad?desde=${desde}&hasta=${hasta}`),
  intento: (usuarioId: number, leccionId: number, puntaje: number) => {
    if (!Number.isInteger(usuarioId) || usuarioId <= 0 || !Number.isInteger(leccionId) || leccionId <= 0) {
      throw new ApiError("Sesión o lección inválida. Iniciá sesión nuevamente.", 400);
    }
    const puntajeNormalizado = Number.isFinite(puntaje)
      ? Math.min(100, Math.max(0, Math.round(puntaje)))
      : 0;
    return request("/progresos/intentos", {
      method: "POST",
      body: JSON.stringify({ usuario_id: usuarioId, leccion_id: leccionId, puntaje: puntajeNormalizado }),
    });
  },
  ranking: (periodo: "global" | "semanal" | "mensual") =>
    request<ApiRankingUser[]>(`/usuarios/ranking?periodo=${periodo}`),
  amigos: (usuarioId: number) => request<ApiAmigo[]>(`/usuarios/${usuarioId}/amigos`),
  rankingAmigos: (usuarioId: number) => request<ApiRankingAmigosItem[]>(`/usuarios/${usuarioId}/ranking-amigos`),
  solicitarAmigo: (usuarioId: number, email: string) =>
    request<ApiSolicitudAmistad>("/solicitudes-amistad/", {
      method: "POST",
      body: JSON.stringify({ solicitante_id: usuarioId, email }),
    }),
  solicitudesAmistad: (usuarioId: number) =>
    request<ApiSolicitudAmistad[]>(`/solicitudes-amistad/recibidas/${usuarioId}`),
  responderSolicitud: (solicitudId: number, usuarioId: number, aceptar: boolean) =>
    request<ApiSolicitudAmistad>(`/solicitudes-amistad/${solicitudId}`, {
      method: "PATCH",
      body: JSON.stringify({ usuario_id: usuarioId, aceptar }),
    }),
  eliminarAmigo: (usuarioId: number, amigoId: number) =>
    request(`/amigos/${usuarioId}/${amigoId}`, { method: "DELETE" }),
  insignias: (usuarioId: number) => request<ApiInsignia[]>(`/usuario-insignias/usuarios/${usuarioId}`),
  inscribir: (usuarioId: number, cursoId: number) =>
    request(`/usuario-cursos/`, {
      method: "POST",
      body: JSON.stringify({ usuario_id: usuarioId, curso_id: cursoId }),
    }),
  inscripciones: (usuarioId: number) =>
    request<ApiInscripcion[]>(`/usuario-cursos/usuarios/${usuarioId}`),
  dejarCurso: (usuarioId: number, cursoId: number) =>
    request<void>(`/usuario-cursos/usuarios/${usuarioId}/cursos/${cursoId}`, { method: "DELETE" }),
};

export function usuarioIdDesdeToken(token: string): number {
  const payload = token.split(".")[1];
  if (!payload) throw new ApiError("Token inválido", 401);
  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
    sub?: string;
  };
  const id = Number(decoded.sub);
  if (!Number.isInteger(id)) throw new ApiError("Token sin usuario", 401);
  return id;
}
