import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Flame, Trophy, Zap } from "lucide-react";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/ranking-amigos")({
  component: () => <RequireAuth>{(ctx) => <RankingAmigos {...ctx} />}</RequireAuth>,
});

function RankingAmigos({ user }: { user: { id: string } }) {
  const { t } = useT();
  const userId = Number(user.id);
  const ranking = useQuery({
    queryKey: ["ranking-amigos", userId],
    queryFn: () => api.rankingAmigos(userId),
  });

  if (ranking.isLoading) return <p>{t("ranking.loading")}</p>;
  if (ranking.isError) return <p>{t("ranking.loadError")}</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">{t("ranking.friendsTitle")}</h1>
        <p className="mt-1 font-bold text-muted-foreground">{t("ranking.friendsDescription")}</p>
      </div>
      {ranking.data?.length ? (
        <ol className="space-y-3">
          {ranking.data.map((item) => {
            const esUsuario = item.usuario_id === userId;
            return (
              <li
                key={item.usuario_id}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 ${esUsuario ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
              >
                <span className="w-8 text-center text-xl font-extrabold text-primary">{item.posicion}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">{item.nombre}{esUsuario ? ` (${t("ranking.you")})` : ""}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm font-bold text-muted-foreground">
                    <span className="flex items-center gap-1 text-gold"><Zap className="h-4 w-4" />{item.xp_total} XP</span>
                    <span className="flex items-center gap-1 text-streak"><Flame className="h-4 w-4" />{item.racha_dias} {t("streak.days")}</span>
                  </div>
                </div>
                {item.posicion === 1 && <Trophy className="h-6 w-6 shrink-0 text-gold" />}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-border p-5 font-bold text-muted-foreground">{t("ranking.friendsEmpty")}</p>
      )}
    </div>
  );
}
