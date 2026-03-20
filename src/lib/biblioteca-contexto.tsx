"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  livrosMockados,
  clientesMockados,
  emprestimosMockados,
  type Livro,
  type Cliente,
  type Emprestimo,
} from "@/lib/dados-mockados";

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
  const [livros, setLivros] = useState<Livro[]>(livrosMockados);
  const [clientes, setClientes] = useState<Cliente[]>(clientesMockados);
  const [emprestimos, setEmprestimos] =
    useState<Emprestimo[]>(emprestimosMockados);

  // ─── Livros ────────────────────────────────────────────────────

  const adicionarLivro = useCallback(
    (dados: Omit<Livro, "id" | "disponivel">) => {
      setLivros((prev) => [
        ...prev,
        { ...dados, id: Date.now(), disponivel: true },
      ]);
    },
    []
  );

  const editarLivro = useCallback(
    (id: number, dados: Omit<Livro, "id" | "disponivel">) => {
      setLivros((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...dados } : l))
      );
    },
    []
  );

  const deletarLivro = useCallback((id: number) => {
    setLivros((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ─── Clientes ──────────────────────────────────────────────────

  const adicionarCliente = useCallback((dados: Omit<Cliente, "id">) => {
    setClientes((prev) => [...prev, { ...dados, id: Date.now() }]);
  }, []);

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

  // ─── Empréstimos ───────────────────────────────────────────────

  const criarEmprestimo = useCallback(
    (livroId: number, clienteId: number) => {
      const livro = livros.find((l) => l.id === livroId);
      const cliente = clientes.find((c) => c.id === clienteId);
      if (!livro || !cliente || !livro.disponivel) return;

      const novoEmprestimo: Emprestimo = {
        id: Date.now(),
        dataEmprestimo: new Date().toISOString().split("T")[0],
        dataDevolucao: null,
        livro,
        cliente,
      };
      setEmprestimos((prev) => [...prev, novoEmprestimo]);
      setLivros((prev) =>
        prev.map((l) =>
          l.id === livroId ? { ...l, disponivel: false } : l
        )
      );
    },
    [livros, clientes]
  );

  const devolverEmprestimo = useCallback((emprestimoId: number) => {
    setEmprestimos((prev) =>
      prev.map((e) =>
        e.id === emprestimoId
          ? {
              ...e,
              dataDevolucao: new Date().toISOString().split("T")[0],
            }
          : e
      )
    );
    const emprestimo = emprestimos.find((e) => e.id === emprestimoId);
    if (emprestimo) {
      setLivros((prev) =>
        prev.map((l) =>
          l.id === emprestimo.livro.id ? { ...l, disponivel: true } : l
        )
      );
    }
  }, [emprestimos]);

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
