// ─── Serviço de API Centralizado ────────────────────────────────────
// Todas as chamadas HTTP passam por aqui.
// O token JWT é automaticamente injetado no header Authorization.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Helpers de Token ───────────────────────────────────────────────

export function salvarToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bibliotech_token", token);
  }
}

export function obterToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bibliotech_token");
  }
  return null;
}

export function removerToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bibliotech_token");
    localStorage.removeItem("bibliotech_usuario");
  }
}

export function salvarUsuario(usuario: UsuarioLogado) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bibliotech_usuario", JSON.stringify(usuario));
  }
}

export function obterUsuario(): UsuarioLogado | null {
  if (typeof window !== "undefined") {
    const dados = localStorage.getItem("bibliotech_usuario");
    if (dados) {
      try {
        return JSON.parse(dados);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// ─── Tipo do Usuário Logado ─────────────────────────────────────────

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: "ADMIN" | "SUPORTE" | "ATENDENTE";
}

// ─── Fetch Wrapper ──────────────────────────────────────────────────

async function fetchAPI<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = obterToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se não autenticado, limpa o token e redireciona
  if (response.status === 401) {
    removerToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  // Se proibido (sem permissão)
  if (response.status === 403) {
    throw new Error("Você não tem permissão para realizar esta ação.");
  }

  // Se sem conteúdo (ex: DELETE 204)
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || data.message || "Erro na requisição.");
  }

  return data as T;
}

// ─── Auth API ───────────────────────────────────────────────────────

export const authAPI = {
  login: (email: string, senha: string) =>
    fetchAPI<{ token: string; id: number; nome: string; email: string; perfil: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, senha }) }
    ),

  solicitarAcesso: (dados: { nome: string; email: string; cpf: string; username: string; senha: string }) =>
    fetchAPI<{ id: number; nome: string; email: string; mensagem: string }>(
      "/api/auth/solicitar-acesso",
      { method: "POST", body: JSON.stringify(dados) }
    ),

  aprovar: (id: number, perfil?: string) =>
    fetchAPI(
      `/api/auth/aprovar/${id}`,
      { method: "PATCH", body: JSON.stringify(perfil ? { perfil } : {}) }
    ),

  esqueciSenha: (email: string, cpf: string) =>
    fetchAPI<{ token: string; mensagem: string }>(
      "/api/auth/esqueci-senha",
      { method: "POST", body: JSON.stringify({ email, cpf }) }
    ),

  redefinirSenha: (token: string, novaSenha: string) =>
    fetchAPI<{ mensagem: string }>(
      "/api/auth/redefinir-senha",
      { method: "POST", body: JSON.stringify({ token, novaSenha }) }
    ),

  me: () =>
    fetchAPI<{ id: number; nome: string; email: string; username: string; perfil: string; ativo: boolean }>(
      "/api/auth/me"
    ),
};

// ─── Livros API ─────────────────────────────────────────────────────

export const livrosAPI = {
  listar: () => fetchAPI<unknown[]>("/api/livros"),
  buscarPorId: (id: number) => fetchAPI(`/api/livros/${id}`),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/livros", { method: "POST", body: JSON.stringify(dados) }),
  editar: (id: number, dados: Record<string, unknown>) =>
    fetchAPI(`/api/livros/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  deletar: (id: number) =>
    fetchAPI(`/api/livros/${id}`, { method: "DELETE" }),
};

// ─── Clientes API ───────────────────────────────────────────────────

export const clientesAPI = {
  listar: () => fetchAPI<unknown[]>("/api/clientes"),
  buscarPorId: (id: number) => fetchAPI(`/api/clientes/${id}`),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/clientes", { method: "POST", body: JSON.stringify(dados) }),
  editar: (id: number, dados: Record<string, unknown>) =>
    fetchAPI(`/api/clientes/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  deletar: (id: number) =>
    fetchAPI(`/api/clientes/${id}`, { method: "DELETE" }),
};

// ─── Empréstimos API ────────────────────────────────────────────────

export const emprestimosAPI = {
  listar: () => fetchAPI<unknown[]>("/api/emprestimos"),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/emprestimos", { method: "POST", body: JSON.stringify(dados) }),
  devolver: (id: number) =>
    fetchAPI(`/api/emprestimos/${id}/devolver`, { method: "PUT" }),
  renovar: (id: number) =>
    fetchAPI(`/api/emprestimos/${id}/renovar`, { method: "PUT" }),
};

// ─── Tickets API ────────────────────────────────────────────────────

export const ticketsAPI = {
  listar: () => fetchAPI<unknown[]>("/api/tickets"),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/tickets", { method: "POST", body: JSON.stringify(dados) }),
  atualizarStatus: (id: number, status: string) =>
    fetchAPI(`/api/tickets/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  responder: (id: number, resposta: string) =>
    fetchAPI(`/api/tickets/${id}/resposta`, { method: "PATCH", body: JSON.stringify({ resposta }) }),
  enviarRelatorio: (emailDestino: string) =>
    fetchAPI("/api/tickets/relatorio", { method: "POST", body: JSON.stringify({ emailDestino }) }),
};

// ─── Funcionários API ───────────────────────────────────────────────

export const funcionariosAPI = {
  listar: () => fetchAPI<unknown[]>("/api/funcionarios"),
  buscarPorId: (id: number) => fetchAPI(`/api/funcionarios/${id}`),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/funcionarios", { method: "POST", body: JSON.stringify(dados) }),
  editar: (id: number, dados: Record<string, unknown>) =>
    fetchAPI(`/api/funcionarios/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  deletar: (id: number) =>
    fetchAPI(`/api/funcionarios/${id}`, { method: "DELETE" }),
};

// ─── Beneficiadores API ─────────────────────────────────────────────

export const beneficiadoresAPI = {
  listar: () => fetchAPI<unknown[]>("/api/beneficiadores"),
  criar: (dados: Record<string, unknown>) =>
    fetchAPI("/api/beneficiadores", { method: "POST", body: JSON.stringify(dados) }),
};

// ─── Email API (Next.js server-side route) ──────────────────────────

export const emailAPI = {
  enviarRedefinicaoSenha: (emailDestino: string, token: string, nome: string) =>
    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "redefinicao-senha", emailDestino, token, nome }),
    }),

  enviarAprovacaoCadastro: (emailDestino: string, idFuncionario: number, nome: string) =>
    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "aprovacao-cadastro", emailDestino, idFuncionario, nome }),
    }),
};
