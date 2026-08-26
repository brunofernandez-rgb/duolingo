import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/leccion/$leccionId")({
  component: () => <RequireAuth>{(ctx) => <Leccion {...ctx} />}</RequireAuth>,
});

function Leccion({ user }: { user: { id: string } }) {
  const { leccionId } = Route.useParams();
  const { t } = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [score, setScore] = useState<number | null>(null);
  const lesson = useQuery({ queryKey: ["leccion", leccionId], queryFn: () => api.leccion(Number(leccionId)) });
  const attempt = useMutation({
    mutationFn: (puntaje: number) => api.intento(Number(user.id), Number(leccionId), puntaje),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progreso"] });
      toast.success(t("lesson.passed"));
      navigate({ to: "/cursos" });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("lesson.failed")),
  });

  if (lesson.isLoading) return <p>Cargando lección...</p>;
  if (lesson.isError || !lesson.data) return <p>No se pudo cargar la lección.</p>;
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link to="/cursos" className="text-sm font-extrabold text-primary">← {t("lesson.exit")}</Link>
      <h1 className="text-3xl font-extrabold">{lesson.data.titulo}</h1>
      <p className="font-bold text-muted-foreground">{lesson.data.idioma_nombre} · +{lesson.data.xp_recompensa} XP</p>
      <div className="rounded-3xl border-2 border-border bg-card p-6">
        <p className="text-lg font-extrabold">{t("lesson.score")}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[100, 0].map((value) => <DuoButton key={value} variant={score === value ? "success" : "outline"} onClick={() => setScore(value)}>{value}</DuoButton>)}
        </div>
      </div>
      <DuoButton block disabled={score === null || attempt.isPending} onClick={() => score !== null && attempt.mutate(score)}>{t("lesson.finish")}</DuoButton>
    </div>
  );
}
