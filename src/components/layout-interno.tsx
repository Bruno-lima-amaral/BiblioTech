"use client";

import { usePathname } from "next/navigation";
import { BarraLateral } from "@/components/barra-lateral";
import { BotaoTema } from "@/components/botao-tema";
import { useAuth } from "@/lib/auth-contexto";

// Rotas que NÃO devem exibir a barra lateral (telas públicas)
const rotasPublicas = ["/login", "/solicitar-acesso", "/cadastro-suporte", "/recuperar-senha", "/redefinir-senha"];

export default function LayoutInterno({
  children,
}: {
  children: React.ReactNode;
}) {
  const caminhoAtual = usePathname();
  const { usuario, carregando } = useAuth();

  const ehRotaPublica = rotasPublicas.some((rota) =>
    caminhoAtual.startsWith(rota)
  );

  if (ehRotaPublica) {
    // Telas públicas: sem sidebar, conteúdo centralizado
    return <>{children}</>;
  }

  // Enquanto carrega a sessão, mostra loading
  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  // Se não está autenticado e não é rota pública, não renderiza
  // (o AuthProvider já redireciona para /login)
  if (!usuario) {
    return null;
  }

  // Telas internas: com sidebar + área principal
  return (
    <>
      <BarraLateral />
      <main className="flex-1 w-full md:w-auto md:ml-64 min-h-screen">
        {/* Barra superior desktop com botão de tema */}
        <div className="hidden md:flex items-center justify-end h-14 px-6 border-b border-border bg-card sticky top-0 z-30">
          <BotaoTema />
        </div>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </>
  );
}
