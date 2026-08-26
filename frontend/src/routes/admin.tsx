import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/admin")({ component: () => <RequireAuth>{() => <Admin />}</RequireAuth> });
function Admin() {
  const { t } = useT();
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">{t("admin.title")}</h1><p className="rounded-2xl border-2 border-border bg-card p-5 font-bold text-muted-foreground">Los endpoints de administración de cursos y lecciones requieren completar permisos en el backend.</p></div>;
}
