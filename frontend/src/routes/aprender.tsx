import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { DuoButton } from "@/components/duo/DuoButton";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { languageName } from "@/lib/i18n";
import { levelName } from "@/lib/i18n";

const BANDERAS: Record<string, string> = {
  es: "https://flagcdn.com/w80/ar.png",
  en: "https://flagcdn.com/w80/us.png",
  pt: "https://flagcdn.com/w80/br.png",
  it: "https://flagcdn.com/w80/it.png",
  fr: "https://flagcdn.com/w80/fr.png",
  de: "https://flagcdn.com/w80/de.png",
};
const NIVELES = ["A1", "A2", "B1", "B2", "C1", "TECNICO"];

export const Route = createFileRoute("/aprender")({
  component: () => <RequireAuth>{(ctx) => <Aprender user={ctx.user} />}</RequireAuth>,
});

function Aprender({ user }: { user: { id: string } }) {
  const { t, lang } = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = Number(user.id);
  const [niveles, setNiveles] = useState<Record<string, string>>({});
  const idiomasQuery = useQuery({ queryKey: ["idiomas"], queryFn: api.idiomas });
  const cursosQuery = useQuery({ queryKey: ["cursos"], queryFn: api.cursos });
  const inscripcionesQuery = useQuery({
    queryKey: ["inscripciones", userId],
    queryFn: () => api.inscripciones(userId),
    enabled: Number.isInteger(userId),
  });
  const inscribirMutation = useMutation({
    mutationFn: (cursoId: number) => api.inscribir(userId, cursoId),
    onSuccess: (_, cursoId) => {
      queryClient.invalidateQueries({ queryKey: ["inscripciones", userId] });
      navigate({ to: "/cursos", search: { idioma: cursosQuery.data?.find((curso) => curso.id === cursoId)?.idioma_codigo } });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo completar la inscripción"),
  });
  const progresoQueries = useQueries({
    queries: (inscripcionesQuery.data ?? []).map((inscripcion) => ({
      queryKey: ["progreso", userId, inscripcion.curso_id],
      queryFn: () => api.progresoCurso(userId, inscripcion.curso_id),
    })),
  });

  if (idiomasQuery.isLoading || cursosQuery.isLoading || inscripcionesQuery.isLoading) return <p>Cargando idiomas...</p>;
  if (idiomasQuery.isError || cursosQuery.isError || inscripcionesQuery.isError) return <p>No se pudieron cargar los idiomas.</p>;
  const inscripciones = new Set((inscripcionesQuery.data ?? []).map((item) => item.curso_id));
  const cursosCompletados = new Set(
    progresoQueries
      .filter((query) => query.data && query.data.total_lecciones > 0 && query.data.completadas >= query.data.total_lecciones)
      .map((query) => query.data!.curso_id),
  );
  const idiomasActivos = new Set(
    (inscripcionesQuery.data ?? [])
      .filter((inscripcion) => !cursosCompletados.has(inscripcion.curso_id))
      .map((inscripcion) => inscripcion.idioma_codigo),
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
          <Globe className="h-4 w-4" /> Pingu
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{t("course.choose")}</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(idiomasQuery.data ?? []).filter((idioma) => idioma.codigo !== "es").map((idioma) => (
          <article key={idioma.id} className="rounded-3xl border-2 border-b-4 border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <img className="h-10 w-14 rounded object-cover" src={idioma.bandera_url ?? BANDERAS[idioma.codigo]} alt={languageName(lang, idioma.codigo, idioma.nombre)} />
              <div>
                <h2 className="text-xl font-extrabold">{languageName(lang, idioma.codigo, idioma.nombre)}</h2>
              </div>
            </div>
            <label className="mt-5 block text-sm font-extrabold">
              Nivel
              <select
                className="mt-2 h-11 w-full rounded-xl border-2 border-border bg-background px-3 font-bold"
                value={niveles[idioma.codigo] ?? "A1"}
                onChange={(event) => setNiveles((current) => ({ ...current, [idioma.codigo]: event.target.value }))}
              >
                {NIVELES.map((nivel) => <option key={nivel} value={nivel}>{levelName(lang, nivel)}</option>)}
              </select>
            </label>
            <DuoButton
              className="mt-3"
              block
              disabled={inscribirMutation.isPending}
              onClick={() => {
                const nivel = niveles[idioma.codigo] ?? "A1";
                const curso = cursosQuery.data?.find(
                  (item) => item.idioma_codigo === idioma.codigo && item.nivel === nivel,
                );
                if (!curso) {
                  toast.error("Este idioma todavía no tiene cursos disponibles");
                  return;
                }
                if (inscripciones.has(curso.id)) {
                  toast.info(cursosCompletados.has(curso.id) ? `${t("course.alreadyCompleted")}: ${languageName(lang, idioma.codigo, idioma.nombre)} ${nivel}` : `${t("course.alreadyEnrolled")}: ${languageName(lang, idioma.codigo, idioma.nombre)} ${nivel}`);
                  return;
                }
                if (idiomasActivos.has(idioma.codigo)) {
                  toast.info(`${t("course.otherActive")}: ${languageName(lang, idioma.codigo, idioma.nombre)}`);
                  return;
                }
                inscribirMutation.mutate(curso.id);
              }}
            >
              {cursosCompletados.has(cursosQuery.data?.find((item) => item.idioma_codigo === idioma.codigo && item.nivel === (niveles[idioma.codigo] ?? "A1"))?.id ?? -1)
                ? t("course.alreadyCompleted")
                : inscripciones.has(cursosQuery.data?.find((item) => item.idioma_codigo === idioma.codigo && item.nivel === (niveles[idioma.codigo] ?? "A1"))?.id ?? -1)
                  ? t("course.alreadyEnrolled")
                : idiomasActivos.has(idioma.codigo)
                  ? t("course.otherActive")
                : t("course.enroll")}
            </DuoButton>
          </article>
        ))}
      </div>
    </div>
  );
}
