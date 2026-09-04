import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { DuoButton } from "@/components/duo/DuoButton";
import { useT } from "@/lib/useT";
import { api, type ApiProgresoCurso } from "@/lib/api";

const BANDERAS: Record<string, string> = {
  es: "https://flagcdn.com/w80/ar.png",
  en: "https://flagcdn.com/w80/us.png",
  pt: "https://flagcdn.com/w80/br.png",
  it: "https://flagcdn.com/w80/it.png",
  fr: "https://flagcdn.com/w80/fr.png",
  de: "https://flagcdn.com/w80/de.png",
};

export const Route = createFileRoute("/cursos")({
  validateSearch: (search: Record<string, unknown>): { idioma?: string } => ({
    idioma: typeof search.idioma === "string" ? search.idioma : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Elegí un idioma para estudiar — Pingu" },
      {
        name: "description",
        content:
          "Inscribite a cursos de inglés, francés, alemán, italiano o portugués en niveles A1 y A2.",
      },
      { property: "og:title", content: "Elegí un idioma para estudiar — Pingu" },
      {
        property: "og:description",
        content: "Cursos por idioma y nivel: inscribite y empezá a sumar XP hoy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RequireAuth>{(ctx) => <Cursos {...ctx} />}</RequireAuth>,
});

function Cursos({ user }: { user: { id: string } }) {
  const { t } = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = Number(user.id);
  const { idioma: idiomaSeleccionado } = Route.useSearch();
  const cursosQuery = useQuery({ queryKey: ["cursos"], queryFn: api.cursos });
  const idiomasQuery = useQuery({ queryKey: ["idiomas"], queryFn: api.idiomas });
  const inscripcionesQuery = useQuery({
    queryKey: ["inscripciones", userId],
    queryFn: () => api.inscripciones(userId),
    enabled: Number.isInteger(userId),
  });
  const inscribirMutation = useMutation({
    mutationFn: (cursoId: number) => api.inscribir(userId, cursoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inscripciones", userId] }),
    onError: (error) => toast.error(error instanceof Error ? error.message : t("course.enrolled")),
  });
  const dejarCursoMutation = useMutation({
    mutationFn: (cursoId: number) => api.dejarCurso(userId, cursoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inscripciones", userId] }),
    onError: (error) => toast.error(error instanceof Error ? error.message : t("course.leave")),
  });
  const progresoQueries = useQueries({
    queries: (inscripcionesQuery.data ?? []).map((inscripcion) => ({
      queryKey: ["progreso", userId, inscripcion.curso_id],
      queryFn: () => api.progresoCurso(userId, inscripcion.curso_id),
    })),
  });

  if (cursosQuery.isLoading || idiomasQuery.isLoading || inscripcionesQuery.isLoading) return <p>Cargando cursos...</p>;
  if (cursosQuery.isError || idiomasQuery.isError || inscripcionesQuery.isError) return <p>No se pudieron cargar los cursos.</p>;
  const cursos = cursosQuery.data ?? [];
  const inscripciones = new Set((inscripcionesQuery.data ?? []).map((item) => item.curso_id));
  const progresoPorCurso = new Map(
    progresoQueries
      .map((query) => query.data)
      .filter((progreso): progreso is ApiProgresoCurso => Boolean(progreso))
      .map((progreso) => [progreso.curso_id, progreso]),
  );
  const cursosCompletados = cursos.filter((curso) => {
    const progreso = progresoPorCurso.get(curso.id);
    return inscripciones.has(curso.id) && progreso && progreso.total_lecciones > 0 && progreso.completadas >= progreso.total_lecciones;
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">{t("course.choose")}</h1>

      {(idiomasQuery.data ?? []).map((idioma) => {
        const cursosIdioma = cursos.filter(
            (curso) => inscripciones.has(curso.id) &&
              !cursosCompletados.some((completado) => completado.id === curso.id) &&
              curso.idioma_codigo === idioma.codigo &&
            (!idiomaSeleccionado || curso.idioma_codigo === idiomaSeleccionado),
        );
        if (!cursosIdioma.length) return null;
        return (
          <section key={idioma.id} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <img className="h-6 w-9 rounded object-cover" src={BANDERAS[idioma.codigo]} alt={`Bandera de ${idioma.nombre}`} /> {idioma.nombre}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cursosIdioma
                .slice()
                .sort((a, b) => a.nivel.localeCompare(b.nivel))
                .map((curso) => {
                  const inscripto = inscripciones.has(curso.id);
                  return (
                    <article
                      key={curso.id}
                      className="rounded-3xl border-2 border-b-4 border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-extrabold">
                            {t("course.level")} {curso.nivel}
                          </p>
                          <p className="text-sm font-bold text-muted-foreground">
                            {(() => {
                              const progresoCurso = progresoPorCurso.get(curso.id);
                              return progresoCurso ? `${progresoCurso.completadas}/${progresoCurso.total_lecciones} ${t("course.lessons")}` : t("course.lessons");
                            })()}
                          </p>
                        </div>
                        <img className="h-8 w-12 rounded object-cover" src={BANDERAS[idioma.codigo]} alt={`Bandera de ${idioma.nombre}`} />
                      </div>

                      <div className="mt-4">
                        {inscripto ? (
                          <div className="space-y-3">
                            <DuoButton
                              variant="outline"
                              block
                              onClick={() =>
                                navigate({ to: "/curso/$cursoId", params: { cursoId: curso.id } })
                              }
                            >
                              {t("course.continue")}
                            </DuoButton>
                            <DuoButton
                              variant="danger"
                              block
                              disabled={dejarCursoMutation.isPending}
                              onClick={() => {
                                if (window.confirm(`${t("course.leave")} · ${idioma.nombre} ${curso.nivel}?`)) {
                                  dejarCursoMutation.mutate(curso.id);
                                }
                              }}
                            >
                              {t("course.leave")}
                            </DuoButton>
                          </div>
                        ) : (
                          <DuoButton
                            block
                            disabled={inscribirMutation.isPending}
                            onClick={() => {
                              inscribirMutation.mutate(curso.id);
                            }}
                          >
                            {t("course.enroll")}
                          </DuoButton>
                        )}
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        );
      })}
      {cursosCompletados.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold">Cursos completados</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cursosCompletados.map((curso) => (
              <article key={curso.id} className="flex items-center justify-between rounded-2xl border-2 border-success bg-success-soft p-4">
                <div>
                  <p className="font-extrabold">{curso.idioma_nombre} · {curso.nivel}</p>
                  <p className="text-sm font-bold text-success">{progresoPorCurso.get(curso.id)?.completadas}/{progresoPorCurso.get(curso.id)?.total_lecciones} {t("course.lessons")}</p>
                </div>
                <span className="font-extrabold text-success">Completado</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
