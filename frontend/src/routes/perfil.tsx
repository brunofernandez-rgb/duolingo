import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Flame, Zap } from "lucide-react";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/perfil")({ component: () => <RequireAuth>{(ctx) => <Perfil {...ctx} />}</RequireAuth> });
function Perfil({ user }: { user: { id: string } }) {
  const { t } = useT(); const query = useQuery({ queryKey: ["usuario", user.id], queryFn: () => api.usuario(Number(user.id)) });
  if (query.isLoading) return <p>Cargando perfil...</p>;
  if (query.isError || !query.data) return <p>No se pudo cargar el perfil.</p>;
  return <div className="max-w-xl space-y-6"><h1 className="text-2xl font-extrabold">{query.data.nombre}</h1><p className="font-bold text-muted-foreground">{query.data.email}</p><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border-2 border-border bg-card p-5"><Zap className="text-gold" /><p className="mt-2 text-2xl font-extrabold">{query.data.xp_total}</p><p className="font-bold text-muted-foreground">{t("xp.total")}</p></div><div className="rounded-2xl border-2 border-border bg-card p-5"><Flame className="text-streak" /><p className="mt-2 text-2xl font-extrabold">{query.data.racha_dias}</p><p className="font-bold text-muted-foreground">{t("streak.days")}</p></div></div></div>;
}
