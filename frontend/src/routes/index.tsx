import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame, Mail, User, Zap } from "lucide-react";
import { Penguin } from "@/components/duo/Penguin";
import { DuoButton } from "@/components/duo/DuoButton";
import { AppShell, LanguagePicker } from "@/components/duo/AppShell";
import { useT } from "@/lib/useT";
import { IDIOMAS } from "@/data/content";
import { api } from "@/lib/api";
import { useDB, usuarioActual } from "@/lib/store";

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
  const query = useQuery({ queryKey: ["usuario", userId], queryFn: () => api.usuario(userId) });

  if (query.isLoading) return <p>Cargando tu perfil...</p>;
  if (query.isError || !query.data) return <p>No se pudo cargar tu perfil.</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-primary">Pingu</p>
        <h1 className="mt-2 text-3xl font-extrabold">Tu panel</h1>
      </div>
      <section className="rounded-3xl border-2 border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-2xl font-extrabold"><User className="h-6 w-6 text-primary" /> {query.data.nombre}</p>
            <p className="mt-2 flex items-center gap-2 font-bold text-muted-foreground"><Mail className="h-4 w-4" /> {query.data.email}</p>
          </div>
          <div className="flex flex-wrap gap-5 font-extrabold">
            <span className="flex items-center gap-2 text-gold"><Zap className="h-6 w-6" /> {query.data.xp_total} {t("xp.total")}</span>
            <span className="flex items-center gap-2 text-streak"><Flame className="h-6 w-6" /> {query.data.racha_dias} {t("streak.days")}</span>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link to="/cursos"><DuoButton>{t("nav.courses")}</DuoButton></Link>
        <Link to="/aprender"><DuoButton variant="outline">{t("nav.learn")}</DuoButton></Link>
      </div>
    </div>
  );
}
