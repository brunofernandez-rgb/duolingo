import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { languageName, levelName } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "TECNICO"];

const ADMIN_EMAIL = "admin@gmail.com";

export const Route = createFileRoute("/admin")({ component: () => <RequireAuth>{({ user }) => <Admin email={user.email} />}</RequireAuth> });

function Admin({ email }: { email: string }) {
  const { t, lang } = useT();
  const client = useQueryClient();
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
  const [idiomaId, setIdiomaId] = useState("");
  const [nuevoIdiomaNombre, setNuevoIdiomaNombre] = useState("");
  const [nuevoIdiomaCodigo, setNuevoIdiomaCodigo] = useState("");
  const [nuevoIdiomaBandera, setNuevoIdiomaBandera] = useState("");
  const [nivel, setNivel] = useState("A1");
  const [cursoId, setCursoId] = useState("");
  const [idiomaGestionId, setIdiomaGestionId] = useState("");
  const [cursoGestionId, setCursoGestionId] = useState("");
  const [orden, setOrden] = useState("1");
  const [titulo, setTitulo] = useState("");
  const [xp, setXp] = useState("10");
  const [vocabulario, setVocabulario] = useState("");
  const idiomas = useQuery({ queryKey: ["idiomas"], queryFn: api.idiomas });
  const cursos = useQuery({ queryKey: ["cursos"], queryFn: api.cursos });
  const lecciones = useQuery({ queryKey: ["lecciones-admin", cursoGestionId], queryFn: () => api.lecciones(Number(cursoGestionId)), enabled: Boolean(cursoGestionId) });
  const usuarios = useQuery({ queryKey: ["usuarios-admin"], queryFn: api.usuariosAdmin, enabled: isAdmin });
  const palabras = vocabulario.split("\n").filter(Boolean).map((line) => {
    const [fuente, ...traduccion] = line.split("|");
    return { fuente: fuente?.trim() ?? "", traduccion: traduccion.join("|").trim() };
  });
  const vocabularioValido = palabras.length > 0 && palabras.every((palabra) => palabra.fuente && palabra.traduccion);
  const crearCurso = useMutation({
    mutationFn: async () => {
      if (idiomaId) return api.crearCurso(Number(idiomaId), nivel);
      const idioma = await api.crearIdioma(
        nuevoIdiomaNombre.trim(),
        nuevoIdiomaCodigo.trim(),
        `https://flagcdn.com/w80/${nuevoIdiomaBandera.trim().toLowerCase()}.png`,
      );
      const curso = (await api.cursos()).find((item) => item.idioma_id === idioma.id && item.nivel === nivel);
      if (!curso) throw new Error(t("common.error"));
      return curso;
    },
    onSuccess: (curso) => {
      client.invalidateQueries({ queryKey: ["cursos"] });
      client.invalidateQueries({ queryKey: ["idiomas"] });
      setCursoId(String(curso.id));
      setIdiomaGestionId(String(curso.idioma_id));
      setCursoGestionId(String(curso.id));
      setIdiomaId(String(curso.idioma_id));
      setNuevoIdiomaNombre("");
      setNuevoIdiomaCodigo("");
      setNuevoIdiomaBandera("");
      toast.success(t("admin.create"));
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const crearLeccion = useMutation({
    mutationFn: () => api.crearLeccion(
      Number(cursoId),
      Number(orden),
      titulo.trim(),
      Number(xp),
      palabras,
    ),
    onSuccess: () => { setTitulo(""); setVocabulario(""); setOrden((value) => String(Number(value) + 1)); client.invalidateQueries({ queryKey: ["lecciones-admin", cursoId] }); toast.success(t("admin.create")); },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const borrarCurso = useMutation({
    mutationFn: (id: number) => api.eliminarCurso(id),
    onSuccess: (_, id) => {
      if (cursoId === String(id)) setCursoId("");
      if (cursoGestionId === String(id)) setCursoGestionId("");
      client.invalidateQueries({ queryKey: ["cursos"] });
      toast.success(t("admin.courseDeleted"));
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const borrarIdioma = useMutation({
    mutationFn: (id: number) => api.eliminarIdioma(id),
    onSuccess: (_, id) => {
      if (idiomaId === String(id)) setIdiomaId("");
      if (idiomaGestionId === String(id)) {
        setIdiomaGestionId("");
        setCursoGestionId("");
      }
      client.invalidateQueries({ queryKey: ["idiomas"] });
      client.invalidateQueries({ queryKey: ["cursos"] });
      toast.success(t("admin.languageDeleted"));
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const borrarLeccion = useMutation({
    mutationFn: (id: number) => api.eliminarLeccion(id),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["lecciones-admin", cursoGestionId] }); toast.success(t("admin.lessonDeleted")); },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const borrarUsuario = useMutation({
    mutationFn: (id: number) => api.eliminarUsuarioComoAdmin(id),
    onSuccess: () => { client.invalidateQueries({ queryKey: ["usuarios-admin"] }); toast.success(t("admin.userDeleted")); },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });

  if (!isAdmin) return <p className="font-bold text-destructive">{t("admin.accessDenied")}</p>;

  return <div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-extrabold">{t("admin.title")}</h1>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.newCourse")}</h2><form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); crearCurso.mutate(); }}>
      <select value={idiomaId} onChange={(event) => setIdiomaId(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold"><option value="">{t("admin.language")}</option>{(idiomas.data ?? []).map((idioma) => <option key={idioma.id} value={idioma.id}>{languageName(lang, idioma.codigo, idioma.nombre)}</option>)}</select>
      <select value={nivel} onChange={(event) => setNivel(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold">{LEVELS.map((item) => <option key={item} value={item}>{levelName(lang, item)}</option>)}</select>
      {!idiomaId && <><input required value={nuevoIdiomaNombre} onChange={(event) => setNuevoIdiomaNombre(event.target.value)} placeholder={t("admin.newLanguageName")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" /><input required value={nuevoIdiomaCodigo} onChange={(event) => setNuevoIdiomaCodigo(event.target.value.toLowerCase())} placeholder={t("admin.newLanguageCode")} maxLength={10} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" /><input required value={nuevoIdiomaBandera} onChange={(event) => setNuevoIdiomaBandera(event.target.value.toLowerCase())} placeholder={t("admin.newLanguageFlag")} maxLength={2} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" /></>}
      <DuoButton type="submit" disabled={(!idiomaId && (!nuevoIdiomaNombre.trim() || !nuevoIdiomaCodigo.trim() || !nuevoIdiomaBandera.trim())) || crearCurso.isPending}>{t("admin.create")}</DuoButton>
    </form></section>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.newLesson")}</h2><form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); crearLeccion.mutate(); }}>
      <select required value={cursoId} onChange={(event) => setCursoId(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold sm:col-span-2"><option value="">{t("nav.courses")}</option>{(cursos.data ?? []).map((curso) => <option key={curso.id} value={curso.id}>{languageName(lang, curso.idioma_codigo, curso.idioma_nombre)} · {levelName(lang, curso.nivel)}</option>)}</select>
      <input required min="1" type="number" value={orden} onChange={(event) => setOrden(event.target.value)} placeholder={t("admin.order")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" />
      <input required min="5" max="50" type="number" value={xp} onChange={(event) => setXp(event.target.value)} placeholder={t("admin.xp")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" />
      <input required maxLength={150} value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder={t("admin.title.field")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold sm:col-span-2" />
      <textarea required value={vocabulario} onChange={(event) => setVocabulario(event.target.value)} placeholder={t("admin.vocabularyPlaceholder")} className="min-h-28 rounded-xl border-2 border-border bg-background p-3 font-bold sm:col-span-2" />
      <p className="text-sm font-bold text-muted-foreground sm:col-span-2">{t("admin.vocabularyHelp")}</p>
      <DuoButton type="submit" disabled={!cursoId || !titulo.trim() || !vocabularioValido || crearLeccion.isPending}>{t("admin.create")}</DuoButton>
    </form></section>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.manageCourse")}</h2>
      <select value={idiomaGestionId} onChange={(event) => { setIdiomaGestionId(event.target.value); setCursoGestionId(""); }} className="h-11 w-full rounded-xl border-2 border-border bg-background px-3 font-bold"><option value="">{t("admin.manageLanguage")}</option>{(idiomas.data ?? []).map((idioma) => <option key={idioma.id} value={idioma.id}>{languageName(lang, idioma.codigo, idioma.nombre)}</option>)}</select>
      {idiomaGestionId && <><DuoButton variant="danger" block disabled={borrarIdioma.isPending} onClick={() => { if (window.confirm(t("admin.deleteLanguageConfirm"))) borrarIdioma.mutate(Number(idiomaGestionId)); }}>{t("admin.deleteLanguage")}</DuoButton><div className="grid gap-2 sm:grid-cols-2">{(cursos.data ?? []).filter((curso) => curso.idioma_id === Number(idiomaGestionId)).map((curso) => <div key={curso.id} className="flex items-center justify-between gap-2 rounded-xl bg-secondary p-3"><button type="button" onClick={() => setCursoGestionId(String(curso.id))} className="font-extrabold text-primary hover:underline">{levelName(lang, curso.nivel)}</button><DuoButton size="sm" variant="danger" disabled={borrarCurso.isPending} onClick={() => { if (window.confirm(t("admin.deleteCourseConfirm"))) borrarCurso.mutate(curso.id); }}>{t("admin.deleteCourse")}</DuoButton></div>)}</div>
      {cursoGestionId && <><h3 className="font-extrabold">{t("admin.lessonsInCourse")}</h3>{lecciones.isLoading && <p className="font-bold text-muted-foreground">{t("common.loading")}</p>}<div className="space-y-2">{(lecciones.data ?? []).map((leccion) => <div key={leccion.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3"><p className="font-extrabold">{leccion.orden}. {leccion.titulo}</p><DuoButton size="sm" variant="danger" disabled={borrarLeccion.isPending} onClick={() => { if (window.confirm(t("admin.deleteLessonConfirm"))) borrarLeccion.mutate(leccion.id); }}>{t("admin.deleteLesson")}</DuoButton></div>)}</div></>}
      </>}
    </section>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.users")}</h2>
      {usuarios.isLoading && <p className="font-bold text-muted-foreground">{t("common.loading")}</p>}
      {usuarios.isError && <p className="font-bold text-destructive">{t("common.error")}</p>}
      <div className="space-y-2">{(usuarios.data ?? []).filter((usuario) => usuario.email.toLowerCase() !== ADMIN_EMAIL).map((usuario) => <div key={usuario.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3"><div className="min-w-0"><p className="truncate font-extrabold">{usuario.nombre}</p><p className="truncate text-sm font-bold text-muted-foreground">{usuario.email}</p></div><DuoButton size="sm" variant="danger" onClick={() => { if (window.confirm(t("admin.deleteUserConfirm"))) borrarUsuario.mutate(usuario.id); }} disabled={borrarUsuario.isPending}>{t("admin.deleteUser")}</DuoButton></div>)}</div>
    </section>
  </div>;
}
