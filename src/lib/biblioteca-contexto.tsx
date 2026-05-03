"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Livro, Cliente, Emprestimo, Ticket } from "@/lib/dados-mockados";
import { useAuth } from "@/lib/auth-contexto";
import {
  livrosAPI,
  clientesAPI,
  emprestimosAPI,
  ticketsAPI,
} from "@/services/api";

// ─── Tipo do Contexto ──────────────────────────────────────────────

interface BibliotecaContexto {
  livros: Livro[];
  clientes: Cliente[];
  emprestimos: Emprestimo[];
  tickets: Ticket[];
  carregandoDados: boolean;
  adicionarLivro: (livro: Omit<Livro, "id" | "disponivel">) => Promise<void>;
  editarLivro: (id: number, dados: Partial<Livro>) => Promise<void>;
  deletarLivro: (id: number) => Promise<void>;
  adicionarCliente: (cliente: Omit<Cliente, "id">) => Promise<void>;
  editarCliente: (id: number, dados: Omit<Cliente, "id">) => Promise<void>;
  deletarCliente: (id: number) => Promise<void>;
  criarEmprestimo: (livroId: number, clienteId: number) => Promise<void>;
  devolverEmprestimo: (emprestimoId: number) => Promise<void>;
  carregarTickets: () => Promise<void>;
  criarTicket: (dados: Omit<Ticket, "id" | "status" | "dataCriacao">) => Promise<void>;
  atualizarStatusTicket: (id: number, novoStatus: string) => Promise<void>;
  responderTicket: (id: number, resposta: string) => Promise<void>;
  enviarRelatorioTickets: (emailDestino: string) => Promise<void>;
  recarregarDados: () => Promise<void>;
}

const Contexto = createContext<BibliotecaContexto | null>(null);

// ─── Hook de acesso ────────────────────────────────────────────────

export function useBiblioteca() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useBiblioteca deve estar dentro do Provider");
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────

export function BibliotecaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario } = useAuth();

  const [livros, setLivros] = useState<Livro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // ─── Carregar dados do backend ────────────────────────────────

  const recarregarDados = useCallback(async () => {
    if (!usuario) return;

    try {
      setCarregandoDados(true);
      const [livrosData, clientesData, emprestimosData, ticketsData] = await Promise.all([
        livrosAPI.listar(),
        clientesAPI.listar(),
        emprestimosAPI.listar(),
        ticketsAPI.listar(),
      ]);
      setLivros(livrosData as Livro[]);
      setClientes(clientesData as Cliente[]);
      setEmprestimos(emprestimosData as Emprestimo[]);
      setTickets(ticketsData as Ticket[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setCarregandoDados(false);
    }
  }, [usuario]);

  // Carrega dados quando o usuário loga
  useEffect(() => {
    if (usuario) {
      recarregarDados();
    } else {
      // Limpa dados ao deslogar
      setLivros([]);
      setClientes([]);
      setEmprestimos([]);
      setTickets([]);
      setCarregandoDados(false);
    }
  }, [usuario, recarregarDados]);

  // ─── Livros (CRUD via API) ────────────────────────────────────

  const adicionarLivro = useCallback(
    async (dados: Omit<Livro, "id" | "disponivel">) => {
      await livrosAPI.criar(dados as Record<string, unknown>);
      const atualizados = await livrosAPI.listar();
      setLivros(atualizados as Livro[]);
    },
    []
  );

  const editarLivro = useCallback(
    async (id: number, dados: Partial<Livro>) => {
      await livrosAPI.editar(id, dados as Record<string, unknown>);
      const atualizados = await livrosAPI.listar();
      setLivros(atualizados as Livro[]);
    },
    []
  );

  const deletarLivro = useCallback(async (id: number) => {
    await livrosAPI.deletar(id);
    setLivros((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ─── Clientes (CRUD via API) ──────────────────────────────────

  const adicionarCliente = useCallback(
    async (dados: Omit<Cliente, "id">) => {
      await clientesAPI.criar(dados as Record<string, unknown>);
      const atualizados = await clientesAPI.listar();
      setClientes(atualizados as Cliente[]);
    },
    []
  );

  const editarCliente = useCallback(
    async (id: number, dados: Omit<Cliente, "id">) => {
      await clientesAPI.editar(id, dados as Record<string, unknown>);
      const atualizados = await clientesAPI.listar();
      setClientes(atualizados as Cliente[]);
    },
    []
  );

  const deletarCliente = useCallback(async (id: number) => {
    await clientesAPI.deletar(id);
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ─── Empréstimos (CRUD via API) ───────────────────────────────

  const criarEmprestimo = useCallback(
    async (livroId: number, clienteId: number) => {
      await emprestimosAPI.criar({ livroId, clienteId });
      // Recarrega livros e empréstimos pois a disponibilidade muda
      const [livrosAtualizados, emprestimosAtualizados] = await Promise.all([
        livrosAPI.listar(),
        emprestimosAPI.listar(),
      ]);
      setLivros(livrosAtualizados as Livro[]);
      setEmprestimos(emprestimosAtualizados as Emprestimo[]);
    },
    []
  );

  const devolverEmprestimo = useCallback(async (emprestimoId: number) => {
    await emprestimosAPI.devolver(emprestimoId);
    const [livrosAtualizados, emprestimosAtualizados] = await Promise.all([
      livrosAPI.listar(),
      emprestimosAPI.listar(),
    ]);
    setLivros(livrosAtualizados as Livro[]);
    setEmprestimos(emprestimosAtualizados as Emprestimo[]);
  }, []);

  // ─── Tickets (CRUD via API) ───────────────────────────────────

  const carregarTickets = useCallback(async () => {
    const ticketsData = await ticketsAPI.listar();
    setTickets(ticketsData as Ticket[]);
  }, []);

  const criarTicket = useCallback(
    async (dados: Omit<Ticket, "id" | "status" | "dataCriacao">) => {
      await ticketsAPI.criar(dados as Record<string, unknown>);
      const atualizados = await ticketsAPI.listar();
      setTickets(atualizados as Ticket[]);
    },
    []
  );

  const atualizarStatusTicket = useCallback(
    async (id: number, novoStatus: string) => {
      await ticketsAPI.atualizarStatus(id, novoStatus);
      const atualizados = await ticketsAPI.listar();
      setTickets(atualizados as Ticket[]);
    },
    []
  );

  const responderTicket = useCallback(
    async (id: number, resposta: string) => {
      await ticketsAPI.responder(id, resposta);
      const atualizados = await ticketsAPI.listar();
      setTickets(atualizados as Ticket[]);
    },
    []
  );

  const enviarRelatorioTickets = useCallback(async (emailDestino: string) => {
    await ticketsAPI.enviarRelatorio(emailDestino);
  }, []);

  return (
    <Contexto.Provider
      value={{
        livros,
        clientes,
        emprestimos,
        tickets,
        carregandoDados,
        adicionarLivro,
        editarLivro,
        deletarLivro,
        adicionarCliente,
        editarCliente,
        deletarCliente,
        criarEmprestimo,
        devolverEmprestimo,
        carregarTickets,
        criarTicket,
        atualizarStatusTicket,
        responderTicket,
        enviarRelatorioTickets,
        recarregarDados,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
