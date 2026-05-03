"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  authAPI,
  salvarToken,
  salvarUsuario,
  obterToken,
  obterUsuario,
  removerToken,
  type UsuarioLogado,
} from "@/services/api";

// ─── Tipo do Contexto ───────────────────────────────────────────────

interface AuthContexto {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  ehAdmin: boolean;
  ehSuporte: boolean;
  ehAtendente: boolean;
  podeGerenciarFuncionarios: boolean;
  podeGerenciarTickets: boolean;
}

const Contexto = createContext<AuthContexto | null>(null);

// ─── Hook de acesso ─────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useAuth deve estar dentro do AuthProvider");
  return ctx;
}

// ─── Rotas públicas (sem autenticação) ──────────────────────────────

const ROTAS_PUBLICAS = ["/login", "/solicitar-acesso", "/cadastro-suporte", "/recuperar-senha", "/redefinir-senha"];

// ─── Provider ───────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const caminhoAtual = usePathname();

  // ─── Restaurar sessão do localStorage ─────────────────────────

  useEffect(() => {
    const token = obterToken();
    const usuarioSalvo = obterUsuario();

    if (token && usuarioSalvo) {
      setUsuario(usuarioSalvo);
      // Valida o token com o backend em background
      authAPI.me()
        .then((dados) => {
          const usuarioAtualizado: UsuarioLogado = {
            id: dados.id,
            nome: dados.nome,
            email: dados.email,
            perfil: dados.perfil as UsuarioLogado["perfil"],
          };
          setUsuario(usuarioAtualizado);
          salvarUsuario(usuarioAtualizado);
        })
        .catch(() => {
          // Token inválido/expirado
          removerToken();
          setUsuario(null);
        })
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, []);

  // ─── Proteção de rotas ────────────────────────────────────────

  useEffect(() => {
    if (carregando) return;

    const ehRotaPublica = ROTAS_PUBLICAS.some((rota) =>
      caminhoAtual.startsWith(rota)
    );

    if (!usuario && !ehRotaPublica) {
      router.push("/login");
    }
  }, [usuario, carregando, caminhoAtual, router]);

  // ─── Login ────────────────────────────────────────────────────

  const login = useCallback(async (email: string, senha: string) => {
    const resposta = await authAPI.login(email, senha);

    salvarToken(resposta.token);

    const usuarioLogado: UsuarioLogado = {
      id: resposta.id,
      nome: resposta.nome,
      email: resposta.email,
      perfil: resposta.perfil as UsuarioLogado["perfil"],
    };

    salvarUsuario(usuarioLogado);
    setUsuario(usuarioLogado);
    router.push("/");
  }, [router]);

  // ─── Logout ───────────────────────────────────────────────────

  const logout = useCallback(() => {
    removerToken();
    setUsuario(null);
    router.push("/login");
  }, [router]);

  // ─── Permissões derivadas ─────────────────────────────────────

  const ehAdmin = usuario?.perfil === "ADMIN";
  const ehSuporte = usuario?.perfil === "SUPORTE";
  const ehAtendente = usuario?.perfil === "ATENDENTE";
  const podeGerenciarFuncionarios = ehAdmin || ehSuporte;
  const podeGerenciarTickets = ehAdmin || ehSuporte; // Atendente só cria

  return (
    <Contexto.Provider
      value={{
        usuario,
        carregando,
        login,
        logout,
        ehAdmin,
        ehSuporte,
        ehAtendente,
        podeGerenciarFuncionarios,
        podeGerenciarTickets,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
