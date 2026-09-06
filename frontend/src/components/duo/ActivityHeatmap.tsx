import type { ApiActividadDiaria } from "@/lib/api";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatDay(date: string, lang: string) {
  return new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`));
}

export function ActivityHeatmap({ data, lang }: { data: ApiActividadDiaria[]; lang: string }) {
  return (
    <section className="rounded-2xl border-2 border-border bg-card p-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="fecha" tickFormatter={(value) => formatDay(value, lang)} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis dataKey="xp" allowDecimals={false} domain={[0, "auto"]} tick={{ fontSize: 10 }} />
            <Tooltip labelFormatter={(value) => formatDay(String(value), lang)} formatter={(value) => [`${value} XP`, "Ganado"]} />
            <Line type="monotone" dataKey="xp" stroke="#55c7e8" strokeWidth={3} dot={false} activeDot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-xs font-bold text-muted-foreground">Días de actividad · XP conseguidos por día</p>
    </section>
  );
}
