"use client";

import Link from "next/link";
import { BookOpen, Users, ClipboardList, TrendingUp } from "lucide-react";
import { useBiblioteca } from "@/lib/biblioteca-contexto";

export default function PaginaInicial() {
  const { livros, clientes, emprestimos } = useBiblioteca();

  const estatisticas = [
    {
      titulo: "Total de Livros",
      valor: livros.length,
      icone: BookOpen,
      cor: "from-blue-500/20 to-blue-600/5",
      corIcone: "text-blue-400",
      corBorda: "border-blue-500/20",
      hoverBorda: "hover:border-blue-500/40",
      href: "/acervo",
    },
    {
      titulo: "Clientes Cadastrados",
      valor: clientes.length,
      icone: Users,
      cor: "from-emerald-500/20 to-emerald-600/5",
      corIcone: "text-emerald-400",
      corBorda: "border-emerald-500/20",
      hoverBorda: "hover:border-emerald-500/40",
      href: "/clientes",
    },
    {
      titulo: "Empréstimos Ativos",
      valor: emprestimos.filter((e) => e.dataDevolucao === null).length,
      icone: ClipboardList,
      cor: "from-amber-500/20 to-amber-600/5",
      corIcone: "text-amber-400",
      corBorda: "border-amber-500/20",
      hoverBorda: "hover:border-amber-500/40",
      href: "/emprestimos",
    },
    {
      titulo: "Livros Disponíveis",
      valor: livros.filter((l) => l.disponivel).length,
      icone: TrendingUp,
      cor: "from-violet-500/20 to-violet-600/5",
      corIcone: "text-violet-400",
      corBorda: "border-violet-500/20",
      hoverBorda: "hover:border-violet-500/40",
      href: "/acervo",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral do Sistema de Gerenciamento de Biblioteca.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {estatisticas.map((item) => {
          const Icone = item.icone;
          return (
            <Link
              key={item.titulo}
              href={item.href}
              className={`group relative overflow-hidden rounded-xl border ${item.corBorda} bg-gradient-to-br ${item.cor} p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${item.hoverBorda}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.titulo}
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">
                    {item.valor}
                  </p>
                </div>
                <div
                  className={`rounded-xl bg-background/50 p-3 ${item.corIcone}`}
                >
                  <Icone className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empréstimos Recentes */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Empréstimos Recentes</h2>
        <div className="space-y-3">
          {emprestimos.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Nenhum empréstimo registrado.
            </p>
          ) : (
            emprestimos.map((emprestimo) => (
              <div
                key={emprestimo.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{emprestimo.livro.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {emprestimo.cliente.nome}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(emprestimo.dataEmprestimo).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      emprestimo.dataDevolucao
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {emprestimo.dataDevolucao ? "Devolvido" : "Em andamento"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
