import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Trophy,
  Users,
  Award,
  User,
  Flame,
  Zap,
  LogOut,
  Globe,
  Home,
  CalendarDays,
  Shield,
} from "lucide-react";
import type { ReactNode } from "react";
import { Penguin } from "./Penguin";
import { useT } from "@/lib/useT";
import { api } from "@/lib/api";
import { UI_LANGS } from "@/lib/i18n";
import { cerrarSesion, setUiLang, useDB, usuarioActual } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/aprender", key: "nav.learn", icon: BookOpen },
  { to: "/cursos", key: "nav.courses", icon: Globe },
  { to: "/ranking", key: "nav.ranking", icon: Trophy },
  { to: "/ranking-amigos", key: "nav.friendsRanking", icon: Trophy },
  { to: "/amigos", key: "nav.friends", icon: Users },
  { to: "/insignias", key: "nav.badges", icon: Award },
  { to: "/actividad", key: "nav.activity", icon: CalendarDays },
  { to: "/perfil", key: "nav.profile", icon: User },
] as const;

const ADMIN_NAV = { to: "/admin", key: "nav.admin", icon: Shield } as const;
const ADMIN_EMAIL = "admin@gmail.com";

export function LanguagePicker() {
  const { t, lang } = useT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("auth.uiLang")}
        className="flex items-center gap-2 rounded-xl border-2 border-border px-3 py-1.5 text-sm font-bold text-muted-foreground hover:bg-secondary"
      >
        <img className="h-5 w-7 rounded object-cover" src={UI_LANGS.find((l) => l.code === lang)?.flag} alt="Idioma de la aplicación" />
        <span className="hidden sm:inline">{UI_LANGS.find((l) => l.code === lang)?.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        {UI_LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setUiLang(l.code)}
            className="cursor-pointer rounded-xl font-bold"
          >
            <img className="mr-2 h-5 w-7 rounded object-cover" src={l.flag} alt={`Bandera de ${l.label}`} />
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const db = useDB();
  const user = usuarioActual(db);
  const userQuery = useQuery({
    queryKey: ["usuario", user?.id],
    queryFn: () => api.usuario(Number(user?.id)),
    enabled: Boolean(user),
  });
  const currentUser = userQuery.data ?? user;
  const isAdmin = currentUser?.email.toLowerCase() === ADMIN_EMAIL;
  const navItems = isAdmin ? [...NAV.filter((item) => item.to !== "/amigos" && item.to !== "/ranking-amigos"), ADMIN_NAV] : NAV;
  const mobileNavItems = navItems;
  const { t } = useT();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b-2 border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <Penguin className="h-9 w-9" />
            <span className="text-xl font-extrabold tracking-tight text-primary">
              {t("app.name")}
            </span>
          </div>
          <div className="flex-1" />
          {currentUser && (
            <div className="flex items-center gap-3 text-sm font-extrabold">
              <span className="flex items-center gap-1 text-streak" title={t("streak.days")}>
                <Flame className="h-5 w-5" /> {currentUser.racha_dias}
              </span>
              <span className="flex items-center gap-1 text-gold" title={t("xp.total")}>
                <Zap className="h-5 w-5" /> {currentUser.xp_total}
              </span>
            </div>
          )}
          {currentUser && (
            <button
              onClick={() => {
                cerrarSesion();
                navigate({ to: "/" });
              }}
              aria-label={t("auth.logout")}
              className="rounded-xl p-2 text-muted-foreground hover:bg-secondary"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-6 md:pb-10">
        <nav className="hidden w-56 shrink-0 md:block">
          <ul className="sticky top-24 space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 rounded-2xl border-2 border-transparent px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary"
                  activeProps={{
                    className: cn(
                      "flex items-center gap-3 rounded-2xl border-2 border-primary bg-primary-soft px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-primary",
                    ),
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background md:hidden">
        <ul className="flex w-full items-center gap-2 overflow-x-auto overscroll-x-contain px-3 py-2.5">
          {mobileNavItems.map((item) => (
            <li key={item.to} className="shrink-0">
              <Link
                to={item.to}
                className="flex h-12 w-14 flex-col items-center justify-center rounded-2xl text-muted-foreground"
                activeProps={{
                  className:
                    "flex h-12 w-14 flex-col items-center justify-center rounded-2xl bg-primary-soft text-primary",
                }}
              >
                <item.icon className="h-6 w-6" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
