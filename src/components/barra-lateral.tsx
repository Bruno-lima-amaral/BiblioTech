"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  ClipboardList,
  Landmark,
  Library,
  LifeBuoy,
  Menu,
  LogOut,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BotaoTema } from "@/components/botao-tema";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-contexto";

// Todos os itens de navegação com marcação de permissão
const todosItensNavegacao = [
  { titulo: "Dashboard", href: "/", icone: Home, restrito: false },
  { titulo: "Acervo", href: "/acervo", icone: BookOpen, restrito: false },
  { titulo: "Clientes", href: "/clientes", icone: Users, restrito: false },
  { titulo: "Histórico de Empréstimos", href: "/emprestimos", icone: ClipboardList, restrito: false },
  { titulo: "Balcão", href: "/balcao", icone: Landmark, restrito: false },
  { titulo: "Suporte", href: "/tickets", icone: LifeBuoy, restrito: false },
  { titulo: "Funcionários", href: "/funcionarios", icone: UserCog, restrito: true }, // Apenas ADMIN/SUPORTE
];

const ConteudoLateral = ({
  caminhoAtual,
  aoClicarLink,
  itensNavegacao,
  usuario,
  onLogout,
}: {
  caminhoAtual: string;
  aoClicarLink?: () => void;
  itensNavegacao: typeof todosItensNavegacao;
  usuario: { nome: string; perfil: string } | null;
  onLogout: () => void;
}) => (
  <>
    {/* Logo */}
    <div className="flex h-16 items-center flex-shrink-0 gap-3 border-b border-border px-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Library className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">BiblioTech</h1>
        <p className="text-[11px] leading-none text-sidebar-foreground/60">
          Sistema de Biblioteca
        </p>
      </div>
    </div>

    {/* Navegação */}
    <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">
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
            onClick={aoClicarLink}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              estaAtivo
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icone className="h-4 w-4" />
            {item.titulo}
          </Link>
        );
      })}
    </nav>

    {/* Rodapé com info do usuário e logout */}
    <div className="border-t border-border p-4 mt-auto flex-shrink-0 space-y-3">
      {usuario && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-sidebar-foreground/90 truncate">
            {usuario.nome}
          </p>
          <p className="text-[11px] text-sidebar-foreground/50">
            {usuario.perfil}
          </p>
        </div>
      )}
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </div>
  </>
);

export function BarraLateral() {
  const caminhoAtual = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario, logout, podeGerenciarFuncionarios } = useAuth();

  // Filtra itens baseado no perfil
  const itensNavegacao = useMemo(() => {
    return todosItensNavegacao.filter((item) => {
      if (item.restrito) return podeGerenciarFuncionarios;
      return true;
    });
  }, [podeGerenciarFuncionarios]);

  // Fecha o menu mobile ao mudar de rota
  useEffect(() => {
    setMenuAberto(false);
  }, [caminhoAtual]);

  // -- Swipe detection refs --
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= 30) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);

    if (deltaX > 60 && deltaX > deltaY) {
      setMenuAberto(true);
    }
  }, []);

  const infoUsuario = usuario ? { nome: usuario.nome, perfil: usuario.perfil } : null;

  return (
    <>
      {/* SWIPE ZONE */}
      <div
        className="fixed inset-y-0 left-0 z-30 w-5 md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-hidden="true"
      />

      {/* HEADER MOBILE */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Library className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">BiblioTech</span>
        </div>

        <div className="flex items-center gap-1">
          <BotaoTema />

        <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-sidebar border-sidebar-border">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <SheetDescription className="sr-only">Navegue pelas páginas do sistema.</SheetDescription>
            <ConteudoLateral
              caminhoAtual={caminhoAtual}
              aoClicarLink={() => setMenuAberto(false)}
              itensNavegacao={itensNavegacao}
              usuario={infoUsuario}
              onLogout={logout}
            />
          </SheetContent>
        </Sheet>
        </div>
      </header>

      {/* BARRA LATERAL DESKTOP */}
      <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <ConteudoLateral
          caminhoAtual={caminhoAtual}
          itensNavegacao={itensNavegacao}
          usuario={infoUsuario}
          onLogout={logout}
        />
      </aside>
    </>
  );
}
