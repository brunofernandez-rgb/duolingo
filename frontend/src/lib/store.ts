import { useSyncExternalStore } from "react";
import {
  IDIOMAS,
  TEMAS_POR_NIVEL,
  TEMAS_POR_ID,
  type Nivel,
  type TargetLang,
} from "@/data/content";
import type { UiLang } from "@/lib/i18n";

/* ---------------------------------- tipos --------------------------------- */

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  xp_total: number;
  racha_dias: number;
  fecha_ultima_actividad: string | null; // YYYY-MM-DD
}

export interface Curso {
  id: string;
  idioma_id: string;
  nivel: Nivel;
}

export interface Leccion {
  id: string;
  curso_id: string;
  orden: number;
  titulo: string;
  xp_recompensa: number;
  tema_id: string | null;
}

export interface Progreso {
  id: string;
  usuario_id: string;
  leccion_id: string;
  puntaje: number;
  completada: boolean;
  fecha: string; // ISO
}

export type CriterioTipo = "xp" | "racha" | "lecciones";
export interface Insignia {
  id: string;
  nombre: Record<UiLang, string>;
  descripcion: Record<UiLang, string>;
  emoji: string;
  criterio: { tipo: CriterioTipo; valor: number };
}

export interface UsuarioCurso {
  usuario_id: string;
  curso_id: string;
  fecha_inscripcion: string;
}
export interface UsuarioInsignia {
  usuario_id: string;
  insignia_id: string;
  fecha: string;
}
export interface Amistad {
  usuario_a: string;
  usuario_b: string;
  fecha: string;
}

export interface DBState {
  usuarios: Usuario[];
  cursos: Curso[];
  lecciones: Leccion[];
  progresos: Progreso[];
  usuario_cursos: UsuarioCurso[];
  usuario_insignias: UsuarioInsignia[];
  amigos: Amistad[];
  sesion: string | null;
  uiLang: UiLang;
}

/* -------------------------------- insignias ------------------------------- */

export const INSIGNIAS: Insignia[] = [
  {
    id: "ins_xp100",
    emoji: "🥉",
    criterio: { tipo: "xp", valor: 100 },
    nombre: { es: "Primeros pasos", en: "First steps", pt: "Primeiros passos" },
    descripcion: { es: "Alcanzá 100 XP", en: "Reach 100 XP", pt: "Alcance 100 XP" },
  },
  {
    id: "ins_xp500",
    emoji: "🥇",
    criterio: { tipo: "xp", valor: 500 },
    nombre: { es: "Imparable", en: "Unstoppable", pt: "Imparável" },
    descripcion: { es: "Alcanzá 500 XP", en: "Reach 500 XP", pt: "Alcance 500 XP" },
  },
  {
    id: "ins_racha3",
    emoji: "🔥",
    criterio: { tipo: "racha", valor: 3 },
    nombre: { es: "En llamas", en: "On fire", pt: "Pegando fogo" },
    descripcion: { es: "Racha de 3 días", en: "3 day streak", pt: "Ofensiva de 3 dias" },
  },
  {
    id: "ins_racha7",
    emoji: "🗓️",
    criterio: { tipo: "racha", valor: 7 },
    nombre: { es: "Semana perfecta", en: "Perfect week", pt: "Semana perfeita" },
    descripcion: { es: "Racha de 7 días", en: "7 day streak", pt: "Ofensiva de 7 dias" },
  },
  {
    id: "ins_lec5",
    emoji: "📘",
    criterio: { tipo: "lecciones", valor: 5 },
    nombre: { es: "Estudiante", en: "Student", pt: "Estudante" },
    descripcion: {
      es: "Completá 5 lecciones",
      en: "Complete 5 lessons",
      pt: "Conclua 5 lições",
    },
  },
  {
    id: "ins_lec20",
    emoji: "🎓",
    criterio: { tipo: "lecciones", valor: 20 },
    nombre: { es: "Erudito", en: "Scholar", pt: "Erudito" },
    descripcion: {
      es: "Completá 20 lecciones",
      en: "Complete 20 lessons",
      pt: "Conclua 20 lições",
    },
  },
];

