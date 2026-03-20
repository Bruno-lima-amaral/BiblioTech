"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { Livro } from "@/lib/dados-mockados";

const API_URL = "https://projetogestaobibliotecabackend-production.up.railway.app/api/livros";

export default function PaginaAcervo() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState("");

  // Modal de Criar
  const [modalCriar, setModalCriar] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoAutor, setNovoAutor] = useState("");
  const [novoAno, setNovoAno] = useState("");

  // Modal de Editar
  const [modalEditar, setModalEditar] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editAutor, setEditAutor] = useState("");
  const [editAno, setEditAno] = useState("");

  // ─── GET — Carregar livros ao montar ─────────────────────────────
  useEffect(() => {
    async function carregarLivros() {
      try {
        const res = await fetch(API_URL);
        const dados: Livro[] = await res.json();
        setLivros(dados);
      } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
      }
    }
    carregarLivros();
  }, []);

  const livrosFiltrados = livros.filter((livro) => {
    const termo = busca.toLowerCase();
    return (
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo)
    );
  });

  // ─── POST — Cadastrar novo livro ─────────────────────────────────
  async function salvarLivro() {
    if (!novoTitulo.trim() || !novoAutor.trim() || !novoAno.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: novoTitulo.trim(),
          autor: novoAutor.trim(),
          ano: parseInt(novoAno),
          disponivel: true,
        }),
      });
      if (res.ok) {
        const livroCriado: Livro = await res.json();
        setLivros((prev) => [...prev, livroCriado]);
        setNovoTitulo("");
        setNovoAutor("");
        setNovoAno("");
        setModalCriar(false);
      }
    } catch (erro) {
      console.error("Erro ao cadastrar livro:", erro);
    }
  }

  // ─── DELETE — Remover livro ──────────────────────────────────────
  async function deletarLivro(id: number) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLivros((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (erro) {
      console.error("Erro ao deletar livro:", erro);
    }
  }

  // ─── PUT — Editar livro ──────────────────────────────────────────
  function abrirEdicao(livro: Livro) {
    setLivroEditando(livro);
    setEditTitulo(livro.titulo);
    setEditAutor(livro.autor);
    setEditAno(livro.ano.toString());
    setModalEditar(true);
  }

  async function salvarEdicao() {
    if (!livroEditando || !editTitulo.trim() || !editAutor.trim() || !editAno.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${livroEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: editTitulo.trim(),
          autor: editAutor.trim(),
          ano: parseInt(editAno),
          disponivel: livroEditando.disponivel,
        }),
      });
      if (res.ok) {
        const livroAtualizado: Livro = await res.json();
        setLivros((prev) =>
          prev.map((l) => (l.id === livroAtualizado.id ? livroAtualizado : l))
        );
        setModalEditar(false);
        setLivroEditando(null);
      }
    } catch (erro) {
      console.error("Erro ao editar livro:", erro);
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Acervo de Livros
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todo o catálogo de livros da biblioteca.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar livro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-64 rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Botão Novo Livro */}
          <Dialog open={modalCriar} onOpenChange={setModalCriar}>
            <DialogTrigger
              render={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Livro
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Livro</DialogTitle>
                <DialogDescription>
                  Preencha os dados do livro para adicioná-lo ao acervo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" placeholder="Ex: O Alquimista" value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="autor">Autor</Label>
                  <Input id="autor" placeholder="Ex: Paulo Coelho" value={novoAutor} onChange={(e) => setNovoAutor(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ano">Ano de Publicação</Label>
                  <Input id="ano" type="number" placeholder="Ex: 1988" value={novoAno} onChange={(e) => setNovoAno(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={salvarLivro} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Cadastrar Livro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="flex gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Total: </span>
          <span className="font-semibold">{livros.length} livros</span>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Disponíveis: </span>
          <span className="font-semibold text-emerald-400">
            {livros.filter((l) => l.disponivel).length}
          </span>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Emprestados: </span>
          <span className="font-semibold text-red-400">
            {livros.filter((l) => !l.disponivel).length}
          </span>
        </div>
      </div>

      {/* Tabela de Livros */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Autor</TableHead>
              <TableHead className="w-24 text-center font-semibold">Ano</TableHead>
              <TableHead className="w-36 text-center font-semibold">Status</TableHead>
              <TableHead className="w-28 text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livrosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhum livro encontrado para &quot;{busca}&quot;.
                </TableCell>
              </TableRow>
            ) : (
              livrosFiltrados.map((livro) => (
                <TableRow key={livro.id} className="border-border transition-colors hover:bg-muted/30">
                  <TableCell className="text-center font-mono text-muted-foreground">
                    #{livro.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{livro.titulo}</TableCell>
                  <TableCell className="text-muted-foreground">{livro.autor}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{livro.ano}</TableCell>
                  <TableCell className="text-center">
                    {livro.disponivel ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20">
                        Disponível
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/20">
                        Indisponível
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => abrirEdicao(livro)}
                        className="h-8 w-8 text-muted-foreground hover:text-blue-400"
                        title="Editar livro"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deletarLivro(livro.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
                        title="Deletar livro"
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
            <DialogTitle>Editar Livro</DialogTitle>
            <DialogDescription>
              Altere os dados do livro selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-titulo">Título</Label>
              <Input id="edit-titulo" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-autor">Autor</Label>
              <Input id="edit-autor" value={editAutor} onChange={(e) => setEditAutor(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-ano">Ano de Publicação</Label>
              <Input id="edit-ano" type="number" value={editAno} onChange={(e) => setEditAno(e.target.value)} />
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
