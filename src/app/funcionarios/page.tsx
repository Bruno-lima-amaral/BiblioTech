"use client";

import { useState, useEffect } from "react";
import {
  UserCog,
  Plus,
  Search,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth-contexto";
import { funcionariosAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Tipos ─────────────────────────────────────────────────────────

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  username: string;
  perfil: "ADMIN" | "SUPORTE" | "ATENDENTE" | null;
  ativo: boolean;
}

const perfilConfig = {
  ADMIN: { label: "Admin", className: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  SUPORTE: { label: "Suporte", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  ATENDENTE: { label: "Atendente", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

// ─── Formulário vazio ───────────────────────────────────────────────

const formVazio = {
  nome: "",
  email: "",
  cpf: "",
  username: "",
  senha: "",
  perfil: "ATENDENTE" as Funcionario["perfil"],
  ativo: true,
};

// ─── Página ─────────────────────────────────────────────────────────

export default function PaginaFuncionarios() {
  const { podeGerenciarFuncionarios } = useAuth();

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // Modal de criação/edição
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [form, setForm] = useState(formVazio);
  const [salvando, setSalvando] = useState(false);

  // Modal de exclusão
  const [modalExcluir, setModalExcluir] = useState(false);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<Funcionario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  // ─── Carregar funcionários ──────────────────────────────────────

  async function carregarFuncionarios() {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await funcionariosAPI.listar();
      setFuncionarios(dados as Funcionario[]);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar funcionários.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // ─── Filtro ──────────────────────────────────────────────────────

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const q = busca.toLowerCase();
    return (
      f.nome.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.username.toLowerCase().includes(q)
    );
  });

  // ─── Abrir modal de criação ───────────────────────────────────────

  function abrirCriar() {
    setEditando(null);
    setForm(formVazio);
    setModalAberto(true);
  }

  // ─── Abrir modal de edição ────────────────────────────────────────

  function abrirEditar(f: Funcionario) {
    setEditando(f);
    setForm({
      nome: f.nome,
      email: f.email,
      cpf: f.cpf,
      username: f.username,
      senha: "",
      perfil: f.perfil,
      ativo: f.ativo,
    });
    setModalAberto(true);
  }

  // ─── Salvar (criar ou editar) ─────────────────────────────────────

  async function handleSalvar() {
    if (!form.nome.trim() || !form.email.trim() || !form.cpf.trim() || !form.username.trim()) return;

    setSalvando(true);
    try {
      const dados: Record<string, unknown> = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: form.cpf.trim(),
        username: form.username.trim(),
        perfil: form.perfil,
        ativo: form.ativo,
      };
      if (form.senha.trim()) dados.senha = form.senha.trim();

      if (editando) {
        await funcionariosAPI.editar(editando.id, dados);
      } else {
        if (!form.senha.trim()) {
          alert("Defina uma senha para o novo funcionário.");
          return;
        }
        await funcionariosAPI.criar(dados);
      }

      await carregarFuncionarios();
      setModalAberto(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar funcionário.");
    } finally {
      setSalvando(false);
    }
  }

  // ─── Confirmar exclusão ───────────────────────────────────────────

  function confirmarExcluir(f: Funcionario) {
    setFuncionarioParaExcluir(f);
    setModalExcluir(true);
  }

  async function handleExcluir() {
    if (!funcionarioParaExcluir) return;
    setExcluindo(true);
    try {
      await funcionariosAPI.deletar(funcionarioParaExcluir.id);
      await carregarFuncionarios();
      setModalExcluir(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao excluir funcionário.");
    } finally {
      setExcluindo(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────

  if (!podeGerenciarFuncionarios) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-2">
          <ShieldOff className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-lg font-semibold">Acesso Restrito</p>
          <p className="text-sm text-muted-foreground">
            Apenas ADMIN e SUPORTE podem gerenciar funcionários.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os membros da equipe e seus perfis de acesso.
            </p>
          </div>
        </div>
        <Button onClick={abrirCriar} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* Barra de busca */}
      <div className="flex gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou username..."
            className="pl-9 h-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <span className="text-sm text-muted-foreground self-center">
          {funcionariosFiltrados.length} resultado{funcionariosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Feedback de carregamento / erro */}
      {carregando && (
        <div className="flex justify-center py-16">
          <p className="text-muted-foreground animate-pulse">Carregando funcionários...</p>
        </div>
      )}
      {!carregando && erro && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {erro}
        </div>
      )}

      {/* Tabela */}
      {!carregando && !erro && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">E-mail</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Username</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Perfil</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {funcionariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                      Nenhum funcionário encontrado.
                    </td>
                  </tr>
                ) : (
                  funcionariosFiltrados.map((f) => (
                    <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{f.nome}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{f.email}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">{f.username}</td>
                      <td className="px-4 py-3">
                        {f.perfil ? (
                          <Badge
                            variant="outline"
                            className={`text-[11px] ${perfilConfig[f.perfil]?.className ?? ""}`}
                          >
                            {perfilConfig[f.perfil]?.label ?? f.perfil}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] text-muted-foreground">Pendente</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {f.ativo ? (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-xs text-emerald-400 font-medium">Ativo</span>
                            </>
                          ) : (
                            <>
                              <ShieldOff className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Inativo</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => abrirEditar(f)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => confirmarExcluir(f)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar */}
      <Dialog open={modalAberto} onOpenChange={(open) => { setModalAberto(open); }}>
        <DialogContent className="w-[90vw] sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
            <DialogDescription>
              {editando
                ? `Atualize os dados de ${editando.nome}.`
                : "Preencha os dados para cadastrar um novo membro da equipe."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Nome completo</Label>
                <Input
                  placeholder="Ex: João Silva"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="joao@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>CPF</Label>
                <Input
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  placeholder="joaosilva"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>{editando ? "Nova senha (opcional)" : "Senha"}</Label>
                <Input
                  type="password"
                  placeholder={editando ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
                  value={form.senha}
                  onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Perfil</Label>
                <Select
                  value={form.perfil ?? "ATENDENTE"}
                  onValueChange={(v) => setForm((f) => ({ ...f, perfil: v as Funcionario["perfil"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPORTE">Suporte</SelectItem>
                    <SelectItem value="ATENDENTE">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.ativo ? "true" : "false"}
                  onValueChange={(v) => setForm((f) => ({ ...f, ativo: v === "true" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSalvar}
              disabled={salvando || !form.nome.trim() || !form.email.trim() || !form.cpf.trim() || !form.username.trim()}
              className="gap-2 w-full sm:w-auto"
            >
              {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Funcionário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Exclusão */}
      <Dialog open={modalExcluir} onOpenChange={setModalExcluir}>
        <DialogContent className="w-[90vw] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-foreground">{funcionarioParaExcluir?.nome}</span>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalExcluir(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluir}
              disabled={excluindo}
              className="gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