/* --------------------------------- helpers -------------------------------- */

export const hoy = () => new Date().toISOString().slice(0, 10);
export const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const diffDias = (a: string, b: string) =>
  Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86400000);

/* ---------------------------------- seed ---------------------------------- */

function seed(): DBState {
  const cursos: Curso[] = [];
  const lecciones: Leccion[] = [];

  for (const idioma of IDIOMAS) {
    for (const nivel of ["A1", "A2"] as Nivel[]) {
      const curso: Curso = { id: `cur_${idioma.codigo}_${nivel}`, idioma_id: idioma.id, nivel };
      cursos.push(curso);
      TEMAS_POR_NIVEL[nivel].forEach((tema, i) => {
        lecciones.push({
          id: `lec_${idioma.codigo}_${nivel}_${tema.id}`,
          curso_id: curso.id,
          orden: i + 1,
          titulo: tema.titulo.es,
          xp_recompensa: 10 + i * 2,
          tema_id: tema.id,
        });
      });
    }
  }

  const demo: Usuario[] = [
    { id: "usr_lucia", email: "lucia@pingu.app", nombre: "Lucía", xp_total: 420, racha_dias: 9, fecha_ultima_actividad: hoy() },
    { id: "usr_mateo", email: "mateo@pingu.app", nombre: "Mateo", xp_total: 310, racha_dias: 4, fecha_ultima_actividad: hoy() },
    { id: "usr_sofia", email: "sofia@pingu.app", nombre: "Sofía", xp_total: 265, racha_dias: 12, fecha_ultima_actividad: hoy() },
    { id: "usr_bruno", email: "bruno@pingu.app", nombre: "Bruno", xp_total: 180, racha_dias: 2, fecha_ultima_actividad: hoy() },
    { id: "usr_ana", email: "ana@pingu.app", nombre: "Ana", xp_total: 95, racha_dias: 1, fecha_ultima_actividad: hoy() },
  ];

  // Progreso ficticio de los usuarios demo para poblar el ranking semanal.
  const progresos: Progreso[] = [];
  demo.forEach((u, idx) => {
    for (let d = 0; d < 5; d++) {
      const fecha = new Date(Date.now() - d * 86400000).toISOString();
      progresos.push({
        id: uid("pro"),
        usuario_id: u.id,
        leccion_id: lecciones[d % lecciones.length].id,
        puntaje: 80,
        completada: true,
        fecha,
      });
    }
    void idx;
  });

  return {
    usuarios: demo,
    cursos,
    lecciones,
    progresos,
    usuario_cursos: [],
    usuario_insignias: [],
    amigos: [],
    sesion: null,
    uiLang: "es",
  };
}

/* --------------------------------- store ---------------------------------- */

