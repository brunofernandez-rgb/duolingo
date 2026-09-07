import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Penguin } from "@/components/duo/Penguin";
import { DuoButton } from "@/components/duo/DuoButton";
import { useT } from "@/lib/useT";
import { setRemoteSession } from "@/lib/store";
import { api, usuarioIdDesdeToken } from "@/lib/api";

type Modo = "registro" | "login";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { modo: Modo } => ({
    modo: s.modo === "login" ? "login" : "registro",
  }),
  head: () => ({
    meta: [
      { title: "Crear cuenta o iniciar sesión — Pingu" },
      {
        name: "description",
        content: "Registrate gratis en Pingu o iniciá sesión para seguir sumando XP y racha.",
      },
      { property: "og:title", content: "Crear cuenta o iniciar sesión — Pingu" },
      {
        property: "og:description",
        content: "Registrate gratis en Pingu o iniciá sesión para seguir aprendiendo idiomas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { modo } = Route.useSearch();
  const { t } = useT();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const esRegistro = modo === "registro";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = esRegistro ? await api.register(nombre, email, password) : await api.login(email, password);
      localStorage.setItem("pingu.token", result.access_token);
      const usuario = await api.usuario(usuarioIdDesdeToken(result.access_token));
      setRemoteSession(usuario, result.access_token);
      navigate({ to: "/cursos" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("auth.notFound"));
    }
  }

  const inputClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-secondary px-4 text-base font-bold outline-none placeholder:text-muted-foreground focus:border-primary";

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary">
          <Penguin className="h-9 w-9" /> {t("app.name")}
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-extrabold">
          {esRegistro ? t("auth.register") : t("auth.login")}
        </h1>
        <form onSubmit={submit} className="space-y-3">
          {esRegistro && (
            <input
              className={inputClass}
              placeholder={t("auth.name")}
              value={nombre}
              required
              onChange={(e) => setNombre(e.target.value)}
            />
          )}
          <input
            className={inputClass}
            type="email"
            placeholder={t("auth.email")}
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inputClass}
            type="password"
            placeholder={t("common.password")}
            value={password}
            minLength={8}
            required
            autoComplete={esRegistro ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <DuoButton type="submit" size="lg" block>
            {esRegistro ? t("auth.register") : t("auth.login")}
          </DuoButton>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" search={{ modo: esRegistro ? "login" : "registro" }}>
            <DuoButton variant="ghost" size="sm">
              {esRegistro ? t("auth.haveAccount") : t("auth.register")}
            </DuoButton>
          </Link>
        </div>

      </main>
    </div>
  );
}
