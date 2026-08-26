import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { DuoButton } from "@/components/duo/DuoButton";
import { useT } from "@/lib/useT";
import { IDIOMAS } from "@/data/content";
import { estaInscripto, inscribirse, leccionesDeCurso, progresoCurso } from "@/lib/store";

export const Route = createFileRoute("/cursos")({
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

function Cursos({ user, db }: { user: { id: string }; db: ReturnType<typeof import("@/lib/store").getState> }) {
  const { t, lang } = useT();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">{t("course.choose")}</h1>

      {IDIOMAS.map((idioma) => {
        const cursos = db.cursos.filter((c) => c.idioma_id === idioma.id);
        if (!cursos.length) return null;
        return (
          <section key={idioma.id} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <span className="text-2xl">{idioma.bandera}</span> {idioma.nombre[lang]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cursos
                .slice()
                .sort((a, b) => a.nivel.localeCompare(b.nivel))
                .map((curso) => {
                  const inscripto = estaInscripto(user.id, curso.id);
                  const prog = progresoCurso(user.id, curso.id, db);
                  const total = leccionesDeCurso(curso.id).length;
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
                            {total} {t("course.lessons")}
                          </p>
                        </div>
                        <span className="text-3xl">{idioma.bandera}</span>
                      </div>

                      {inscripto && prog && (
                        <div className="mt-4">
                          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${prog.porcentaje}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs font-extrabold text-muted-foreground">
                            {prog.completadas}/{prog.total} {t("course.completed")}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        {inscripto ? (
                          <DuoButton
                            variant="outline"
                            block
                            onClick={() =>
                              navigate({ to: "/curso/$cursoId", params: { cursoId: curso.id } })
                            }
                          >
                            {t("course.continue")}
                          </DuoButton>
                        ) : (
                          <DuoButton
                            block
                            onClick={() => {
                              const r = inscribirse(user.id, curso.id);
                              if (!r.ok) toast.error(t("course.enrolled"));
                              else
                                navigate({
                                  to: "/curso/$cursoId",
                                  params: { cursoId: curso.id },
                                });
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
    </div>
  );
}
