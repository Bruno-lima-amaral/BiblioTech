"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import type { Cliente } from "@/lib/dados-mockados";

const API_URL = "projetogestaobibliotecabackend-production.up.railway.app/api/clientes";

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");

  // Modal de Criar
  const [modalCriar, setModalCriar] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  // Modal de Editar
  const [modalEditar, setModalEditar] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // ─── GET — Carregar clientes ao montar ───────────────────────────
  useEffect(() => {
    async function carregarClientes() {
      try {
        const res = await fetch(API_URL);
        const dados: Cliente[] = await res.json();
        setClientes(dados);
      } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
      }
    }
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = busca.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo)
    );
  });

  // ─── POST — Cadastrar novo cliente ───────────────────────────────
  async function salvarCliente() {
    if (!novoNome.trim() || !novoEmail.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoNome.trim(),
          email: novoEmail.trim(),
        }),
      });
      if (res.ok) {
        const clienteCriado: Cliente = await res.json();
        setClientes((prev) => [...prev, clienteCriado]);
        setNovoNome("");
        setNovoEmail("");
        setModalCriar(false);
      }
    } catch (erro) {
      console.error("Erro ao cadastrar cliente:", erro);
    }
  }

  // ─── DELETE — Remover cliente ────────────────────────────────────
  async function deletarCliente(id: number) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClientes((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (erro) {
      console.error("Erro ao deletar cliente:", erro);
    }
  }

  // ─── PUT — Editar cliente ────────────────────────────────────────
  function abrirEdicao(cliente: Cliente) {
    setClienteEditando(cliente);
    setEditNome(cliente.nome);
    setEditEmail(cliente.email);
    setModalEditar(true);
  }

  async function salvarEdicao() {
    if (!clienteEditando || !editNome.trim() || !editEmail.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${clienteEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editNome.trim(),
          email: editEmail.trim(),
        }),
      });
      if (res.ok) {
        const clienteAtualizado: Cliente = await res.json();
        setClientes((prev) =>
          prev.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
        );
        setModalEditar(false);
        setClienteEditando(null);
      }
    } catch (erro) {
      console.error("Erro ao editar cliente:", erro);
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-64 rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Botão Novo Cliente */}
          <Dialog open={modalCriar} onOpenChange={setModalCriar}>
            <DialogTrigger
              render={
                <Button className="gap-2">
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
      <div className="flex gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Total de clientes: </span>
          <span className="font-semibold">{clientes.length}</span>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">E-mail</TableHead>
              <TableHead className="w-28 text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
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
                        onClick={() => deletarCliente(cliente.id)}
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