const KEY = "pingu.db.v1";
let state: DBState = seed();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export function hydrate() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DBState;
      state = { ...seed(), ...parsed };
      emit();
    }
  } catch {
    /* noop */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(mutator: (s: DBState) => void) {
  const next: DBState = JSON.parse(JSON.stringify(state));
  mutator(next);
  state = next;
  persist();
  emit();
}

export function useDB(): DBState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export const getState = () => state;

export function setRemoteSession(usuario: Usuario, token: string) {
  set((s) => {
    s.usuarios = s.usuarios.filter((u) => u.id !== String(usuario.id));
    s.usuarios.push({ ...usuario, id: String(usuario.id) });
    s.sesion = String(usuario.id);
  });
  localStorage.setItem("pingu.token", token);
}

/* ------------------------------- HU1 registro ------------------------------ */

export function registrar(nombre: string, email: string): { ok: boolean; error?: string } {
  const mail = email.trim().toLowerCase();
  if (state.usuarios.some((u) => u.email.toLowerCase() === mail))
    return { ok: false, error: "auth.emailTaken" };
  const usuario: Usuario = {
    id: uid("usr"),
    email: mail,
    nombre: nombre.trim(),
    xp_total: 0,
    racha_dias: 0,
    fecha_ultima_actividad: null,
  };
  set((s) => {
    s.usuarios.push(usuario);
    s.sesion = usuario.id;
  });
  return { ok: true };
}

export function iniciarSesion(email: string, _password: string): { ok: boolean; error?: string } {
  const mail = email.trim().toLowerCase();
  const u = state.usuarios.find((x) => x.email.toLowerCase() === mail);
  if (!u) return { ok: false, error: "auth.notFound" };
  set((s) => {
    s.sesion = u.id;
  });
  return { ok: true };
}

export function cerrarSesion() {
  set((s) => {
    s.sesion = null;
  });
  localStorage.removeItem("pingu.token");
}

export function setUiLang(lang: UiLang) {
  set((s) => {
    s.uiLang = lang;
  });
}

/* ------------------------------ HU2 inscripción ---------------------------- */

export function inscribirse(usuario_id: string, curso_id: string) {
  if (state.usuario_cursos.some((uc) => uc.usuario_id === usuario_id && uc.curso_id === curso_id))
    return { ok: false, error: "dup" };
  set((s) => {
    s.usuario_cursos.push({ usuario_id, curso_id, fecha_inscripcion: new Date().toISOString() });
  });
  return { ok: true };
}

export function estaInscripto(usuario_id: string, curso_id: string) {
  return state.usuario_cursos.some(
    (uc) => uc.usuario_id === usuario_id && uc.curso_id === curso_id,
  );
}

/* ------------------------------ HU3 contenido ------------------------------ */

export function crearCurso(idioma_id: string, nivel: Nivel) {
  if (state.cursos.some((c) => c.idioma_id === idioma_id && c.nivel === nivel))
    return { ok: false, error: "dup" };
  set((s) => {
    s.cursos.push({ id: uid("cur"), idioma_id, nivel });
  });
  return { ok: true };
}

export function crearLeccion(
  curso_id: string,
  orden: number,
  titulo: string,
  xp_recompensa: number,
  tema_id: string | null,
) {
  if (xp_recompensa < 5 || xp_recompensa > 50) return { ok: false, error: "admin.xp" };
  if (state.lecciones.some((l) => l.curso_id === curso_id && l.orden === orden))
    return { ok: false, error: "admin.orderTaken" };
  set((s) => {
    s.lecciones.push({ id: uid("lec"), curso_id, orden, titulo, xp_recompensa, tema_id });
  });
  return { ok: true };
}

/** GET /cursos/{id}/lecciones */
export function leccionesDeCurso(curso_id: string) {
  return state.lecciones.filter((l) => l.curso_id === curso_id).sort((a, b) => a.orden - b.orden);
}

/* ------------------------- HU4/HU5 completar lección ----------------------- */

export function leccionCompletada(usuario_id: string, leccion_id: string) {
  return state.progresos.some(
    (p) => p.usuario_id === usuario_id && p.leccion_id === leccion_id && p.completada,
  );
}

/** HU5: sólo se puede iniciar si la anterior por orden está completada. */
export function leccionDesbloqueada(usuario_id: string, leccion: Leccion) {
  if (leccion.orden === 1) return true;
  const previas = leccionesDeCurso(leccion.curso_id).filter((l) => l.orden < leccion.orden);
  const anterior = previas[previas.length - 1];
  if (!anterior) return true;
  return leccionCompletada(usuario_id, anterior.id);
}

export interface ResultadoLeccion {
  completada: boolean;
  xp: number;
  nuevasInsignias: Insignia[];
  racha: number;
}

export function completarLeccion(
  usuario_id: string,
  leccion_id: string,
  puntaje: number,
): ResultadoLeccion {
  const score = Math.max(0, Math.min(100, Math.round(puntaje)));
  const leccion = state.lecciones.find((l) => l.id === leccion_id)!;
  const completada = score >= 60;
  const yaEstaba = leccionCompletada(usuario_id, leccion_id);
  const xp = completada && !yaEstaba ? leccion.xp_recompensa : 0;
  const nuevas: Insignia[] = [];
  let rachaFinal = 0;

  set((s) => {
    s.progresos.push({
      id: uid("pro"),
      usuario_id,
      leccion_id,
      puntaje: score,
      completada,
      fecha: new Date().toISOString(),
    });

    const u = s.usuarios.find((x) => x.id === usuario_id)!;
    if (completada) {
      u.xp_total += xp;
      // HU6: racha diaria
      const d = hoy();
      if (u.fecha_ultima_actividad !== d) {
        const gap = u.fecha_ultima_actividad ? diffDias(u.fecha_ultima_actividad, d) : Infinity;
        u.racha_dias = gap === 1 ? u.racha_dias + 1 : 1;
        u.fecha_ultima_actividad = d;
      }
    }
    rachaFinal = u.racha_dias;

    // HU7: insignias automáticas
    const completadas = s.progresos.filter(
      (p) => p.usuario_id === usuario_id && p.completada,
    ).length;
    for (const ins of INSIGNIAS) {
      const ya = s.usuario_insignias.some(
        (ui) => ui.usuario_id === usuario_id && ui.insignia_id === ins.id,
      );
      if (ya) continue;
      const valor =
        ins.criterio.tipo === "xp"
          ? u.xp_total
          : ins.criterio.tipo === "racha"
            ? u.racha_dias
            : completadas;
      if (valor >= ins.criterio.valor) {
        s.usuario_insignias.push({
          usuario_id,
          insignia_id: ins.id,
          fecha: new Date().toISOString(),
        });
        nuevas.push(ins);
      }
    }
  });

  return { completada, xp, nuevasInsignias: nuevas, racha: rachaFinal };
}

/** HU6: si pasó un día entero sin actividad, la racha vuelve a 0. */
export function recalcularRachas() {
  const d = hoy();
  const hayQueResetear = state.usuarios.some(
    (u) => u.racha_dias > 0 && u.fecha_ultima_actividad && diffDias(u.fecha_ultima_actividad, d) > 1,
  );
  if (!hayQueResetear) return;
  set((s) => {
    for (const u of s.usuarios) {
      if (u.racha_dias > 0 && u.fecha_ultima_actividad && diffDias(u.fecha_ultima_actividad, d) > 1)
        u.racha_dias = 0;
    }
  });
}

/* --------------------------------- HU8 amigos ------------------------------ */

export function agregarAmigo(usuario_id: string, email: string) {
  const otro = state.usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!otro) return { ok: false, error: "auth.notFound" };
  if (otro.id === usuario_id) return { ok: false, error: "friends.self" };
  const existe = state.amigos.some(
    (a) =>
      (a.usuario_a === usuario_id && a.usuario_b === otro.id) ||
      (a.usuario_b === usuario_id && a.usuario_a === otro.id),
  );
  if (existe) return { ok: false, error: "friends.dup" };
  set((s) => {
    s.amigos.push({ usuario_a: usuario_id, usuario_b: otro.id, fecha: new Date().toISOString() });
  });
  return { ok: true };
}

