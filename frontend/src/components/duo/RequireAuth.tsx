import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { DuoButton } from "./DuoButton";
import { Penguin } from "./Penguin";
import { useDB, usuarioActual, type Usuario, type DBState } from "@/lib/store";
import { useT } from "@/lib/useT";

export function RequireAuth({
  children,
}: {
  children: (ctx: { user: Usuario; db: DBState }) => ReactNode;
}) {
  const db = useDB();
  const user = usuarioActual(db);
  const { t } = useT();

  if (!user) {
    return (
      <AppShell>
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <Penguin className="h-32 w-32" float />
          <h1 className="text-2xl font-extrabold">{t("app.tagline")}</h1>
          <div className="flex gap-3">
            <Link to="/auth" search={{ modo: "registro" }}>
              <DuoButton>{t("auth.register")}</DuoButton>
            </Link>
            <Link to="/auth" search={{ modo: "login" }}>
              <DuoButton variant="outline">{t("auth.login")}</DuoButton>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children({ user, db })}</AppShell>;
}
