import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { localizeBadge } from "@/lib/i18n";

export const Route = createFileRoute("/insignias")({ component: () => <RequireAuth>{(ctx) => <Insignias {...ctx} />}</RequireAuth> });
function Insignias({ user }: { user: { id: string } }) {
  const { t, lang } = useT(); const query = useQuery({ queryKey: ["insignias", user.id], queryFn: () => api.insignias(Number(user.id)) });
  if (query.isLoading) return <p>{t("common.loading")}</p>;
  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">{t("badges.title")}</h1>{query.isError ? <p>{t("common.error")}</p> : <div className="grid gap-3 sm:grid-cols-2">{(query.data ?? []).map((badge) => { const localized = localizeBadge(lang, badge); return <article key={badge.insignia_id} className="rounded-2xl border-2 border-border bg-card p-5"><Award className="mb-3 text-gold" /><h2 className="font-extrabold">{localized.name}</h2><p className="text-sm font-bold text-muted-foreground">{localized.description}</p><p className="mt-2 text-xs font-bold text-muted-foreground">{t("badges.unlocked")} {new Intl.DateTimeFormat(lang).format(new Date(badge.fecha))}</p></article>; })}</div>}</div>;
}
