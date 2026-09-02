import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Flame, KeyRound, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { cerrarSesion } from "@/lib/store";
import { DuoButton } from "@/components/duo/DuoButton";

export const Route = createFileRoute("/perfil")({ component: () => <RequireAuth>{(ctx) => <Perfil {...ctx} />}</RequireAuth> });
function Perfil({ user }: { user: { id: string } }) {
  const { t } = useT();
  const query = useQuery({ queryKey: ["usuario", user.id], queryFn: () => api.usuario(Number(user.id)) });
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [deleting, setDeleting] = useState(false);
  if (query.isLoading) return <p>Cargando perfil...</p>;
  if (query.isError || !query.data) return <p>No se pudo cargar el perfil.</p>;
  async function verify() {
    try {
      await api.verificarPassword(Number(user.id), password);
      setVerified(true);
      toast.success("Contraseña verificada. Las contraseñas no se pueden recuperar porque se guardan cifradas.");
    } catch (error) {
      setVerified(false);
      toast.error(error instanceof Error ? error.message : "Contraseña incorrecta");
    }
  }

  async function deleteAccount() {
    if (!window.confirm("¿Seguro que querés borrar tu cuenta? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    try {
      await api.eliminarCuenta(Number(user.id), password);
      cerrarSesion();
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo borrar la cuenta");
      setDeleting(false);
    }
  }

  return <div className="max-w-xl space-y-6"><h1 className="text-2xl font-extrabold">{query.data.nombre}</h1><p className="font-bold text-muted-foreground">{query.data.email}</p><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border-2 border-border bg-card p-5"><Zap className="text-gold" /><p className="mt-2 text-2xl font-extrabold">{query.data.xp_total}</p><p className="font-bold text-muted-foreground">{t("xp.total")}</p></div><div className="rounded-2xl border-2 border-border bg-card p-5"><Flame className="text-streak" /><p className="mt-2 text-2xl font-extrabold">{query.data.racha_dias}</p><p className="font-bold text-muted-foreground">{t("streak.days")}</p></div></div><section className="space-y-4 rounded-2xl border-2 border-border bg-card p-5"><h2 className="flex items-center gap-2 text-lg font-extrabold"><KeyRound className="h-5 w-5" /> Seguridad</h2><p className="text-sm font-bold text-muted-foreground">Ingresá la contraseña de tu cuenta de Pingu para confirmar tu identidad.</p><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setVerified(false); }} placeholder="Contraseña de Pingu" className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 font-bold" /><DuoButton block onClick={verify} disabled={!password}>Verificar contraseña</DuoButton>{verified && <p className="text-sm font-bold text-muted-foreground">La contraseña está verificada. Por seguridad, no se puede mostrar ni recuperar una contraseña almacenada como hash.</p>}<DuoButton variant="danger" block onClick={deleteAccount} disabled={!password || deleting}><Trash2 className="h-4 w-4" /> Borrar mi cuenta</DuoButton></section></div>;
}
