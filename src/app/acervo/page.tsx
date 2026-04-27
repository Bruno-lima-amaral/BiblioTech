"use client";

import { useState } from "react";
import { BookOpen, Search, Plus, Pencil, Trash2, FileSpreadsheet } from "lucide-react";
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
import { useBiblioteca } from "@/lib/biblioteca-contexto";
import { exportarAcervo } from "@/lib/exportar-excel";

const GENEROS_DISPONIVEIS = ["Romance", "Aventura", "Ficção", "Terror", "Poesia", "Drama", "Biografia", "Infantil"];

export default function PaginaAcervo() {
  const { livros, adicionarLivro, editarLivro, deletarLivro } = useBiblioteca();
  const [busca, setBusca] = useState("");

  // Modal de Criar
  const [modalCriar, setModalCriar] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoAutor, setNovoAutor] = useState("");
  const [novoAno, setNovoAno] = useState("");
  const [novoGenero, setNovoGenero] = useState("");
  const [novoIsbn, setNovoIsbn] = useState("");

  // Modal de Editar
  const [modalEditar, setModalEditar] = useState(false);
  const [livroEditando, setLivroEditando] = useState<{ id: number; disponivel: boolean } | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editAutor, setEditAutor] = useState("");
  const [editAno, setEditAno] = useState("");
  const [editGenero, setEditGenero] = useState("");
  const [editIsbn, setEditIsbn] = useState("");

  const livrosFiltrados = livros.filter((livro) => {
    const termo = busca.toLowerCase();
    return (
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo) ||
      livro.genero.toLowerCase().includes(termo) ||
      livro.isbn.toLowerCase().includes(termo)
    );
  });

  // ─── Cadastrar novo livro (mock local) ──────────────────────────
  function salvarLivro() {
    if (!novoTitulo.trim() || !novoAutor.trim() || !novoAno.trim() || !novoGenero || !novoIsbn.trim()) return;
    adicionarLivro({
      titulo: novoTitulo.trim(),
      autor: novoAutor.trim(),
      ano: parseInt(novoAno),
      genero: novoGenero,
      isbn: novoIsbn.trim(),
    });
    setNovoTitulo("");
    setNovoAutor("");
    setNovoAno("");
    setNovoGenero("");
    setNovoIsbn("");
    setModalCriar(false);
  }

  // ─── Remover livro (mock local) ─────────────────────────────────
  function removerLivro(id: number) {
    deletarLivro(id);
  }

  // ─── Editar livro (mock local) ──────────────────────────────────
  function abrirEdicao(livro: typeof livros[0]) {
    setLivroEditando({ id: livro.id, disponivel: livro.disponivel });
    setEditTitulo(livro.titulo);
    setEditAutor(livro.autor);
    setEditAno(livro.ano.toString());
    setEditGenero(livro.genero);
    setEditIsbn(livro.isbn);
    setModalEditar(true);
  }

  function salvarEdicao() {
    if (!livroEditando || !editTitulo.trim() || !editAutor.trim() || !editAno.trim() || !editGenero || !editIsbn.trim()) return;
    editarLivro(livroEditando.id, {
      titulo: editTitulo.trim(),
      autor: editAutor.trim(),
      ano: parseInt(editAno),
      genero: editGenero,
      isbn: editIsbn.trim(),
      disponivel: livroEditando.disponivel,
    });
    setModalEditar(false);
    setLivroEditando(null);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Busca */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar livro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Botão Exportar Excel */}
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
            onClick={() => exportarAcervo(livros)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>

          {/* Botão Novo Livro */}
          <Dialog open={modalCriar} onOpenChange={setModalCriar}>
            <DialogTrigger
              render={
                <Button className="gap-2 w-full sm:w-auto">
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
                <div className="grid gap-2">
                  <Label htmlFor="genero">Gênero</Label>
                  <select
                    id="genero"
                    value={novoGenero}
                    onChange={(e) => setNovoGenero(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
                  >
                    <option value="" className="bg-popover text-popover-foreground">Selecione um gênero...</option>
                    {GENEROS_DISPONIVEIS.map((g) => (
                      <option key={g} value={g} className="bg-popover text-popover-foreground">{g}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="Ex: 978-85-7232-001-5" value={novoIsbn} onChange={(e) => setNovoIsbn(e.target.value)} />
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Autor</TableHead>
              <TableHead className="w-28 text-center font-semibold">Gênero</TableHead>
              <TableHead className="w-44 text-center font-semibold">ISBN</TableHead>
              <TableHead className="w-24 text-center font-semibold">Ano</TableHead>
              <TableHead className="w-36 text-center font-semibold">Status</TableHead>
              <TableHead className="w-28 text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livrosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
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
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">
                      {livro.genero}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {livro.isbn}
                  </TableCell>
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
                        onClick={() => removerLivro(livro.id)}
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
            <div className="grid gap-2">
              <Label htmlFor="edit-genero">Gênero</Label>
              <select
                id="edit-genero"
                value={editGenero}
                onChange={(e) => setEditGenero(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:bg-input/30"
              >
                <option value="" className="bg-popover text-popover-foreground">Selecione um gênero...</option>
                {GENEROS_DISPONIVEIS.map((g) => (
                  <option key={g} value={g} className="bg-popover text-popover-foreground">{g}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input id="edit-isbn" value={editIsbn} onChange={(e) => setEditIsbn(e.target.value)} />
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
