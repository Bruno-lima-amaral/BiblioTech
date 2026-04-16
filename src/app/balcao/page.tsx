"use client";

import { useState, useCallback } from "react";
import {
  Landmark,
  RefreshCw,
  Undo2,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Clock,
  BookOpen,
} from "lucide-react";
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

// ─── Tipos locais ──────────────────────────────────────────────────

interface Toast {
  id: number;
  tipo: "sucesso" | "erro";
  mensagem: string;
}

// ─── Componente Toast ──────────────────────────────────────────────

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-sm
            animate-in slide-in-from-right-5 fade-in-0 duration-300
            ${
              toast.tipo === "sucesso"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }
          `}
        >
          {toast.tipo === "sucesso" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium flex-1 leading-snug">
            {toast.mensagem}
          </p>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────

export default function PaginaBalcao() {
  const { emprestimos, devolverEmprestimo } = useBiblioteca();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busca, setBusca] = useState("");

  // Modal Beneficiador
  const [modalBeneficiador, setModalBeneficiador] = useState(false);
  const [benefNome, setBenefNome] = useState("");
  const [benefCnpj, setBenefCnpj] = useState("");
  const [benefTelefone, setBenefTelefone] = useState("");

  // Filtra apenas empréstimos ativos (sem devolução)
  const emprestimosAtivos = emprestimos.filter((e) => !e.dataDevolucao);

  // ─── Toast helpers ───────────────────────────────────────────────

  const adicionarToast = useCallback(
    (tipo: Toast["tipo"], mensagem: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, tipo, mensagem }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removerToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Ações do Balcão (mock local) ────────────────────────────────

  function handleDevolver(empId: number, nomeCliente: string, tituloLivro: string) {
    devolverEmprestimo(empId);
    adicionarToast(
      "sucesso",
      `Livro "${tituloLivro}" devolvido com sucesso por ${nomeCliente}.`
    );
  }

  // ─── Salvar Beneficiador (mock local) ────────────────────────────

  function salvarBeneficiador() {
    if (!benefNome.trim() || !benefCnpj.trim() || !benefTelefone.trim()) return;
    console.log("[MOCK] Beneficiador cadastrado:", {
      nome: benefNome.trim(),
      cnpj: benefCnpj.trim(),
      telefone: benefTelefone.trim(),
    });
    adicionarToast("sucesso", `Beneficiador "${benefNome}" cadastrado com sucesso!`);
    setBenefNome("");
    setBenefCnpj("");
    setBenefTelefone("");
    setModalBeneficiador(false);
  }

  // ─── Helpers de visualização ─────────────────────────────────────

  function estaAtrasado(dataPrevista: string) {
    return new Date(dataPrevista) < new Date();
  }

  const emprestimosFiltrados = emprestimosAtivos.filter((e) => {
    const termo = busca.toLowerCase();
    return (
      e.cliente.nome.toLowerCase().includes(termo) ||
      e.livro.titulo.toLowerCase().includes(termo) ||
      e.id.toString().includes(termo)
    );
  });

  const totalAtrasados = emprestimosAtivos.filter((e) =>
    estaAtrasado(e.dataPrevistaDevolucao)
  ).length;

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Toast overlay */}
      <ToastContainer toasts={toasts} onRemove={removerToast} />

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Balcão de Atendimento
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie devoluções e cadastre beneficiadores.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Busca */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar empréstimo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Botão Beneficiador */}
          <Dialog
            open={modalBeneficiador}
            onOpenChange={setModalBeneficiador}
          >
            <DialogTrigger
              render={
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <UserPlus className="h-4 w-4" />
                  Novo Beneficiador
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Beneficiador</DialogTitle>
                <DialogDescription>
                  Preencha os dados para cadastrar um novo beneficiador no
                  sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="benef-nome">Nome</Label>
                  <Input
                    id="benef-nome"
                    placeholder="Ex: Fundação Educar"
                    value={benefNome}
                    onChange={(e) => setBenefNome(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="benef-cnpj">CNPJ</Label>
                  <Input
                    id="benef-cnpj"
                    placeholder="00.000.000/0000-00"
                    value={benefCnpj}
                    onChange={(e) => setBenefCnpj(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="benef-telefone">Telefone</Label>
                  <Input
                    id="benef-telefone"
                    placeholder="(11) 99999-9999"
                    value={benefTelefone}
                    onChange={(e) => setBenefTelefone(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={salvarBeneficiador}
                  disabled={
                    !benefNome.trim() ||
                    !benefCnpj.trim() ||
                    !benefTelefone.trim()
                  }
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Salvar Beneficiador
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
          <span className="text-sm text-muted-foreground">Ativos: </span>
          <span className="font-semibold">
            {emprestimosAtivos.length} empréstimos
          </span>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">Em atraso: </span>
          <span className="font-semibold text-red-400">{totalAtrasados}</span>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Filtrados:{" "}
          </span>
          <span className="font-semibold text-blue-400">
            {emprestimosFiltrados.length}
          </span>
        </div>
      </div>

      {/* Tabela de Empréstimos Ativos */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-16 text-center font-semibold">
                ID
              </TableHead>
              <TableHead className="font-semibold">Livro</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="w-40 text-center font-semibold">
                Devolução Prevista
              </TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emprestimosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum empréstimo ativo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              emprestimosFiltrados.map((emp) => {
                const atrasado = estaAtrasado(emp.dataPrevistaDevolucao);

                return (
                  <TableRow
                    key={emp.id}
                    className="border-border transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="text-center font-mono text-muted-foreground">
                      #{emp.id.toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{emp.livro.titulo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp.cliente.nome}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock
                          className={`h-3.5 w-3.5 ${
                            atrasado
                              ? "text-red-400"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={
                            atrasado
                              ? "font-medium text-red-400"
                              : "text-muted-foreground"
                          }
                        >
                          {new Date(
                            emp.dataPrevistaDevolucao
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {atrasado ? (
                        <Badge className="bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/20">
                          Em atraso
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20">
                          No prazo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDevolver(emp.id, emp.cliente.nome, emp.livro.titulo)
                        }
                        className="gap-1.5 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                        Devolver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
