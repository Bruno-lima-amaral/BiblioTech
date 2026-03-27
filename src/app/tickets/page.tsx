"use client";

import { useState } from "react";
import { LifeBuoy, Plus, Search, Filter, Play, CheckCircle2, MessageSquareReply } from "lucide-react";
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
import type { Ticket } from "@/lib/dados-mockados";

export default function PaginaTickets() {
  const { tickets, criarTicket, atualizarStatusTicket, responderTicket } = useBiblioteca();

  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("TODAS");

  // Estados do Modal de Criação
  const [modalCriar, setModalCriar] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<Ticket["categoria"]>("DUVIDA");
  const [novaPrioridade, setNovaPrioridade] = useState<Ticket["prioridade"]>("MEDIA");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Estados do Modal de Resposta
  const [modalResponder, setModalResponder] = useState(false);
  const [ticketParaResponder, setTicketParaResponder] = useState<Ticket | null>(null);
  const [textoResposta, setTextoResposta] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  // Status Badges Config
  const statusConfig = {
    ABERTO: { label: "Aberto", borderColor: "border-t-yellow-500" },
    EM_ANALISE: { label: "Em Análise", borderColor: "border-t-blue-500" },
    CONCLUIDO: { label: "Concluído", borderColor: "border-t-emerald-500" },
  };

  // Priority Badges Config
  const prioridadeConfig = {
    BAIXA: { label: "Baixa", className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
    MEDIA: { label: "Média", className: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
    ALTA: { label: "Alta", className: "bg-red-500/15 text-red-500 border-red-500/20" },
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

  function abrirModalResponder(ticket: Ticket) {
    setTicketParaResponder(ticket);
    setTextoResposta("");
    setModalResponder(true);
  }

  async function handleEnviarResposta() {
    if (!ticketParaResponder || !textoResposta.trim()) return;

    setEnviandoResposta(true);
    await responderTicket(ticketParaResponder.id, textoResposta.trim());
    setTextoResposta("");
    setTicketParaResponder(null);
    setEnviandoResposta(false);
    setModalResponder(false);
  }

  // Formatador de Data
  function formatarData(dataIso: string) {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Lógica de Filtragem e Divisão por Status
  const ticketsFiltrados = tickets.filter(t => {
    const matchBusca = t.titulo.toLowerCase().includes(busca.toLowerCase()) || (t.id?.toString() || "").includes(busca);
    const matchCategoria = filtroCategoria === "TODAS" || t.categoria === filtroCategoria;
    const matchPrioridade = filtroPrioridade === "TODAS" || t.prioridade === filtroPrioridade;
    return matchBusca && matchCategoria && matchPrioridade;
  });

  const abertos = [...ticketsFiltrados].filter((t) => t.status === "ABERTO").reverse();
  const emAnalise = [...ticketsFiltrados].filter((t) => t.status === "EM_ANALISE").reverse();
  const concluidos = [...ticketsFiltrados].filter((t) => t.status === "CONCLUIDO").reverse();

  // Componente de Ticket Compacto com Ações
  const RenderizarTicket = ({ ticket }: { ticket: Ticket }) => {
    const isAberto = ticket.status === "ABERTO";
    const isEmAnalise = ticket.status === "EM_ANALISE";
    const isConcluido = ticket.status === "CONCLUIDO";
    const isBug = ticket.categoria === "BUG";
    const isDuvidaOuSugestao = ticket.categoria === "DUVIDA" || ticket.categoria === "SUGESTAO";
    const temResposta = ticket.resposta && ticket.resposta.trim() !== "";

    return (
      <div key={ticket.id} className="p-3 bg-muted/30 border border-border/60 rounded-lg shadow-sm flex flex-col gap-3 hover:bg-muted/50 hover:border-border transition-all">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-medium leading-tight">{ticket.titulo}</h3>
          <span className="text-xs font-mono text-muted-foreground font-semibold bg-background px-1.5 py-0.5 rounded-md border border-border shrink-0">
            #{ticket.id?.toString().padStart(3, "0") || "000"}
          </span>
        </div>

        {/* Exibição da Resposta */}
        {temResposta && (
          <div className="border-l-2 border-emerald-500/50 bg-emerald-500/5 rounded-r-md px-3 py-2">
            <p className="text-[11px] font-medium text-emerald-400 mb-0.5">Resposta:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{ticket.resposta}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${prioridadeConfig[ticket.prioridade]?.className || ""}`}>
              {prioridadeConfig[ticket.prioridade]?.label || ticket.prioridade}
            </Badge>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {ticket.categoria === "BUG" ? "Bug" : ticket.categoria === "SUGESTAO" ? "Sugestão" : "Dúvida"}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{formatarData(ticket.dataCriacao)}</span>
        </div>

        {/* Área de Ações */}
        {(!isConcluido || (isDuvidaOuSugestao && !temResposta)) && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            {/* Ticket ABERTO → Botão "Analisar" */}
            {isAberto && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => atualizarStatusTicket(ticket.id, "EM_ANALISE")}
              >
                <Play className="h-3 w-3" />
                Analisar
              </Button>
            )}

            {/* BUG em EM_ANALISE → Botão "Concluir" */}
            {isBug && isEmAnalise && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                onClick={() => atualizarStatusTicket(ticket.id, "CONCLUIDO")}
              >
                <CheckCircle2 className="h-3 w-3" />
                Concluir
              </Button>
            )}

            {/* DUVIDA ou SUGESTAO e NÃO concluído → Botão "Responder" */}
            {isDuvidaOuSugestao && !isConcluido && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                onClick={() => abrirModalResponder(ticket)}
              >
                <MessageSquareReply className="h-3 w-3" />
                Responder
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

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
      </div>

      {/* Barra de Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-end">
          <div className="grid gap-1.5 flex-1 sm:w-[250px]">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Search className="h-3 w-3" /> Buscar Ticket
            </Label>
            <Input
              placeholder="Título ou ID..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid gap-1.5 w-full sm:w-[150px]">
             <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
               <Filter className="h-3 w-3" /> Categoria
             </Label>
             <Select value={filtroCategoria} onValueChange={(value) => setFiltroCategoria(value || "TODAS")}>
               <SelectTrigger className="h-9">
                 <SelectValue placeholder="Todas" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="TODAS">Todas</SelectItem>
                 <SelectItem value="BUG">Bug / Erro</SelectItem>
                 <SelectItem value="SUGESTAO">Sugestão</SelectItem>
                 <SelectItem value="DUVIDA">Dúvida</SelectItem>
               </SelectContent>
             </Select>
          </div>
          <div className="grid gap-1.5 w-full sm:w-[150px]">
             <Label className="text-xs text-muted-foreground">Prioridade</Label>
             <Select value={filtroPrioridade} onValueChange={(value) => setFiltroPrioridade(value || "TODAS")}>
               <SelectTrigger className="h-9">
                 <SelectValue placeholder="Todas" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="TODAS">Todas</SelectItem>
                 <SelectItem value="BAIXA">Baixa</SelectItem>
                 <SelectItem value="MEDIA">Média</SelectItem>
                 <SelectItem value="ALTA">Alta</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>

        <Dialog open={modalCriar} onOpenChange={setModalCriar}>
          <DialogTrigger render={<Button className="gap-2 w-full sm:w-auto h-9" />}>
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

      {/* Modal de Resposta */}
      <Dialog open={modalResponder} onOpenChange={(open) => { setModalResponder(open); if (!open) setTicketParaResponder(null); }}>
        <DialogContent className="w-[90vw] sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Responder Chamado</DialogTitle>
            <DialogDescription>
              {ticketParaResponder && (
                <>
                  Respondendo ao ticket <span className="font-mono font-semibold text-foreground">#{ticketParaResponder.id?.toString().padStart(3, "0")}</span> — <span className="text-foreground">{ticketParaResponder.titulo}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resposta-texto">Sua Resposta</Label>
              <Textarea
                id="resposta-texto"
                placeholder="Digite a resposta para o chamado..."
                className="min-h-[120px]"
                value={textoResposta}
                onChange={(e) => setTextoResposta(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleEnviarResposta}
              disabled={enviandoResposta || !textoResposta.trim()}
              className="gap-2 w-full sm:w-auto"
            >
              <MessageSquareReply className="h-4 w-4" />
              {enviandoResposta ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Coluna Aberto */}
        <div className="flex flex-col rounded-xl bg-card border border-border shadow-sm overflow-hidden">
          <div className={`p-4 border-b border-border bg-muted/20 border-t-2 ${statusConfig.ABERTO.borderColor}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Aberto</h2>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold">
                {abertos.length}
              </span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-3 min-h-[50vh] bg-muted/10">
            {abertos.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6">Nenhum chamado aberto</p>
            ) : (
              abertos.map((ticket) => <RenderizarTicket key={ticket.id} ticket={ticket} />)
            )}
          </div>
        </div>

        {/* Coluna Em Análise */}
        <div className="flex flex-col rounded-xl bg-card border border-border shadow-sm overflow-hidden">
          <div className={`p-4 border-b border-border bg-muted/20 border-t-2 ${statusConfig.EM_ANALISE.borderColor}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Em Análise</h2>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                {emAnalise.length}
              </span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-3 min-h-[50vh] bg-muted/10">
            {emAnalise.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6">Nenhum chamado em análise</p>
            ) : (
              emAnalise.map((ticket) => <RenderizarTicket key={ticket.id} ticket={ticket} />)
            )}
          </div>
        </div>

        {/* Coluna Concluído */}
        <div className="flex flex-col rounded-xl bg-card border border-border shadow-sm overflow-hidden">
          <div className={`p-4 border-b border-border bg-muted/20 border-t-2 ${statusConfig.CONCLUIDO.borderColor}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Concluído</h2>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {concluidos.length}
              </span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-3 min-h-[50vh] bg-muted/10">
            {concluidos.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6">Nenhum chamado concluído</p>
            ) : (
              concluidos.map((ticket) => <RenderizarTicket key={ticket.id} ticket={ticket} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
