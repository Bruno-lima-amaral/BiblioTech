"use client";

import { useState } from "react";
import Link from "next/link";
import { Library, UserPlus, Copy, CheckCircle2 } from "lucide-react";

// Gera uma senha aleatória de 8 dígitos
function gerarSenha(): string {
  let senha = "";
  for (let i = 0; i < 8; i++) {
    senha += Math.floor(Math.random() * 10).toString();
  }
  return senha;
}

// Gera o username no padrão: nome_bitechYYYYMM
function gerarUsername(nome: string): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  const nomeFormatado = nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .split(" ")[0]; // pega o primeiro nome
  return `${nomeFormatado}_bitech${ano}${mes}`;
}

export default function PaginaSolicitarAcesso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [usernameGerado, setUsernameGerado] = useState("");
  const [senhaGerada, setSenhaGerada] = useState("");
  const [tokenGerado, setTokenGerado] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    const username = gerarUsername(nome);
    const senha = gerarSenha();
    const token = Math.random().toString(36).substring(2, 15);

    setUsernameGerado(username);
    setSenhaGerada(senha);
    setTokenGerado(token);

    // Mock de envio de e-mail para o suporte
    const linkCadastro = `${window.location.origin}/cadastro-suporte?token=${token}&username=${username}&email=${encodeURIComponent(email)}&nome=${encodeURIComponent(nome)}`;

    console.log("═══════════════════════════════════════════════════");
    console.log("[MOCK EmailJS] E-mail enviado para suporte@bibliotech.com");
    console.log("Assunto: Nova Solicitação de Acesso — BiblioTech");
    console.log(`Funcionário: ${nome}`);
    console.log(`E-mail: ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Link de Cadastro: ${linkCadastro}`);
    console.log("═══════════════════════════════════════════════════");

    // Simula abertura de mailto com os dados
    const corpoEmail = `Nova solicitação de acesso ao BiblioTech.%0A%0AFuncionário: ${nome}%0AE-mail: ${email}%0AUsername: ${username}%0A%0ALink de cadastro: ${linkCadastro}`;
    const mailtoLink = `mailto:suporte@bibliotech.com?subject=Nova Solicitação de Acesso — BiblioTech&body=${corpoEmail}`;

    // Abre o link mailto (em produção, abriria o cliente de e-mail)
    window.open(mailtoLink, "_blank");

    setEnviado(true);
  }

  async function copiarTexto(texto: string, campo: string) {
    await navigator.clipboard.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  }

  if (enviado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Sucesso */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-center">
              Solicitação Enviada!
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              O suporte validará seu acesso em até{" "}
              <span className="font-semibold text-foreground">7 dias úteis</span>.
              Guarde as credenciais abaixo com segurança.
            </p>
          </div>

          {/* Credenciais geradas */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Suas Credenciais
            </h2>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Username</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg bg-muted/30 border border-border px-4 py-2.5 font-mono text-sm">
                  {usernameGerado}
                </div>
                <button
                  onClick={() => copiarTexto(usernameGerado, "username")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  title="Copiar username"
                >
                  {copiado === "username" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Senha (8 dígitos)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg bg-muted/30 border border-border px-4 py-2.5 font-mono text-sm tracking-widest">
                  {senhaGerada}
                </div>
                <button
                  onClick={() => copiarTexto(senhaGerada, "senha")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  title="Copiar senha"
                >
                  {copiado === "senha" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Aviso */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs text-amber-400 font-medium">
                ⚠️ Guarde sua senha! Ela não poderá ser recuperada.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Um e-mail foi enviado ao suporte com o link de ativação da sua conta.
              </p>
            </div>
          </div>

          {/* Link de teste para cadastro suporte (visível apenas em dev) */}
          <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              🔧 Link de cadastro (uso interno do Suporte):
            </p>
            <Link
              href={`/cadastro-suporte?token=${tokenGerado}&username=${usernameGerado}&email=${encodeURIComponent(email)}&nome=${encodeURIComponent(nome)}&senha=${senhaGerada}`}
              className="text-xs text-primary underline underline-offset-4 break-all hover:opacity-80"
            >
              /cadastro-suporte?token={tokenGerado}
            </Link>
          </div>

          {/* Voltar ao login */}
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
            <h1 className="text-3xl font-bold tracking-tight">Solicitar Acesso</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha seus dados para solicitar acesso ao sistema
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleEnviar}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="acesso-nome" className="text-sm font-medium">
              Nome completo
            </label>
            <input
              id="acesso-nome"
              type="text"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="acesso-email" className="text-sm font-medium">
              E-mail profissional
            </label>
            <input
              id="acesso-email"
              type="email"
              placeholder="Ex: joao@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-border bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" />
            Enviar Solicitação
          </button>
        </form>

        {/* Voltar ao login */}
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
