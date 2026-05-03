"use client";

import { useState } from "react";
import Link from "next/link";
import { Library, UserPlus, CheckCircle2, Lock, Mail, User, CreditCard } from "lucide-react";
import { authAPI, emailAPI } from "@/services/api";

// Gera o username no padrão: nome_bitechYYYYMM
function gerarUsername(nome: string): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  const nomeFormatado = nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")[0];
  return `${nomeFormatado}_bitech${ano}${mes}`;
}

export default function PaginaSolicitarAcesso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const username = gerarUsername(nome);

      const resposta = await authAPI.solicitarAcesso({
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpf.trim(),
        username,
        senha,
      });

      // Envia e-mail de notificação ao suporte via API Route do Resend
      try {
        await emailAPI.enviarAprovacaoCadastro(
          "suporte@bibliotech.com",
          resposta.id,
          nome.trim()
        );
      } catch {
        // Se o e-mail falhar, não bloqueia o fluxo
        console.warn("[Email] Falha ao notificar suporte, mas cadastro foi criado.");
      }

      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar solicitação.");
    } finally {
      setCarregando(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-center">
              Solicitação Enviada!
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Sua conta foi criada e está{" "}
              <span className="font-semibold text-amber-400">aguardando aprovação</span>.
              O suporte será notificado e ativará seu acesso em até{" "}
              <span className="font-semibold text-foreground">7 dias úteis</span>.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs text-amber-400 font-medium">
                Guarde seu e-mail e senha!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Quando sua conta for aprovada, você poderá fazer login com as credenciais que definiu.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              ← Voltar ao Login
            </Link>
          </p>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold tracking-tight">
              Solicitar Acesso
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha seus dados para solicitar acesso ao sistema
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleEnviar}
          className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="acesso-nome" className="text-sm font-medium">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="acesso-nome"
                type="text"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <label htmlFor="acesso-email" className="text-sm font-medium">
              E-mail profissional
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="acesso-email"
                type="email"
                placeholder="Ex: joao@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <label htmlFor="acesso-cpf" className="text-sm font-medium">
              CPF
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="acesso-cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <hr className="border-border" />

          {/* Senha */}
          <div className="space-y-2">
            <label htmlFor="acesso-senha" className="text-sm font-medium">
              Definir senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="acesso-senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <label htmlFor="acesso-confirmar" className="text-sm font-medium">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="acesso-confirmar"
                type="password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
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
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {carregando ? (
              <span className="animate-pulse">Enviando...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Enviar Solicitação
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já possui acesso?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
