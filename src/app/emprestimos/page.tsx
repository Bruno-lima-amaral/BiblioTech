"use client";

import { useState } from "react";
import { ClipboardList, BookOpen, Plus, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBiblioteca } from "@/lib/biblioteca-contexto";

const API_URL = "https://projetogestaobibliotecabackend-production.up.railway.app/api/emprestimos";

export default function PaginaEmprestimos() {
  const { livros, clientes, emprestimos, criarEmprestimo, devolverEmprestimo } =
    useBiblioteca();
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [livroSelecionado, setLivroSelecionado] = useState("");

  const livrosDisponiveis = livros.filter((l) => l.disponivel);

  function salvarEmprestimo() {
    const livroId = parseInt(livroSelecionado);
    const clienteId = parseInt(clienteSelecionado);
    if (!livroId || !clienteId) return;

    criarEmprestimo(livroId, clienteId);
    setClienteSelecionado("");
    setLivroSelecionado("");
    setModalAberto(false);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Empréstimos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe os empréstimos de livros da biblioteca.
            </p>
          </div>
        </div>

        {/* Botão Novo Empréstimo */}
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger
            render={
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Novo Empréstimo
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Novo Empréstimo</DialogTitle>
              <DialogDescription>
                Selecione o cliente e o livro disponível para o empréstimo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Select de Cliente */}
              <div className="grid gap-2">
                <Label htmlFor="cliente">Cliente</Label>
                <select
                  id="cliente"
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
                >
                  <option value="" className="bg-popover text-popover-foreground">
                    Selecione um cliente...
                  </option>
                  {clientes.map((cliente) => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select de Livro (apenas disponíveis) */}
              <div className="grid gap-2">
                <Label htmlFor="livro">
                  Livro{" "}
                  <span className="text-muted-foreground font-normal">
                    (apenas disponíveis)
                  </span>
                </Label>
                <select
                  id="livro"
                  value={livroSelecionado}
                  onChange={(e) => setLivroSelecionado(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
                >
                  <option value="" className="bg-popover text-popover-foreground">
                    Selecione um livro...
                  </option>
                  {livrosDisponiveis.map((livro) => (
                    <option
                      key={livro.id}
                      value={livro.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {livro.titulo} — {livro.autor}
                    </option>
                  ))}
                </select>
                {livrosDisponiveis.length === 0 && (
                  <p className="text-xs text-red-400">
                    Nenhum livro disponível no momento.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={salvarEmprestimo}
                disabled={!clienteSelecionado || !livroSelecionado}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Registrar Empréstimo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Total: </span>
          <span className="font-semibold">
            {emprestimos.length} empréstimos
          </span>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Em andamento:{" "}
          </span>
          <span className="font-semibold text-amber-400">
            {emprestimos.filter((e) => !e.dataDevolucao).length}
          </span>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Devolvidos: </span>
          <span className="font-semibold text-emerald-400">
            {emprestimos.filter((e) => e.dataDevolucao).length}
          </span>
        </div>
      </div>

      {/* Tabela de Empréstimos */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">
                ID
              </TableHead>
              <TableHead className="font-semibold">Livro</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Data de Empréstimo
              </TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Data de Devolução
              </TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum empréstimo registrado.
                </TableCell>
              </TableRow>
            ) : (
              emprestimos.map((emprestimo) => (
                <TableRow
                  key={emprestimo.id}
                  className="border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="text-center font-mono text-muted-foreground">
                    #{emprestimo.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {emprestimo.livro.titulo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {emprestimo.cliente.nome}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {new Date(emprestimo.dataEmprestimo).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {emprestimo.dataDevolucao ? (
                      <span className="text-emerald-400">
                        {new Date(emprestimo.dataDevolucao).toLocaleDateString("pt-BR")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/70 text-sm">
                        Prevista: {new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {emprestimo.dataDevolucao ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20">
                        Devolvido
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border-amber-500/20">
                        Em andamento
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {!emprestimo.dataDevolucao && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => devolverEmprestimo(emprestimo.id)}
                        className="gap-1.5 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                        Devolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
