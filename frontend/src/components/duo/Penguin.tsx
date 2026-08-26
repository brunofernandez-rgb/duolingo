import penguin from "@/assets/penguin.png";
import { cn } from "@/lib/utils";

export function Penguin({
  className,
  float = false,
  priority = false,
}: {
  className?: string;
  float?: boolean;
  priority?: boolean;
}) {
  return (
    <img
      src={penguin}
      alt="Pingu, la mascota pingüino de la app"
      width={816}
      height={816}
      loading={priority ? "eager" : "lazy"}
      className={cn("object-contain", float && "animate-duo-float", className)}
    />
  );
}
