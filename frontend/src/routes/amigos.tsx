import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Flame, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/amigos")({ component: () => <RequireAuth>{(ctx) => <Amigos {...ctx} />}</RequireAuth> });
function Amigos({ user }: { user: { id: string } }) {
  const { t } = useT(); const queryClient = useQueryClient(); const [email, setEmail] = useState(""); const userId = Number(user.id);
  const amigos = useQuery({ queryKey: ["amigos", userId], queryFn: () => api.amigos(userId) });
  const requests = useQuery({ queryKey: ["solicitudes-amistad", userId], queryFn: () => api.solicitudesAmistad(userId) });
  const add = useMutation({ mutationFn: () => api.solicitarAmigo(userId, email), onSuccess: () => { setEmail(""); toast.success(t("friends.requestSent")); }, onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo enviar") });
  const respond = useMutation({ mutationFn: ({ id, aceptar }: { id: number; aceptar: boolean }) => api.responderSolicitud(id, userId, aceptar), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["amigos", userId] }); queryClient.invalidateQueries({ queryKey: ["solicitudes-amistad", userId] }); } });
  const remove = useMutation({ mutationFn: (friendId: number) => api.eliminarAmigo(userId, friendId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amigos", userId] }) });
  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">{t("friends.title")}</h1><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (email.trim()) add.mutate(); }}><input type="email" required className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-border bg-secondary px-4 font-bold" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("friends.emailPlaceholder")} /><DuoButton type="submit" disabled={add.isPending}>{t("friends.add")}</DuoButton></form>{requests.data?.length ? <section className="space-y-3"><h2 className="text-lg font-extrabold">{t("friends.requests")}</h2>{requests.data.map((request) => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4"><span className="font-extrabold">{request.solicitante_nombre} · {request.solicitante_email}</span><div className="flex gap-2"><DuoButton size="sm" onClick={() => respond.mutate({ id: request.id, aceptar: true })}>{t("friends.accept")}</DuoButton><DuoButton size="sm" variant="danger" onClick={() => respond.mutate({ id: request.id, aceptar: false })}>{t("friends.reject")}</DuoButton></div></div>)}</section> : null}{amigos.isLoading ? <p>{t("friends.loading")}</p> : (amigos.data ?? []).map((friend) => <div key={friend.amigo_id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4"><div><p className="font-extrabold">{friend.amigo_nombre}</p><div className="mt-1 flex gap-4 text-sm font-bold text-muted-foreground"><span className="flex items-center gap-1 text-gold"><Zap className="h-4 w-4" />{friend.amigo_xp_total} XP</span><span className="flex items-center gap-1 text-streak"><Flame className="h-4 w-4" />{friend.amigo_racha_dias} {t("streak.days")}</span></div></div><DuoButton size="sm" variant="danger" onClick={() => remove.mutate(friend.amigo_id)}>{t("friends.remove")}</DuoButton></div>)}</div>;
}
