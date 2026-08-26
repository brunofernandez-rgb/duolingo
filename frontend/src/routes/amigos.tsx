import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

export const Route = createFileRoute("/amigos")({ component: () => <RequireAuth>{(ctx) => <Amigos {...ctx} />}</RequireAuth> });
function Amigos({ user }: { user: { id: string } }) {
  const { t } = useT(); const queryClient = useQueryClient(); const [id, setId] = useState(""); const userId = Number(user.id);
  const amigos = useQuery({ queryKey: ["amigos", userId], queryFn: () => api.amigos(userId) });
  const add = useMutation({ mutationFn: () => api.agregarAmigo(userId, Number(id)), onSuccess: () => { setId(""); queryClient.invalidateQueries({ queryKey: ["amigos", userId] }); }, onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo agregar") });
  const remove = useMutation({ mutationFn: (friendId: number) => api.eliminarAmigo(userId, friendId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amigos", userId] }) });
  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">{t("friends.title")}</h1><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (Number(id)) add.mutate(); }}><input className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-border bg-secondary px-4 font-bold" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID de usuario" /><DuoButton type="submit">{t("friends.add")}</DuoButton></form>{amigos.isLoading ? <p>Cargando amigos...</p> : (amigos.data ?? []).map((friend) => <div key={friend.amigo_id} className="flex items-center justify-between rounded-2xl border-2 border-border bg-card p-4"><span className="font-extrabold">{friend.amigo_nombre} · {friend.amigo_xp_total} XP</span><DuoButton size="sm" variant="danger" onClick={() => remove.mutate(friend.amigo_id)}>{t("friends.remove")}</DuoButton></div>)}</div>;
}
