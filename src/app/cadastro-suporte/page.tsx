"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Library, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useBiblioteca } from "@/lib/biblioteca-contexto";

// Componente interno que usa useSearchParams
function ConteudoCadastro() {
  const searchParams = useSearchParams();
  const { adicionarFuncionario } = useBiblioteca();

  // Dados vindos da URL (gerados na tela de solicitação)
  const token = searchParams.get("token") || "";
  const usernameParam = searchParams.get("username") || "";
  const emailParam = searchParams.get("email") || "";
  const nomeParam = searchParams.get("nome") || "";
  const senhaParam = searchParams.get("senha") || "";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [cadastrado, setCadastrado] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      return;
    }
    setNome(decodeURIComponent(nomeParam));
    setEmail(decodeURIComponent(emailParam));
    setUsername(usernameParam);
    setSenha(senhaParam);
  }, [token, nomeParam, emailParam, usernameParam, senhaParam]);

  function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !cargo.trim()) return;

    adicionarFuncionario({
      nome: nome.trim(),
      username,
      email: email.trim(),
      senha,
      cargo: cargo.trim(),
      ativo: true,
    });

    setCadastrado(true);
  }

  // Token inválido
  if (!tokenValido) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-sm text-muted-foreground">
            Esta página só pode ser acessada através do link gerado na solicitação de acesso.
            O token de cadastro não foi encontrado.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
          >
            ← Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  // Cadastro concluído
  if (cadastrado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Conta Ativada!</h1>
          <p className="text-sm text-muted-foreground">
            A conta de <span className="font-semibold text-foreground">{nome}</span> foi
            criada com sucesso. O funcionário já pode acessar o sistema com suas credenciais.
          </p>
          <div className="rounded-lg bg-muted/30 border border-border p-4 text-left space-y-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Username:</span>{" "}
              <span className="font-mono">{username}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">E-mail:</span> {email}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Cargo:</span> {cargo}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  // Formulário de cadastro
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Library className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Cadastro de Funcionário
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Página restrita ao Suporte — ativação de conta
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleCadastrar}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Campos readonly (dados da solicitação) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-4 text-sm text-muted-foreground font-mono cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha gerada</label>
            <input
              type="text"
              value={senha}
              readOnly
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-4 text-sm text-muted-foreground font-mono tracking-widest cursor-not-allowed"
            />
          </div>

          <hr className="border-border" />

          {/* Campos editáveis pelo suporte */}
          <div className="space-y-2">
            <label htmlFor="cadastro-nome" className="text-sm font-medium">
              Nome completo
            </label>
            <input
              id="cadastro-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cadastro-email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="cadastro-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cadastro-cargo" className="text-sm font-medium">
              Cargo
            </label>
            <input
              id="cadastro-cargo"
              type="text"
              placeholder="Ex: Bibliotecário, Atendente"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <ShieldCheck className="h-4 w-4" />
            Ativar Conta
          </button>
        </form>
      </div>
    </div>
  );
}

// Componente exportado com Suspense boundary (requerido pelo Next.js para useSearchParams)
export default function PaginaCadastroSuporte() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      }
    >
      <ConteudoCadastro />
    </Suspense>
  );
}
