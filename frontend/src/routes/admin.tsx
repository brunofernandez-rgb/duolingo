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

export const Route = createFileRoute("/admin")({ component: () => <RequireAuth>{() => <Admin />}</RequireAuth> });

function Admin() {
  const { t, lang } = useT();
  const client = useQueryClient();
  const [idiomaId, setIdiomaId] = useState("");
  const [nivel, setNivel] = useState("A1");
  const [cursoId, setCursoId] = useState("");
  const [orden, setOrden] = useState("1");
  const [titulo, setTitulo] = useState("");
  const [xp, setXp] = useState("10");
  const idiomas = useQuery({ queryKey: ["idiomas"], queryFn: api.idiomas });
  const cursos = useQuery({ queryKey: ["cursos"], queryFn: api.cursos });
  const crearCurso = useMutation({
    mutationFn: () => api.crearCurso(Number(idiomaId), nivel),
    onSuccess: (curso) => { client.invalidateQueries({ queryKey: ["cursos"] }); setCursoId(String(curso.id)); toast.success(t("admin.create")); },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });
  const crearLeccion = useMutation({
    mutationFn: () => api.crearLeccion(Number(cursoId), Number(orden), titulo.trim(), Number(xp)),
    onSuccess: () => { setTitulo(""); setOrden((value) => String(Number(value) + 1)); toast.success(t("admin.create")); },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("common.error")),
  });

  return <div className="mx-auto max-w-2xl space-y-6"><h1 className="text-2xl font-extrabold">{t("admin.title")}</h1>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.newCourse")}</h2><form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); crearCurso.mutate(); }}>
      <select required value={idiomaId} onChange={(event) => setIdiomaId(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold"><option value="">{t("admin.language")}</option>{(idiomas.data ?? []).map((idioma) => <option key={idioma.id} value={idioma.id}>{languageName(lang, idioma.codigo, idioma.nombre)}</option>)}</select>
      <select value={nivel} onChange={(event) => setNivel(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold">{LEVELS.map((item) => <option key={item} value={item}>{levelName(lang, item)}</option>)}</select>
      <DuoButton type="submit" disabled={!idiomaId || crearCurso.isPending}>{t("admin.create")}</DuoButton>
    </form></section>
    <section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="text-xl font-extrabold">{t("admin.newLesson")}</h2><form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); crearLeccion.mutate(); }}>
      <select required value={cursoId} onChange={(event) => setCursoId(event.target.value)} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold sm:col-span-2"><option value="">{t("nav.courses")}</option>{(cursos.data ?? []).map((curso) => <option key={curso.id} value={curso.id}>{languageName(lang, curso.idioma_codigo, curso.idioma_nombre)} · {levelName(lang, curso.nivel)}</option>)}</select>
      <input required min="1" type="number" value={orden} onChange={(event) => setOrden(event.target.value)} placeholder={t("admin.order")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" />
      <input required min="5" max="50" type="number" value={xp} onChange={(event) => setXp(event.target.value)} placeholder={t("admin.xp")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" />
      <input required maxLength={150} value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder={t("admin.title.field")} className="h-11 rounded-xl border-2 border-border bg-background px-3 font-bold sm:col-span-2" />
      <DuoButton type="submit" disabled={!cursoId || !titulo.trim() || crearLeccion.isPending}>{t("admin.create")}</DuoButton>
    </form></section>
  </div>;
}
