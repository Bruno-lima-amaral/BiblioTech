"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Livro, Cliente, Emprestimo } from "@/lib/dados-mockados";

const API_BASE = "https://projetogestaobibliotecabackend-production.up.railway.app/api";

// ─── Tipo do Contexto ──────────────────────────────────────────────

interface BibliotecaContexto {
  livros: Livro[];
  clientes: Cliente[];
  emprestimos: Emprestimo[];
  adicionarLivro: (livro: Omit<Livro, "id" | "disponivel">) => void;
  editarLivro: (id: number, dados: Omit<Livro, "id" | "disponivel">) => void;
  deletarLivro: (id: number) => void;
  adicionarCliente: (cliente: Omit<Cliente, "id">) => void;
  editarCliente: (id: number, dados: Omit<Cliente, "id">) => void;
  deletarCliente: (id: number) => void;
  criarEmprestimo: (livroId: number, clienteId: number) => void;
  devolverEmprestimo: (emprestimoId: number) => void;
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
  const [livros, setLivros] = useState<Livro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  // ─── Carregamento inicial via API ───────────────────────────────

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resLivros, resClientes] = await Promise.all([
          fetch(`${API_BASE}/livros`),
          fetch(`${API_BASE}/clientes`),
        ]);
        if (resLivros.ok) setLivros(await resLivros.json());
        if (resClientes.ok) setClientes(await resClientes.json());
      } catch (erro) {
        console.error("Erro ao carregar dados iniciais:", erro);
      }

      // Empréstimos — tenta carregar, mas o endpoint pode não existir ainda
      try {
        const resEmp = await fetch(`${API_BASE}/emprestimos`);
        if (resEmp.ok) setEmprestimos(await resEmp.json());
      } catch {
        console.warn("Endpoint /api/emprestimos não disponível.");
      }
    }
    carregarDados();
  }, []);

  // ─── Livros ────────────────────────────────────────────────────

  const adicionarLivro = useCallback(
    async (dados: Omit<Livro, "id" | "disponivel">) => {
      try {
        const res = await fetch(`${API_BASE}/livros`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...dados, disponivel: true }),
        });
        if (res.ok) {
          const livroCriado: Livro = await res.json();
          setLivros((prev) => [...prev, livroCriado]);
        }
      } catch (erro) {
        console.error("Erro ao adicionar livro:", erro);
      }
    },
    []
  );

  const editarLivro = useCallback(
    async (id: number, dados: Omit<Livro, "id" | "disponivel">) => {
      try {
        const livroAtual = livros.find((l) => l.id === id);
        const res = await fetch(`${API_BASE}/livros/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dados,
            disponivel: livroAtual?.disponivel ?? true,
          }),
        });
        if (res.ok) {
          const livroAtualizado: Livro = await res.json();
          setLivros((prev) =>
            prev.map((l) => (l.id === livroAtualizado.id ? livroAtualizado : l))
          );
        }
      } catch (erro) {
        console.error("Erro ao editar livro:", erro);
      }
    },
    [livros]
  );

  const deletarLivro = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/livros/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLivros((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (erro) {
      console.error("Erro ao deletar livro:", erro);
    }
  }, []);

  // ─── Clientes ──────────────────────────────────────────────────

  const adicionarCliente = useCallback(
    async (dados: Omit<Cliente, "id">) => {
      try {
        const res = await fetch(`${API_BASE}/clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
        if (res.ok) {
          const clienteCriado: Cliente = await res.json();
          setClientes((prev) => [...prev, clienteCriado]);
        }
      } catch (erro) {
        console.error("Erro ao adicionar cliente:", erro);
      }
    },
    []
  );

  const editarCliente = useCallback(
    async (id: number, dados: Omit<Cliente, "id">) => {
      try {
        const res = await fetch(`${API_BASE}/clientes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
        if (res.ok) {
          const clienteAtualizado: Cliente = await res.json();
          setClientes((prev) =>
            prev.map((c) =>
              c.id === clienteAtualizado.id ? clienteAtualizado : c
            )
          );
        }
      } catch (erro) {
        console.error("Erro ao editar cliente:", erro);
      }
    },
    []
  );

  const deletarCliente = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/clientes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClientes((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (erro) {
      console.error("Erro ao deletar cliente:", erro);
    }
  }, []);

  // ─── Empréstimos ───────────────────────────────────────────────

  const criarEmprestimo = useCallback(
    async (livroId: number, clienteId: number) => {
      try {
        console.log("[criarEmprestimo] Enviando:", { livroId, clienteId });
        const res = await fetch(`${API_BASE}/emprestimos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ livroId, clienteId }),
        });
        if (res.ok) {
          const novoEmprestimo: Emprestimo = await res.json();
          console.log("[criarEmprestimo] Sucesso:", novoEmprestimo);
          setEmprestimos((prev) => [...prev, novoEmprestimo]);
          // Atualiza disponibilidade do livro localmente
          setLivros((prev) =>
            prev.map((l) =>
              l.id === livroId ? { ...l, disponivel: false } : l
            )
          );
        } else {
          const textoErro = await res.text();
          console.error("[criarEmprestimo] Erro HTTP:", res.status, textoErro);
        }
      } catch (erro) {
        console.error("[criarEmprestimo] Erro de rede/fetch:", erro);
      }
    },
    []
  );

  const devolverEmprestimo = useCallback(async (emprestimoId: number) => {
    try {
      console.log("[devolverEmprestimo] Devolvendo ID:", emprestimoId);
      const res = await fetch(
        `${API_BASE}/emprestimos/${emprestimoId}/devolver`,
        { method: "PUT" }
      );
      if (res.ok) {
        const empDevolvido: Emprestimo = await res.json();
        console.log("[devolverEmprestimo] Sucesso:", empDevolvido);
        setEmprestimos((prev) =>
          prev.map((e) => (e.id === emprestimoId ? empDevolvido : e))
        );
        // Atualiza disponibilidade do livro localmente
        if (empDevolvido.livro) {
          setLivros((prev) =>
            prev.map((l) =>
              l.id === empDevolvido.livro.id ? { ...l, disponivel: true } : l
            )
          );
        }
      } else {
        const textoErro = await res.text();
        console.error("[devolverEmprestimo] Erro HTTP:", res.status, textoErro);
      }
    } catch (erro) {
      console.error("[devolverEmprestimo] Erro de rede/fetch:", erro);
    }
  }, []);

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
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
