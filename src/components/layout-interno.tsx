"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BarraLateral } from "@/components/barra-lateral";
import { BotaoTema } from "@/components/botao-tema";
import { useBiblioteca } from "@/lib/biblioteca-contexto";

// Rotas que NÃO devem exibir a barra lateral (telas públicas)
const rotasPublicas = ["/login", "/solicitar-acesso", "/cadastro-suporte", "/recuperar-senha"];

export default function LayoutInterno({
  children,
}: {
  children: React.ReactNode;
}) {
  const caminhoAtual = usePathname();
  const router = useRouter();
  const { usuarioLogado } = useBiblioteca();

  const ehRotaPublica = rotasPublicas.some((rota) =>
    caminhoAtual.startsWith(rota)
  );

  // Desativado para que o login não seja a página padrão
  // useEffect(() => {
  //   if (!usuarioLogado && !ehRotaPublica) {
  //     router.push("/login");
  //   }
  // }, [usuarioLogado, ehRotaPublica, router]);

  if (ehRotaPublica) {
    // Telas públicas: sem sidebar, conteúdo centralizado
    return <>{children}</>;
  }

  // Enquanto verifica o redirecionamento, se não tiver usuário não renderiza a casca
  // Comentado para permitir visualização sem login
  // if (!usuarioLogado) {
  //   return null; 
  // }

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

