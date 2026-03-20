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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const itensNavegacao = [
  { titulo: "Início", href: "/", icone: Home },
  { titulo: "Acervo", href: "/acervo", icone: BookOpen },
  { titulo: "Clientes", href: "/clientes", icone: Users },
  { titulo: "Empréstimos", href: "/emprestimos", icone: ClipboardList },
  { titulo: "Suporte", href: "/tickets", icone: LifeBuoy },
];

const ConteudoLateral = ({ caminhoAtual }: { caminhoAtual: string }) => (
  <>
    {/* Logo */}
    <div className="flex h-16 items-center flex-shrink-0 gap-3 border-b border-border px-6">
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
    <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
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
    <div className="border-t border-border p-4 mt-auto flex-shrink-0">
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Projeto POO — 2026
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          Interface estática v1.0
        </p>
      </div>
    </div>
  </>
);

export function BarraLateral() {
  const caminhoAtual = usePathname();

  return (
    <>
      {/* HEADER MOBILE */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Library className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">BiblioTech</span>
        </div>

        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <SheetDescription className="sr-only">Navegue pelas páginas do sistema.</SheetDescription>
            <ConteudoLateral caminhoAtual={caminhoAtual} />
          </SheetContent>
        </Sheet>
      </header>

      {/* BARRA LATERAL DESKTOP */}
      <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-64 flex-col border-r border-border bg-card">
        <ConteudoLateral caminhoAtual={caminhoAtual} />
      </aside>
    </>
  );
}
