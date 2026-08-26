import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/aprender")({ component: Aprender });

function Aprender() {
  const navigate = useNavigate();
  useEffect(() => { navigate({ to: "/cursos", replace: true }); }, [navigate]);
  return null;
}
