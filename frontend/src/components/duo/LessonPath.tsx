import { Link } from "@tanstack/react-router";
import { Check, Lock, Star } from "lucide-react";
import { useT } from "@/lib/useT";
import {
  contenidoDeLeccion,
  leccionCompletada,
  leccionDesbloqueada,
  leccionesDeCurso,
  type Leccion,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export function LessonPath({ cursoId, userId }: { cursoId: string; userId: string }) {
  const { t, lang } = useT();
  const lecciones = leccionesDeCurso(cursoId);

  return (
    <ol className="mx-auto flex max-w-md flex-col items-center gap-6 py-4">
      {lecciones.map((l: Leccion, i) => {
        const hecha = leccionCompletada(userId, l.id);
        const abierta = leccionDesbloqueada(userId, l);
        const contenido = contenidoDeLeccion(l);
        const offset = [0, 56, 80, 56, 0, -56, -80, -56][i % 8];
        const titulo = contenido ? contenido.titulo[lang] : l.titulo;

        const node = (
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-b-[6px] text-3xl shadow-sm transition-transform",
              hecha
                ? "border-gold-shadow bg-gold text-foreground"
                : abierta
                  ? "border-primary-shadow bg-primary text-primary-foreground hover:scale-105"
                  : "border-border bg-secondary text-muted-foreground",
            )}
          >
            {hecha ? (
              <Check className="h-9 w-9" strokeWidth={4} />
            ) : abierta ? (
              (contenido?.emoji ?? <Star className="h-8 w-8" />)
            ) : (
              <Lock className="h-7 w-7" strokeWidth={3} />
            )}
          </div>
        );

        return (
          <li
            key={l.id}
            className="flex flex-col items-center gap-2"
            style={{ transform: `translateX(${offset}px)` }}
          >
            {abierta ? (
              <Link to="/leccion/$leccionId" params={{ leccionId: l.id }} aria-label={titulo}>
                {node}
              </Link>
            ) : (
              <div title={t("lesson.locked")}>{node}</div>
            )}
            <p
              className={cn(
                "max-w-[10rem] text-center text-xs font-extrabold uppercase tracking-wide",
                abierta ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {titulo}
            </p>
            <span className="text-[10px] font-extrabold text-gold">+{l.xp_recompensa} XP</span>
          </li>
        );
      })}
    </ol>
  );
}
