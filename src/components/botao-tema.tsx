"use client";

import { Sun, Moon } from "lucide-react";
import { useTema } from "@/lib/tema-contexto";
import { Button } from "@/components/ui/button";

export function BotaoTema({ className }: { className?: string }) {
  const { tema, alternarTema } = useTema();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={alternarTema}
      className={className}
      aria-label={tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {tema === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300 rotate-0" />
      )}
    </Button>
  );
}
