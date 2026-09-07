import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/ranking")({ component: () => <RequireAuth>{(ctx) => <Ranking {...ctx} />}</RequireAuth> });
function Ranking({ user }: { user: { id: string } }) {
  const { t } = useT();
  const global = useQuery({ queryKey: ["ranking", "global"], queryFn: () => api.ranking("global") });
  const weekly = useQuery({ queryKey: ["ranking", "semanal"], queryFn: () => api.ranking("semanal") });
  if (global.isLoading || weekly.isLoading) return <p>{t("ranking.loading")}</p>;
  if (global.isError || weekly.isError) return <p>{t("ranking.loadError")}</p>;

  const rankingList = (title: string, entries: typeof global.data) => (
    <section className="min-w-0 space-y-3">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <ol className="space-y-2">
        {(entries ?? []).map((item, index) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4 font-extrabold">
            <span className="min-w-0 truncate">{index + 1}. {item.nombre}{String(item.id) === user.id ? ` (${t("ranking.you")})` : ""}</span>
            <span className="shrink-0">{item.xp_total} XP</span>
          </li>
        ))}
      </ol>
    </section>
  );

  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">{t("ranking.title")}</h1><div className="grid gap-6 lg:grid-cols-2">{rankingList(t("ranking.historical"), global.data)}{rankingList(t("ranking.week"), weekly.data)}</div></div>;
}
