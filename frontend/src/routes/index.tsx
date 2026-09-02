import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, BookOpen, Trophy, Users } from "lucide-react";
import { Penguin } from "@/components/duo/Penguin";
import { DuoButton } from "@/components/duo/DuoButton";
import { AppShell, LanguagePicker } from "@/components/duo/AppShell";
import { useT } from "@/lib/useT";
import { IDIOMAS } from "@/data/content";
import { useDB, usuarioActual } from "@/lib/store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pingu — Aprendé idiomas gratis con un pingüino" },
      {
        name: "description",
        content:
          "Aprendé inglés, francés, alemán, italiano o portugués con lecciones cortas, XP, rachas diarias, insignias y rankings entre amigos.",
      },
      { property: "og:title", content: "Pingu — Aprendé idiomas gratis" },
      {
        property: "og:description",
        content: "Lecciones cortas y divertidas: sumá XP, mantené tu racha y competí con amigos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang } = useT();
  const db = useDB();
  const user = usuarioActual(db);
  if (user) return <AppShell><Dashboard userId={Number(user.id)} /></AppShell>;

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <span className="flex items-center gap-2 text-2xl font-extrabold text-primary">
          <Penguin className="h-10 w-10" priority /> {t("app.name")}
        </span>
        <LanguagePicker />
      </header>

      <main className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:py-20">
        <div className="order-2 flex flex-col items-center gap-5 text-center md:order-1 md:items-start md:text-left">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">
            {t("app.tagline")}
          </h1>
          <p className="max-w-md text-base font-bold text-muted-foreground">
            {lang === "en"
              ? "Short lessons, XP, daily streaks, badges and leaderboards with your friends."
              : lang === "pt"
                ? "Lições curtas, XP, ofensiva diária, insígnias e ranking com amigos."
                : "Lecciones cortas, XP, racha diaria, insignias y ranking con tus amigos."}
          </p>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Link to="/auth" search={{ modo: "registro" }}>
              <DuoButton size="lg" block>
                {t("auth.start")}
              </DuoButton>
            </Link>
            <Link to="/auth" search={{ modo: "login" }}>
              <DuoButton variant="outline" size="lg" block>
                {t("auth.haveAccount")}
              </DuoButton>
            </Link>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
            {IDIOMAS.map((i) => (
              <li
                key={i.id}
                className="rounded-xl border-2 border-border px-3 py-1.5 text-sm font-extrabold text-muted-foreground"
              >
                <img className="h-5 w-7 rounded object-cover" src={i.bandera} alt={`Bandera de ${i.nombre[lang]}`} /> {i.nombre[lang]}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 flex justify-center md:order-2">
          <div className="rounded-full bg-primary-soft p-6">
            <Penguin className="h-56 w-56 md:h-72 md:w-72" float priority />
          </div>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ userId }: { userId: number }) {
  const { t } = useT();
  const usuario = useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => api.usuario(userId),
  });
  const inscripciones = useQuery({
    queryKey: ["inscripciones", userId],
    queryFn: () => api.inscripciones(userId),
  });
  const insignias = useQuery({
    queryKey: ["insignias", userId],
    queryFn: () => api.insignias(userId),
  });
  const amigos = useQuery({
    queryKey: ["amigos", userId],
    queryFn: () => api.amigos(userId),
  });
  const ranking = useQuery({
    queryKey: ["ranking", "semanal"],
    queryFn: () => api.ranking("semanal"),
  });

  if (usuario.isLoading || inscripciones.isLoading || insignias.isLoading || amigos.isLoading || ranking.isLoading) return <p>Cargando tu inicio...</p>;
  if (usuario.isError || !usuario.data || inscripciones.isError || insignias.isError || amigos.isError || ranking.isError) return <p>No se pudo cargar tu inicio.</p>;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-primary">Pingu</p>
          <h1 className="mt-2 text-3xl font-extrabold">Inicio</h1>
        </div>
        <section className="space-y-4">
        <h2 className="text-2xl font-extrabold">Continuar aprendiendo</h2>
        <p className="font-bold text-muted-foreground">Hola, {usuario.data.nombre}. Retomá tus cursos y seguí con la próxima lección.</p>
        {inscripciones.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {inscripciones.data.map((inscripcion) => (
              <ContinueCourse key={inscripcion.curso_id} userId={userId} inscripcion={inscripcion} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
            <p className="font-bold text-muted-foreground">Todavía no estás inscripto en ningún curso.</p>
            <Link to="/aprender" className="mt-4 inline-flex">
              <DuoButton>{t("nav.learn")}</DuoButton>
            </Link>
          </div>
        )}
        </section>
      </div>
      <div className="space-y-5">
        <aside className="rounded-2xl border-2 border-border bg-card p-3">
          <h2 className="flex items-center gap-2 font-extrabold"><Users className="h-5 w-5 text-primary" /> Amigos</h2>
          {amigos.data?.length ? (
            <ul className="mt-3 space-y-2">
              {amigos.data.slice(0, 4).map((amigo) => (
                <li key={amigo.amigo_id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-extrabold">{amigo.amigo_nombre}</span>
                  <span className="shrink-0 font-bold text-muted-foreground">{amigo.amigo_xp_total} XP</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm font-bold text-muted-foreground">Todavía no tenés amigos.</p>}
          <Link to="/amigos" className="mt-3 inline-flex text-sm font-extrabold text-primary">Ver amigos</Link>
        </aside>
        <aside className="rounded-2xl border-2 border-border bg-card p-3">
          <h2 className="flex items-center gap-2 font-extrabold"><Trophy className="h-5 w-5 text-gold" /> Ranking semanal</h2>
          <ol className="mt-3 space-y-2">
            {(ranking.data ?? []).slice(0, 4).map((usuario, index) => (
              <li key={usuario.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-extrabold">{index + 1}. {usuario.nombre}</span>
                <span className="shrink-0 font-bold text-muted-foreground">{usuario.xp_total} XP</span>
              </li>
            ))}
          </ol>
        </aside>
        <section className="space-y-3 rounded-2xl border-2 border-border bg-card p-3">
          <h2 className="flex items-center gap-2 font-extrabold"><Award className="h-5 w-5 text-gold" /> Insignias conseguidas</h2>
          {insignias.data?.length ? (
            <div className="space-y-2">
              {insignias.data.map((insignia) => (
                <article key={insignia.insignia_id} className="flex items-center gap-2 rounded-xl border-2 border-border p-2">
                  <Award className="h-6 w-6 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold">{insignia.insignia_nombre}</h3>
                    <p className="truncate text-xs font-bold text-muted-foreground">{insignia.insignia_descripcion}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="text-sm font-bold text-muted-foreground">Todavía no conseguiste insignias.</p>}
        </section>
      </div>
    </div>
  );
}

function ContinueCourse({
  userId,
  inscripcion,
}: {
  userId: number;
  inscripcion: { curso_id: number; curso_nivel: string; idioma_nombre: string; idioma_codigo: string };
}) {
  const { t } = useT();
  const navigate = useNavigate();
  const progreso = useQuery({
    queryKey: ["progreso", userId, inscripcion.curso_id],
    queryFn: () => api.progresoCurso(userId, inscripcion.curso_id),
  });

  const continuar = () => {
    if (progreso.data?.proxima_leccion_id) {
      navigate({ to: "/leccion/$leccionId", params: { leccionId: String(progreso.data.proxima_leccion_id) } });
      return;
    }
    navigate({ to: "/curso/$cursoId", params: { cursoId: String(inscripcion.curso_id) } });
  };

  if (progreso.data && progreso.data.total_lecciones > 0 && progreso.data.completadas >= progreso.data.total_lecciones) {
    return null;
  }

  return (
    <article className="flex h-36 w-full max-w-56 flex-col justify-between rounded-2xl border-2 border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-1 h-6 w-6 shrink-0 text-primary" />
        <div>
          <h3 className="text-lg font-extrabold">{inscripcion.idioma_nombre} · {inscripcion.curso_nivel}</h3>
          <p className="mt-1 font-bold text-muted-foreground">
            {progreso.data ? `${progreso.data.completadas}/${progreso.data.total_lecciones} ${t("course.lessons")}` : "Cargando progreso..."}
          </p>
        </div>
      </div>
      <DuoButton className="mt-3" size="sm" disabled={progreso.isLoading} onClick={continuar}>
        {progreso.data?.proxima_leccion_id
          ? progreso.data.completadas > 0 ? "Continuar" : "Comenzar"
          : "Ver curso"} <ArrowRight className="h-4 w-4" />
      </DuoButton>
    </article>
  );
}
