"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Library, ShieldCheck, CheckCircle2 } from "lucide-react";
import { authAPI } from "@/services/api";
import { useAuth } from "@/lib/auth-contexto";

function ConteudoCadastro() {
  const searchParams = useSearchParams();
  const { usuario, podeGerenciarFuncionarios } = useAuth();

  const idParam = searchParams.get("id") || "";
  const nomeParam = searchParams.get("nome") || "";

  const [perfilSelecionado, setPerfilSelecionado] = useState("ATENDENTE");
  const [aprovado, setAprovado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Verifica se é admin/suporte logado
  const semPermissao = usuario && !podeGerenciarFuncionarios;

  if (!idParam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Link Inválido</h1>
          <p className="text-sm text-muted-foreground">
            Esta página só pode ser acessada através do link de aprovação.
          </p>
          <Link
            href="/"
            className="inline-block text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
          >
            ← Ir para o Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (semPermissao) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-sm text-muted-foreground">
            Apenas administradores e suporte podem aprovar cadastros.
          </p>
        </div>
      </div>
    );
  }

  async function handleAprovar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await authAPI.aprovar(Number(idParam), perfilSelecionado);
      setAprovado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao aprovar cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  if (aprovado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Conta Ativada!</h1>
          <p className="text-sm text-muted-foreground">
            A conta de{" "}
            <span className="font-semibold text-foreground">
              {decodeURIComponent(nomeParam)}
            </span>{" "}
            foi aprovada com o perfil{" "}
            <span className="font-semibold text-primary">
              {perfilSelecionado}
            </span>.
            O funcionário já pode acessar o sistema.
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Library className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Aprovar Cadastro
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Defina o perfil de acesso e ative a conta
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAprovar}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Nome do solicitante */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Funcionário</label>
            <div className="rounded-lg bg-muted/30 border border-border px-4 py-2.5 text-sm text-foreground">
              {decodeURIComponent(nomeParam) || `ID: ${idParam}`}
            </div>
          </div>

          {/* Seleção de perfil */}
          <div className="space-y-2">
            <label htmlFor="perfil" className="text-sm font-medium">
              Perfil de Acesso
            </label>
            <select
              id="perfil"
              value={perfilSelecionado}
              onChange={(e) => setPerfilSelecionado(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ATENDENTE">ATENDENTE — Acesso básico</option>
              <option value="SUPORTE">SUPORTE — Acesso total</option>
              <option value="ADMIN">ADMIN — Acesso total</option>
            </select>
          </div>

          {/* Descrição do perfil */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <p className="text-xs text-blue-300 font-medium">Permissões do perfil:</p>
            <p className="text-xs text-muted-foreground mt-1">
              {perfilSelecionado === "ATENDENTE"
                ? "Acervo, Clientes, Empréstimos, Balcão e criação de Tickets."
                : "Acesso total ao sistema, incluindo gerenciamento de Funcionários e Tickets."}
            </p>
          </div>

          {/* Erro */}
          {erro && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-medium text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {carregando ? (
              <span className="animate-pulse">Aprovando...</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Aprovar e Ativar Conta
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

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
