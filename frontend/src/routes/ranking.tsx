import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/ranking")({ component: () => <RequireAuth>{(ctx) => <Ranking {...ctx} />}</RequireAuth> });
function Ranking({ user }: { user: { id: string } }) {
  const { t } = useT();
  const ranking = useQuery({ queryKey: ["ranking", "global"], queryFn: () => api.ranking("global") });
  if (ranking.isLoading) return <p>Cargando ranking...</p>;
  if (ranking.isError) return <p>No se pudo cargar el ranking.</p>;
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">{t("ranking.title")}</h1><ol className="space-y-2">{(ranking.data ?? []).map((item, index) => <li key={item.id} className="flex justify-between rounded-2xl border-2 border-border bg-card p-4 font-extrabold"><span>{index + 1}. {item.nombre}{String(item.id) === user.id ? ` (${t("ranking.you")})` : ""}</span><span>{item.xp_total} XP</span></li>)}</ol></div>;
}
