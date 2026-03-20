"use client";

import { useState } from "react";
import { LifeBuoy, Plus } from "lucide-react";
import { useBiblioteca } from "@/lib/biblioteca-contexto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Ticket } from "@/lib/dados-mockados";

export default function PaginaTickets() {
  const { tickets, criarTicket } = useBiblioteca();

  // Estados do Modal
  const [modalCriar, setModalCriar] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<Ticket["categoria"]>("DUVIDA");
  const [novaPrioridade, setNovaPrioridade] = useState<Ticket["prioridade"]>("MEDIA");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Status Badges Config
  const statusConfig = {
    ABERTO: { label: "Aberto", className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/25" },
    EM_ANALISE: { label: "Em Análise", className: "bg-blue-500/15 text-blue-500 border-blue-500/20 hover:bg-blue-500/25" },
    CONCLUIDO: { label: "Concluído", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25" },
  };

  // Priority Badges Config
  const prioridadeConfig = {
    BAIXA: { label: "Baixa", className: "bg-slate-500/15 text-slate-400 border-slate-500/20 hover:bg-slate-500/25" },
    MEDIA: { label: "Média", className: "bg-orange-500/15 text-orange-400 border-orange-500/20 hover:bg-orange-500/25" },
    ALTA: { label: "Alta", className: "bg-red-500/15 text-red-500 border-red-500/20 hover:bg-red-500/25" },
  };

  async function handleSubmit() {
    if (!novoTitulo.trim() || !novaDescricao.trim()) return;

    setSalvando(true);
    await criarTicket({
      titulo: novoTitulo.trim(),
      categoria: novaCategoria,
      prioridade: novaPrioridade,
      descricao: novaDescricao.trim(),
    });

    // Reset Modal
    setNovoTitulo("");
    setNovaCategoria("DUVIDA");
    setNovaPrioridade("MEDIA");
    setNovaDescricao("");
    setSalvando(false);
    setModalCriar(false);
  }

  // Formatador de Data (Ex: 2026-03-20T... -> 20/03/2026)
  function formatarData(dataIso: string) {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Suporte (Tickets)</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe relatos de bugs, dúvidas ou sugestões de melhoria.
            </p>
          </div>
        </div>

        <Dialog open={modalCriar} onOpenChange={setModalCriar}>
          <DialogTrigger render={<Button className="gap-2 w-full sm:w-auto" />}>
            <Plus className="h-4 w-4" />
            Novo Chamado
          </DialogTrigger>
          <DialogContent className="w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Abrir Novo Chamado</DialogTitle>
              <DialogDescription>
                Descreva claramente sua dúvida ou problema encontrado.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Resumo do problema"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select value={novaCategoria} onValueChange={(value: any) => setNovaCategoria(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUG">Bug / Erro</SelectItem>
                      <SelectItem value="SUGESTAO">Sugestão</SelectItem>
                      <SelectItem value="DUVIDA">Dúvida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Prioridade</Label>
                  <Select value={novaPrioridade} onValueChange={(value: any) => setNovaPrioridade(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAIXA">Baixa</SelectItem>
                      <SelectItem value="MEDIA">Média</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Explique os detalhes do chamado..."
                  className="min-h-[100px]"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit} disabled={salvando || !novoTitulo.trim() || !novaDescricao.trim()} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {salvando ? "Salvando..." : "Criar Chamado"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Total de Tickets: </span>
          <span className="font-semibold">{tickets.length}</span>
        </div>
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Em Aberto: </span>
          <span className="font-semibold text-yellow-500">
            {tickets.filter((t) => t.status === "ABERTO").length}
          </span>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Concluídos: </span>
          <span className="font-semibold text-emerald-400">
            {tickets.filter((t) => t.status === "CONCLUIDO").length}
          </span>
        </div>
      </div>

      {/* Tabela de Tickets */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="w-32 text-center font-semibold">Categoria</TableHead>
              <TableHead className="w-28 text-center font-semibold">Prioridade</TableHead>
              <TableHead className="w-32 text-center font-semibold">Status</TableHead>
              <TableHead className="w-32 text-right font-semibold">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhum chamado registrado.
                </TableCell>
              </TableRow>
            ) : (
              [...tickets].reverse().map((ticket) => (
                <TableRow key={ticket.id} className="border-border transition-colors hover:bg-muted/30">
                  <TableCell className="text-center font-mono text-muted-foreground">
                    #{ticket.id?.toString().padStart(3, "0") || "000"}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate" title={ticket.titulo}>
                    {ticket.titulo}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">
                    {ticket.categoria === "BUG" ? "Bug / Erro" : 
                     ticket.categoria === "SUGESTAO" ? "Sugestão" : "Dúvida"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={prioridadeConfig[ticket.prioridade]?.className || ""}>
                      {prioridadeConfig[ticket.prioridade]?.label || ticket.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusConfig[ticket.status]?.className || ""}>
                      {statusConfig[ticket.status]?.label || ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                    {formatarData(ticket.dataCriacao)}
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