export function eliminarAmigo(usuario_id: string, otro_id: string) {
  set((s) => {
    s.amigos = s.amigos.filter(
      (a) =>
        !(
          (a.usuario_a === usuario_id && a.usuario_b === otro_id) ||
          (a.usuario_b === usuario_id && a.usuario_a === otro_id)
        ),
    );
  });
}

export function amigosDe(usuario_id: string, s: DBState = state): Usuario[] {
  const ids = s.amigos
    .filter((a) => a.usuario_a === usuario_id || a.usuario_b === usuario_id)
    .map((a) => (a.usuario_a === usuario_id ? a.usuario_b : a.usuario_a));
  return ids.map((id) => s.usuarios.find((u) => u.id === id)!).filter(Boolean);
}

/* --------------------------------- rankings -------------------------------- */

export function xpUltimosDias(usuario_id: string, dias: number, s: DBState = state) {
  const limite = Date.now() - dias * 86400000;
  return s.progresos
    .filter((p) => p.usuario_id === usuario_id && p.completada && new Date(p.fecha).getTime() >= limite)
    .reduce((acc, p) => {
      const l = s.lecciones.find((x) => x.id === p.leccion_id);
      return acc + (l?.xp_recompensa ?? 0);
    }, 0);
}

export interface FilaRanking {
  usuario: Usuario;
  xp: number;
  posicion: number;
}

