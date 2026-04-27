"use client";

import { useState } from "react";
import { Users, Mail, Search, Plus, Pencil, Trash2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { calcularIdade } from "@/lib/dados-mockados";
import type { Cliente } from "@/lib/dados-mockados";
import { exportarClientes } from "@/lib/exportar-excel";

export default function PaginaClientes() {
  const { clientes, adicionarCliente, editarCliente, deletarCliente } = useBiblioteca();
  const [busca, setBusca] = useState("");

  // Modal de Criar
  const [modalCriar, setModalCriar] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCpf, setNovoCpf] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoNascimento, setNovoNascimento] = useState("");
  const [novoSexo, setNovoSexo] = useState<"M" | "F">("M");

  // Modal de Editar
  const [modalEditar, setModalEditar] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCpf, setEditCpf] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editNascimento, setEditNascimento] = useState("");
  const [editSexo, setEditSexo] = useState<"M" | "F">("M");

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = busca.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo)
    );
  });

  // ─── Cadastrar novo cliente (mock local) ────────────────────────
  function salvarCliente() {
    if (!novoNome.trim() || !novoEmail.trim() || !novoCpf.trim() || !novoTelefone.trim() || !novoNascimento) return;
    adicionarCliente({
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      cpf: novoCpf.trim(),
      telefone: novoTelefone.trim(),
      data_nascimento: novoNascimento,
      sexo: novoSexo,
    });
    setNovoNome("");
    setNovoEmail("");
    setNovoCpf("");
    setNovoTelefone("");
    setNovoNascimento("");
    setNovoSexo("M");
    setModalCriar(false);
  }

  // ─── Remover cliente (mock local) ───────────────────────────────
  function removerCliente(id: number) {
    deletarCliente(id);
  }

  // ─── Editar cliente (mock local) ────────────────────────────────
  function abrirEdicao(cliente: Cliente) {
    setClienteEditando(cliente);
    setEditNome(cliente.nome);
    setEditEmail(cliente.email);
    setEditCpf(cliente.cpf || "");
    setEditTelefone(cliente.telefone || "");
    setEditNascimento(cliente.data_nascimento || "");
    setEditSexo(cliente.sexo || "M");
    setModalEditar(true);
  }

  function salvarEdicao() {
    if (!clienteEditando || !editNome.trim() || !editEmail.trim() || !editCpf.trim() || !editTelefone.trim() || !editNascimento) return;
    editarCliente(clienteEditando.id, {
      nome: editNome.trim(),
      email: editEmail.trim(),
      cpf: editCpf.trim(),
      telefone: editTelefone.trim(),
      data_nascimento: editNascimento,
      sexo: editSexo,
    });
    setModalEditar(false);
    setClienteEditando(null);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os clientes cadastrados na biblioteca.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Busca */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Botão Exportar Excel */}
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
            onClick={() => exportarClientes(clientes)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>

          {/* Botão Novo Cliente */}
          <Dialog open={modalCriar} onOpenChange={setModalCriar}>
            <DialogTrigger
              render={
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Novo Cliente
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente para cadastrá-lo no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" placeholder="Ex: Maria da Silva" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="Ex: maria@email.com" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(11) 90000-0000" value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input id="nascimento" type="date" value={novoNascimento} onChange={(e) => setNovoNascimento(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <select
                    id="sexo"
                    value={novoSexo}
                    onChange={(e) => setNovoSexo(e.target.value as "M" | "F")}
                    className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
                  >
                    <option value="M" className="bg-popover text-popover-foreground">Masculino</option>
                    <option value="F" className="bg-popover text-popover-foreground">Feminino</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={salvarCliente} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Cadastrar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Total de clientes: </span>
          <span className="font-semibold">{clientes.length}</span>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">E-mail</TableHead>
              <TableHead className="font-semibold">CPF</TableHead>
              <TableHead className="font-semibold">Telefone</TableHead>
              <TableHead className="w-20 text-center font-semibold">Idade</TableHead>
              <TableHead className="w-20 text-center font-semibold">Sexo</TableHead>
              <TableHead className="w-28 text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  Nenhum cliente encontrado para &quot;{busca}&quot;.
                </TableCell>
              </TableRow>
            ) : (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id} className="border-border transition-colors hover:bg-muted/30">
                  <TableCell className="text-center font-mono text-muted-foreground">
                    #{cliente.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {cliente.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{cliente.cpf}</TableCell>
                  <TableCell className="text-muted-foreground">{cliente.telefone}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                      {calcularIdade(cliente.data_nascimento)} anos
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                      cliente.sexo === "F"
                        ? "bg-pink-500/10 border-pink-500/20 text-pink-400"
                        : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                    }`}>
                      {cliente.sexo === "F" ? "Feminino" : "Masculino"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => abrirEdicao(cliente)}
                        className="h-8 w-8 text-muted-foreground hover:text-blue-400"
                        title="Editar cliente"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removerCliente(cliente.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
                        title="Deletar cliente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Altere os dados do cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome completo</Label>
              <Input id="edit-nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cpf">CPF</Label>
              <Input id="edit-cpf" value={editCpf} onChange={(e) => setEditCpf(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input id="edit-telefone" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-nascimento">Data de Nascimento</Label>
              <Input id="edit-nascimento" type="date" value={editNascimento} onChange={(e) => setEditNascimento(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sexo">Sexo</Label>
              <select
                id="edit-sexo"
                value={editSexo}
                onChange={(e) => setEditSexo(e.target.value as "M" | "F")}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
              >
                <option value="M" className="bg-popover text-popover-foreground">Masculino</option>
                <option value="F" className="bg-popover text-popover-foreground">Feminino</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={salvarEdicao} className="gap-2">
              <Pencil className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
