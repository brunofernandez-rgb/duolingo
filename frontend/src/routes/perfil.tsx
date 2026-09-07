import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Flame, KeyRound, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { DuoButton } from "@/components/duo/DuoButton";
import { Penguin } from "@/components/duo/Penguin";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { cerrarSesion } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  component: () => <RequireAuth>{(ctx) => <Perfil {...ctx} />}</RequireAuth>,
});

function Perfil({ user }: { user: { id: string } }) {
  const { t } = useT();
  const query = useQuery({ queryKey: ["usuario", user.id], queryFn: () => api.usuario(Number(user.id)) });
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (query.isLoading) return <p>{t("profile.loading")}</p>;
  if (query.isError || !query.data) return <p>{t("profile.loadError")}</p>;

  async function changePassword() {
    if (passwordActual === passwordNueva) {
      toast.error(t("profile.passwordSameError"));
      return;
    }
    setChangingPassword(true);
    try {
      await api.cambiarPassword(Number(user.id), passwordActual, passwordNueva);
      setPasswordActual("");
      setPasswordNueva("");
      toast.success(t("auth.passwordUpdated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("profile.passwordIncorrect"));
    } finally {
      setChangingPassword(false);
    }
  }

  async function deleteAccount() {
    const passwordForDeletion = window.prompt(t("profile.passwordPlaceholder"));
    if (!passwordForDeletion || !window.confirm(t("profile.deleteConfirm"))) return;
    setDeleting(true);
    try {
      await api.eliminarCuenta(Number(user.id), passwordForDeletion);
      cerrarSesion();
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("profile.deleteError"));
      setDeleting(false);
    }
  }

  const inputClass = "h-12 w-full rounded-xl border-2 border-border bg-background px-4 font-bold";
  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">{query.data.nombre}</h1>
        <p className="font-bold text-muted-foreground">{query.data.email}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-border bg-card p-5"><Zap className="text-gold" /><p className="mt-2 text-2xl font-extrabold">{query.data.xp_total}</p><p className="font-bold text-muted-foreground">{t("xp.total")}</p></div>
            <div className="rounded-2xl border-2 border-border bg-card p-5"><Flame className="text-streak" /><p className="mt-2 text-2xl font-extrabold">{query.data.racha_dias}</p><p className="font-bold text-muted-foreground">{t("streak.days")}</p></div>
          </div>
          <section className="space-y-3 rounded-2xl border-2 border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><KeyRound className="h-5 w-5" /> {t("common.changePassword")}</h2>
            <input type={showPasswords ? "text" : "password"} value={passwordActual} onChange={(event) => setPasswordActual(event.target.value)} placeholder={t("profile.passwordPlaceholder")} className={inputClass} autoComplete="current-password" />
            <input type={showPasswords ? "text" : "password"} value={passwordNueva} onChange={(event) => setPasswordNueva(event.target.value)} placeholder={t("common.changePassword")} className={inputClass} minLength={8} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPasswords((show) => !show)} aria-pressed={showPasswords} className="flex items-center gap-2 font-bold text-primary hover:underline">
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? t("profile.hidePasswords") : t("profile.showPasswords")}
            </button>
            {passwordActual && passwordNueva && passwordActual === passwordNueva && <p className="text-sm font-bold text-destructive">{t("profile.passwordSameError")}</p>}
            <DuoButton block onClick={changePassword} disabled={!passwordActual || passwordNueva.length < 8 || passwordActual === passwordNueva || changingPassword}>{t("common.changePassword")}</DuoButton>
          </section>
        </div>
        <aside className="flex min-h-96 flex-col items-center justify-start lg:relative lg:min-h-0">
          <Penguin className="h-[28rem] w-full max-w-md lg:absolute lg:-top-20" float priority />
          <DuoButton variant="danger" block className="mt-2 max-w-xs lg:absolute lg:bottom-5" onClick={deleteAccount} disabled={deleting}>
            <Trash2 className="h-4 w-4" /> {t("profile.delete")}
          </DuoButton>
        </aside>
      </div>
    </div>
  );
}
