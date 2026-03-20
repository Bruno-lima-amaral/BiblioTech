"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  ClipboardList,
  Library,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const itensNavegacao = [
  { titulo: "Início", href: "/", icone: Home },
  { titulo: "Acervo", href: "/acervo", icone: BookOpen },
  { titulo: "Clientes", href: "/clientes", icone: Users },
  { titulo: "Empréstimos", href: "/emprestimos", icone: ClipboardList },
  { titulo: "Suporte", href: "/tickets", icone: LifeBuoy },
];

export function BarraLateral() {
  const caminhoAtual = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Library className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">BiblioTech</h1>
          <p className="text-[11px] leading-none text-muted-foreground">
            Sistema de Biblioteca
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Menu principal
        </p>
        {itensNavegacao.map((item) => {
          const Icone = item.icone;
          const estaAtivo =
            caminhoAtual === item.href ||
            (item.href !== "/" && caminhoAtual.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                estaAtivo
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icone className="h-4 w-4" />
              {item.titulo}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Projeto POO — 2026
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Interface estática v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
