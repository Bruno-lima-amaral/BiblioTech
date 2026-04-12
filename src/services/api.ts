const API_BASE =
  "https://projetogestaobibliotecabackend-production.up.railway.app/api";

// ─── Tipos de resposta ─────────────────────────────────────────────

export interface ApiError {
  message: string;
}

export interface Beneficiador {
  id?: number;
  nome: string;
  cnpj: string;
  telefone: string;
}

// ─── Helpers ───────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // O back-end retorna mensagens descritivas no corpo da resposta
    const textoErro = await res.text();
    throw new Error(textoErro || `Erro HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Empréstimos ───────────────────────────────────────────────────

export async function listarEmprestimos() {
  const res = await fetch(`${API_BASE}/emprestimos`);
  return handleResponse<any[]>(res);
}

export async function renovarEmprestimo(id: number) {
  const res = await fetch(`${API_BASE}/emprestimos/${id}/renovar`, {
    method: "PUT",
  });
  return handleResponse(res);
}

export async function devolverEmprestimo(id: number) {
  const res = await fetch(`${API_BASE}/emprestimos/${id}/devolver`, {
    method: "PUT",
  });
  return handleResponse(res);
}

// ─── Beneficiadores ────────────────────────────────────────────────

export async function cadastrarBeneficiador(
  data: Omit<Beneficiador, "id">
): Promise<Beneficiador> {
  const res = await fetch(`${API_BASE}/beneficiadores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Beneficiador>(res);
}
