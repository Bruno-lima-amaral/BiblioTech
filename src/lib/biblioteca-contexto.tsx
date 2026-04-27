"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { Livro, Cliente, Emprestimo, Funcionario } from "@/lib/dados-mockados";
import {
  livrosMockados,
  clientesMockados,
  emprestimosMockados,
  ticketsMockados,
  funcionariosMockados,
  type Ticket,
} from "@/lib/dados-mockados";

// ─── Tipo do Contexto ──────────────────────────────────────────────

interface BibliotecaContexto {
  livros: Livro[];
  clientes: Cliente[];
  emprestimos: Emprestimo[];
  tickets: Ticket[];
  funcionarios: Funcionario[];
  usuarioLogado: Funcionario | null;
  adicionarLivro: (livro: Omit<Livro, "id" | "disponivel">) => void;
  editarLivro: (id: number, dados: Partial<Livro>) => void;
  deletarLivro: (id: number) => void;
  adicionarCliente: (cliente: Omit<Cliente, "id">) => void;
  editarCliente: (id: number, dados: Omit<Cliente, "id">) => void;
  deletarCliente: (id: number) => void;
  criarEmprestimo: (livroId: number, clienteId: number) => void;
  devolverEmprestimo: (emprestimoId: number) => void;
  carregarTickets: () => Promise<void>;
  criarTicket: (dados: Omit<Ticket, "id" | "status" | "dataCriacao">) => Promise<void>;
  atualizarStatusTicket: (id: number, novoStatus: string) => Promise<void>;
  responderTicket: (id: number, resposta: string) => Promise<void>;
  enviarRelatorioTickets: (emailDestino: string) => Promise<void>;
  loginFuncionario: (email: string, senha: string) => boolean;
  logoutFuncionario: () => void;
  adicionarFuncionario: (funcionario: Omit<Funcionario, "id">) => void;
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
  // Estado inicializado diretamente com dados mockados (sem API)
  const [livros, setLivros] = useState<Livro[]>(livrosMockados);
  const [clientes, setClientes] = useState<Cliente[]>(clientesMockados);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>(emprestimosMockados);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsMockados);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(funcionariosMockados);
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);

  // ─── Tickets (mock local) ─────────────────────────────────────

  const carregarTickets = useCallback(async () => {
    // Dados já carregados no estado inicial, mantemos por compatibilidade
    setTickets((prev) => (prev.length > 0 ? prev : ticketsMockados));
  }, []);

  const criarTicket = useCallback(
    async (dados: Omit<Ticket, "id" | "status" | "dataCriacao">) => {
      const novoTicket: Ticket = {
        ...dados,
        id: Date.now(),
        status: "ABERTO",
        dataCriacao: new Date().toISOString(),
      };
      setTickets((prev) => [...prev, novoTicket]);
    },
    []
  );

  const atualizarStatusTicket = useCallback(
    async (id: number, novoStatus: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: novoStatus as Ticket["status"] } : t
        )
      );
    },
    []
  );

  const responderTicket = useCallback(
    async (id: number, resposta: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, resposta, status: "CONCLUIDO" } : t
        )
      );
    },
    []
  );

  const enviarRelatorioTickets = useCallback(async (emailDestino: string) => {
    // Mock: simula envio exibindo dados no console
    console.log(`[MOCK] Relatório de tickets enviado para: ${emailDestino}`);
  }, []);

  // ─── Livros (CRUD local) ──────────────────────────────────────

  const adicionarLivro = useCallback(
    (dados: Omit<Livro, "id" | "disponivel">) => {
      const novoLivro: Livro = {
        ...dados,
        id: Date.now(),
        disponivel: true,
      };
      setLivros((prev) => [...prev, novoLivro]);
    },
    []
  );

  const editarLivro = useCallback(
    (id: number, dados: Partial<Livro>) => {
      setLivros((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...dados } : l))
      );
    },
    []
  );

  const deletarLivro = useCallback((id: number) => {
    setLivros((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ─── Clientes (CRUD local) ────────────────────────────────────

  const adicionarCliente = useCallback(
    (dados: Omit<Cliente, "id">) => {
      const novoCliente: Cliente = {
        ...dados,
        id: Date.now(),
      };
      setClientes((prev) => [...prev, novoCliente]);
    },
    []
  );

  const editarCliente = useCallback(
    (id: number, dados: Omit<Cliente, "id">) => {
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...dados } : c))
      );
    },
    []
  );

  const deletarCliente = useCallback((id: number) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ─── Empréstimos (CRUD local) ─────────────────────────────────

  const criarEmprestimo = useCallback(
    (livroId: number, clienteId: number) => {
      const livro = livros.find((l) => l.id === livroId);
      const cliente = clientes.find((c) => c.id === clienteId);
      if (!livro || !cliente) return;

      const hoje = new Date();
      const devolucaoPrevista = new Date(hoje);
      devolucaoPrevista.setDate(devolucaoPrevista.getDate() + 7);

      const novoEmprestimo: Emprestimo = {
        id: Date.now(),
        dataEmprestimo: hoje.toISOString().split("T")[0],
        dataPrevistaDevolucao: devolucaoPrevista.toISOString().split("T")[0],
        dataDevolucao: null,
        livro,
        cliente,
      };

      setEmprestimos((prev) => [...prev, novoEmprestimo]);
      // Marca o livro como indisponível
      setLivros((prev) =>
        prev.map((l) =>
          l.id === livroId ? { ...l, disponivel: false } : l
        )
      );
    },
    [livros, clientes]
  );

  const devolverEmprestimo = useCallback((emprestimoId: number) => {
    const hoje = new Date().toISOString().split("T")[0];
    setEmprestimos((prev) =>
      prev.map((e) => {
        if (e.id === emprestimoId) {
          // Marca o livro como disponível novamente
          setLivros((prevLivros) =>
            prevLivros.map((l) =>
              l.id === e.livro.id ? { ...l, disponivel: true } : l
            )
          );
          return { ...e, dataDevolucao: hoje };
        }
        return e;
      })
    );
  }, []);

  // ─── Funcionários / Autenticação (mock local) ─────────────────

  const loginFuncionario = useCallback(
    (email: string, senha: string): boolean => {
      const encontrado = funcionarios.find(
        (f) => f.email === email && f.senha === senha && f.ativo
      );
      if (encontrado) {
        setUsuarioLogado(encontrado);
        return true;
      }
      return false;
    },
    [funcionarios]
  );

  const logoutFuncionario = useCallback(() => {
    setUsuarioLogado(null);
  }, []);

  const adicionarFuncionario = useCallback(
    (dados: Omit<Funcionario, "id">) => {
      const novo: Funcionario = {
        ...dados,
        id: Date.now(),
      };
      setFuncionarios((prev) => [...prev, novo]);
      console.log("[MOCK] Funcionário cadastrado:", novo);
    },
    []
  );

  return (
    <Contexto.Provider
      value={{
        livros,
        clientes,
        emprestimos,
        adicionarLivro,
        editarLivro,
        deletarLivro,
        adicionarCliente,
        editarCliente,
        deletarCliente,
        criarEmprestimo,
        devolverEmprestimo,
        tickets,
        carregarTickets,
        criarTicket,
        atualizarStatusTicket,
        responderTicket,
        enviarRelatorioTickets,
        funcionarios,
        usuarioLogado,
        loginFuncionario,
        logoutFuncionario,
        adicionarFuncionario,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
