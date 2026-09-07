import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { ActivityHeatmap } from "@/components/duo/ActivityHeatmap";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function initialRange() {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setDate(desde.getDate() - 29);
  return { desde: formatDate(desde), hasta: formatDate(hasta) };
}

export const Route = createFileRoute("/actividad")({
  component: () => <RequireAuth>{(ctx) => <Actividad {...ctx} />}</RequireAuth>,
});

function Actividad({ user }: { user: { id: string } }) {
  const { t, lang } = useT();
  const initial = initialRange();
  const [desde, setDesde] = useState(initial.desde);
  const [hasta, setHasta] = useState(initial.hasta);
  const actividad = useQuery({
    queryKey: ["actividad", user.id, desde, hasta],
    queryFn: () => api.actividad(Number(user.id), desde, hasta),
    enabled: desde <= hasta,
  });

  const totalXp = (actividad.data ?? []).reduce((total, dia) => total + dia.xp, 0);
  const totalLecciones = (actividad.data ?? []).reduce((total, dia) => total + dia.lecciones_completadas, 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary"><CalendarDays className="h-4 w-4" /> {t("nav.activity")}</p>
        <h1 className="mt-2 text-3xl font-extrabold">{t("activity.title")}</h1>
      </header>
      <section className="flex flex-wrap items-end gap-3 rounded-2xl border-2 border-border bg-card p-4">
        <label className="font-extrabold">{t("activity.from")}<input type="date" value={desde} onChange={(event) => setDesde(event.target.value)} className="mt-1 block h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" /></label>
        <label className="font-extrabold">{t("activity.to")}<input type="date" value={hasta} onChange={(event) => setHasta(event.target.value)} className="mt-1 block h-11 rounded-xl border-2 border-border bg-background px-3 font-bold" /></label>
        {desde > hasta && <p className="text-sm font-bold text-destructive">{t("activity.invalidRange")}</p>}
      </section>
      {actividad.isLoading && <p>{t("activity.loading")}</p>}
      {actividad.isError && <p>{t("activity.loadError")}</p>}
      {actividad.data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-border bg-card p-4"><p className="text-2xl font-extrabold">{totalXp} XP</p><p className="font-bold text-muted-foreground">{t("activity.xpPeriod")}</p></div>
            <div className="rounded-2xl border-2 border-border bg-card p-4"><p className="text-2xl font-extrabold">{totalLecciones}</p><p className="font-bold text-muted-foreground">{t("activity.completedLessons")}</p></div>
          </div>
          <ActivityHeatmap data={actividad.data} lang={lang} />
          <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {actividad.data.map((dia) => (
              <article key={dia.fecha} className={`rounded-xl border-2 p-3 ${dia.xp > 0 ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                <p className="text-sm font-extrabold">{new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date(`${dia.fecha}T12:00:00`))}</p>
                <p className="mt-1 font-bold">{dia.xp} XP · {dia.lecciones_completadas} {t("activity.lessonsDay")}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
