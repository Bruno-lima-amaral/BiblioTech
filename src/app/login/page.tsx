"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Library, LogIn, Mail, Lock } from "lucide-react";
import { useBiblioteca } from "@/lib/biblioteca-contexto";

export default function PaginaLogin() {
  const router = useRouter();
  const { loginFuncionario } = useBiblioteca();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    // Simula um pequeno delay de autenticação
    setTimeout(() => {
      const sucesso = loginFuncionario(email, senha);
      if (sucesso) {
        router.push("/");
      } else {
        setErro("E-mail ou senha inválidos. Verifique seus dados.");
      }
      setCarregando(false);
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Library className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">BiblioTech</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse o sistema de gerenciamento da biblioteca
            </p>
          </div>
        </div>

        {/* Formulário de login */}
        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Campo de e-mail */}
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="login-email"
                type="email"
                placeholder="seu.email@bibliotech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Campo de senha */}
          <div className="space-y-2">
            <label htmlFor="login-senha" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="login-senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {erro}
            </div>
          )}

          {/* Botão de login */}
          <button
            type="submit"
            disabled={carregando}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {carregando ? (
              <span className="animate-pulse">Autenticando...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Entrar
              </>
            )}
          </button>

          {/* Dados de teste */}
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Credenciais de teste:
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              suporte@bibliotech.com / Sup0rt3!
            </p>
          </div>
        </form>

        {/* Link para solicitar acesso */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Esqueceu sua senha?{" "}
            <Link
              href="/recuperar-senha"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Recuperar Senha
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Ainda não possui acesso?{" "}
            <Link
              href="/solicitar-acesso"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Solicitar Acesso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
