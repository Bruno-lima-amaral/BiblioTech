"use client";

import { useState, useCallback, useEffect } from "react";
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
import {
  listarEmprestimos,
  renovarEmprestimo as apiRenovar,
  devolverEmprestimo as apiDevolver,
  cadastrarBeneficiador,
} from "@/services/api";

// ─── Tipos locais ──────────────────────────────────────────────────

interface EmprestimoBalcao {
  id: number;
  nomeCliente: string;
  tituloLivro: string;
  dataPrevistaDevolucao: string;
  renovacoesRealizadas: number;
}

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
  const [emprestimos, setEmprestimos] = useState<EmprestimoBalcao[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState<Record<string, boolean>>({});
  const [carregandoDados, setCarregandoDados] = useState(true);

  // Modal Beneficiador
  const [modalBeneficiador, setModalBeneficiador] = useState(false);
  const [benefNome, setBenefNome] = useState("");
  const [benefCnpj, setBenefCnpj] = useState("");
  const [benefTelefone, setBenefTelefone] = useState("");
  const [salvandoBenef, setSalvandoBenef] = useState(false);

  // Buscar dados reais da API
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarEmprestimos();
        const ativos = dados.filter((e: any) => e.status === "ATIVO");
        const mapDados: EmprestimoBalcao[] = ativos.map((e: any) => ({
          id: e.id,
          nomeCliente: e.cliente?.nome || "Desconhecido",
          tituloLivro: e.livro?.titulo || "Desconhecido",
          dataPrevistaDevolucao: e.dataPrevistaDevolucao,
          renovacoesRealizadas: e.renovacoesRealizadas || 0,
        }));
        setEmprestimos(mapDados);
      } catch (err) {
        console.error("Erro ao carregar empréstimos", err);
      } finally {
        setCarregandoDados(false);
      }
    }
    carregar();
  }, []);

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

  // ─── Ações do Balcão ────────────────────────────────────────────

  async function handleRenovar(emp: EmprestimoBalcao) {
    const key = `renovar-${emp.id}`;
    setCarregando((prev) => ({ ...prev, [key]: true }));
    try {
      await apiRenovar(emp.id);
      // Atualiza localmente: incrementa renovações e estende prazo em 7 dias
      setEmprestimos((prev) =>
        prev.map((e) => {
          if (e.id !== emp.id) return e;
          const novaData = new Date(e.dataPrevistaDevolucao);
          novaData.setDate(novaData.getDate() + 7);
          return {
            ...e,
            renovacoesRealizadas: e.renovacoesRealizadas + 1,
            dataPrevistaDevolucao: novaData.toISOString().split("T")[0],
          };
        })
      );
      adicionarToast(
        "sucesso",
        `Empréstimo #${emp.id} renovado com sucesso! Nova devolução prevista estendida.`
      );
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error ? err.message : "Erro desconhecido ao renovar.";
      adicionarToast("erro", mensagem);
    } finally {
      setCarregando((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function handleDevolver(emp: EmprestimoBalcao) {
    const key = `devolver-${emp.id}`;
    setCarregando((prev) => ({ ...prev, [key]: true }));
    try {
      await apiDevolver(emp.id);
      // Remove da lista de ativos
      setEmprestimos((prev) => prev.filter((e) => e.id !== emp.id));
      adicionarToast(
        "sucesso",
        `Livro "${emp.tituloLivro}" devolvido com sucesso por ${emp.nomeCliente}.`
      );
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error ? err.message : "Erro desconhecido ao devolver.";
      adicionarToast("erro", mensagem);
    } finally {
      setCarregando((prev) => ({ ...prev, [key]: false }));
    }
  }

  // ─── Salvar Beneficiador ─────────────────────────────────────────

  async function salvarBeneficiador() {
    if (!benefNome.trim() || !benefCnpj.trim() || !benefTelefone.trim()) return;
    setSalvandoBenef(true);
    try {
      await cadastrarBeneficiador({
        nome: benefNome.trim(),
        cnpj: benefCnpj.trim(),
        telefone: benefTelefone.trim(),
      });
      adicionarToast("sucesso", `Beneficiador "${benefNome}" cadastrado com sucesso!`);
      setBenefNome("");
      setBenefCnpj("");
      setBenefTelefone("");
      setModalBeneficiador(false);
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao cadastrar beneficiador.";
      adicionarToast("erro", mensagem);
    } finally {
      setSalvandoBenef(false);
    }
  }

  // ─── Helpers de visualização ─────────────────────────────────────

  function estaAtrasado(dataPrevista: string) {
    return new Date(dataPrevista) < new Date();
  }

  const emprestimosFiltrados = emprestimos.filter((e) => {
    const termo = busca.toLowerCase();
    return (
      e.nomeCliente.toLowerCase().includes(termo) ||
      e.tituloLivro.toLowerCase().includes(termo) ||
      e.id.toString().includes(termo)
    );
  });

  const totalAtrasados = emprestimos.filter((e) =>
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
              Gerencie renovações, devoluções e cadastre beneficiadores.
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
                    !benefTelefone.trim() ||
                    salvandoBenef
                  }
                  className="gap-2"
                >
                  {salvandoBenef ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {salvandoBenef ? "Salvando..." : "Salvar Beneficiador"}
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
            {emprestimos.length} empréstimos
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
              <TableHead className="w-32 text-center font-semibold">
                Renovações
              </TableHead>
              <TableHead className="w-36 text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-56 text-center font-semibold">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregandoDados ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    <span>Carregando empréstimos ativos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : emprestimosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum empréstimo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              emprestimosFiltrados.map((emp) => {
                const atrasado = estaAtrasado(emp.dataPrevistaDevolucao);
                const keyRenovar = `renovar-${emp.id}`;
                const keyDevolver = `devolver-${emp.id}`;

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
                        <span className="font-medium">{emp.tituloLivro}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp.nomeCliente}
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
                      <span className="inline-flex items-center gap-1 font-mono text-sm">
                        {emp.renovacoesRealizadas}
                        <span className="text-muted-foreground/60">/3</span>
                      </span>
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
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenovar(emp)}
                          disabled={!!carregando[keyRenovar]}
                          className="gap-1.5 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          {carregando[keyRenovar] ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5" />
                          )}
                          Renovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDevolver(emp)}
                          disabled={!!carregando[keyDevolver]}
                          className="gap-1.5 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                        >
                          {carregando[keyDevolver] ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Undo2 className="h-3.5 w-3.5" />
                          )}
                          Devolver
                        </Button>
                      </div>
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
