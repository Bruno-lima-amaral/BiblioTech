"use client";

import { useState } from "react";
import Link from "next/link";
import { Library, Mail, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authAPI, emailAPI } from "@/services/api";

export default function PaginaRecuperarSenha() {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // 1. Chama o backend para gerar o token de redefinição (15 min)
      const resposta = await authAPI.esqueciSenha(email.trim(), cpf.trim());

      // 2. Envia o e-mail via API Route do Resend com o token
      await emailAPI.enviarRedefinicaoSenha(email.trim(), resposta.token, "");

      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao processar solicitação.");
    } finally {
      setCarregando(false);
    }
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
              Recuperar Senha
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Informe seu e-mail e CPF cadastrados para receber o link de redefinição
            </p>
          </div>
        </div>

        {/* Formulário ou mensagem de sucesso */}
        {enviado ? (
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">E-mail Enviado!</h2>
              <p className="text-sm text-muted-foreground">
                Se os dados de{" "}
                <span className="font-medium text-foreground">{email}</span>{" "}
                estiverem cadastrados no sistema, um link de redefinição foi
                enviado para sua caixa de entrada.
              </p>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs text-amber-400 font-medium">
                Verifique também a caixa de spam.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                O link de redefinição expira em <strong>15 minutos</strong>.
              </p>
            </div>

            <Link
              href="/login"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleEnviar}
            className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            {/* Campo de e-mail */}
            <div className="space-y-2">
              <label htmlFor="recuperar-email" className="text-sm font-medium">
                E-mail cadastrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="recuperar-email"
                  type="email"
                  placeholder="seu.email@bibliotech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Campo de CPF */}
            <div className="space-y-2">
              <label htmlFor="recuperar-cpf" className="text-sm font-medium">
                CPF cadastrado
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="recuperar-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
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

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {carregando ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Enviar Link de Recuperação
                </>
              )}
            </button>
          </form>
        )}

        {/* Voltar ao login */}
        {!enviado && (
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              ← Voltar ao Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
