import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/curso/$cursoId")({
  component: () => <RequireAuth>{(ctx) => <Curso {...ctx} />}</RequireAuth>,
});

function Curso({ user }: { user: { id: string } }) {
  const { cursoId } = Route.useParams();
  const { t } = useT();
  const cursoIdNumber = Number(cursoId);
  const curso = useQuery({ queryKey: ["curso", cursoIdNumber], queryFn: () => api.curso(cursoIdNumber) });
  const lecciones = useQuery({ queryKey: ["lecciones", cursoIdNumber], queryFn: () => api.lecciones(cursoIdNumber) });
  const progreso = useQuery({
    queryKey: ["progreso", user.id, cursoIdNumber],
    queryFn: () => api.progresoCurso(Number(user.id), cursoIdNumber),
  });

  if (curso.isLoading || lecciones.isLoading || progreso.isLoading) return <p>Cargando curso...</p>;
  if (curso.isError || lecciones.isError || progreso.isError) return <p>No se pudo cargar el curso.</p>;
  const completed = progreso.data?.completadas ?? 0;

  return (
    <div className="space-y-6">
      <Link to="/cursos" className="text-sm font-extrabold text-primary">← {t("nav.courses")}</Link>
      <header>
        <h1 className="text-3xl font-extrabold">{curso.data?.idioma_nombre} · {curso.data?.nivel}</h1>
        <p className="mt-2 font-bold text-muted-foreground">{t("course.progress")}: {completed}/{lecciones.data?.length ?? 0}</p>
      </header>
      <ol className="space-y-3">
        {(lecciones.data ?? []).map((lesson, index) => {
          const unlocked = index <= completed;
          return (
            <li key={lesson.id} className="flex items-center justify-between rounded-2xl border-2 border-border bg-card p-4">
              <div>
                <p className="font-extrabold">{lesson.orden}. {lesson.titulo}</p>
                <p className="text-sm font-bold text-muted-foreground">+{lesson.xp_recompensa} XP</p>
              </div>
              {unlocked ? <Link to="/leccion/$leccionId" params={{ leccionId: String(lesson.id) }} className="rounded-xl bg-primary p-3 text-primary-foreground"><Check className="h-5 w-5" /></Link> : <Lock className="mr-3 text-muted-foreground" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