export function ranking(periodo: "global" | "semana", s: DBState = state): FilaRanking[] {
  return s.usuarios
    .map((u) => ({ usuario: u, xp: periodo === "global" ? u.xp_total : xpUltimosDias(u.id, 7, s) }))
    .sort((a, b) => b.xp - a.xp || b.usuario.racha_dias - a.usuario.racha_dias)
    .slice(0, 50)
    .map((r, i) => ({ ...r, posicion: i + 1 }));
}

export function rankingAmigos(usuario_id: string, s: DBState = state) {
  const yo = s.usuarios.find((u) => u.id === usuario_id)!;
  const grupo = [yo, ...amigosDe(usuario_id, s)];
  const filas = grupo
    .sort((a, b) => b.xp_total - a.xp_total || b.racha_dias - a.racha_dias)
    .map((u, i) => ({ usuario: u, xp: u.xp_total, posicion: i + 1 }));
  return { filas, posicion: filas.findIndex((f) => f.usuario.id === usuario_id) + 1 };
}

/* ------------------------- HU11 progreso por curso ------------------------- */

export interface ProgresoCurso {
  total: number;
  completadas: number;
  porcentaje: number;
  proxima: Leccion | null;
}

export function progresoCurso(
  usuario_id: string,
  curso_id: string,
  s: DBState = state,
): ProgresoCurso | null {
  const inscripto = s.usuario_cursos.some(
    (uc) => uc.usuario_id === usuario_id && uc.curso_id === curso_id,
  );
  if (!inscripto) return null; // 404
  const lecs = s.lecciones.filter((l) => l.curso_id === curso_id).sort((a, b) => a.orden - b.orden);
  const hechas = lecs.filter((l) =>
    s.progresos.some((p) => p.usuario_id === usuario_id && p.leccion_id === l.id && p.completada),
  );
  const proxima =
    lecs.find(
      (l) =>
        !s.progresos.some(
          (p) => p.usuario_id === usuario_id && p.leccion_id === l.id && p.completada,
        ),
    ) ?? null;
  return {
    total: lecs.length,
    completadas: hechas.length,
    porcentaje: lecs.length ? Math.round((hechas.length / lecs.length) * 100) : 0,
    proxima,
  };
}

/* --------------------------- HU12 actividad diaria ------------------------- */

export interface DiaActividad {
  fecha: string;
  xp: number;
  lecciones: number;
}

export function actividad(
  usuario_id: string,
  desde: string,
  hasta: string,
  s: DBState = state,
): DiaActividad[] {
  const dias: DiaActividad[] = [];
  const start = new Date(desde + "T00:00:00");
  const end = new Date(hasta + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dias.push({ fecha: d.toISOString().slice(0, 10), xp: 0, lecciones: 0 });
  }
  const index = new Map(dias.map((d) => [d.fecha, d]));
  for (const p of s.progresos) {
    if (p.usuario_id !== usuario_id || !p.completada) continue;
    const key = p.fecha.slice(0, 10);
    const dia = index.get(key);
    if (!dia) continue;
    const l = s.lecciones.find((x) => x.id === p.leccion_id);
    dia.xp += l?.xp_recompensa ?? 0;
    dia.lecciones += 1;
  }
  return dias;
}

/* -------------------------------- insignias -------------------------------- */

export function insigniasDe(usuario_id: string, s: DBState = state) {
  return s.usuario_insignias
    .filter((ui) => ui.usuario_id === usuario_id)
    .map((ui) => ({ insignia: INSIGNIAS.find((i) => i.id === ui.insignia_id)!, fecha: ui.fecha }))
    .filter((x) => x.insignia);
}

/* ------------------------------ util de lectura ---------------------------- */

export function idiomaDeCurso(curso: Curso) {
  return IDIOMAS.find((i) => i.id === curso.idioma_id)!;
}

export function codigoDeCurso(curso: Curso): TargetLang {
  return idiomaDeCurso(curso).codigo;
}

export function contenidoDeLeccion(l: Leccion) {
  return l.tema_id ? (TEMAS_POR_ID[l.tema_id] ?? null) : null;
}

export function usuarioActual(s: DBState) {
  return s.sesion ? (s.usuarios.find((u) => u.id === s.sesion) ?? null) : null;
}
