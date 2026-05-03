// ─── Tipos baseados no Backend Spring Boot ──────────────────────────
// Esses tipos espelham os modelos do backend (Livro, Cliente, etc.)
// Os dados vêm da API agora — não há mais dados mockados.

export interface Beneficiador {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
}

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  ano: number;
  disponivel: boolean;
  genero: string;
  isbn: string;
  beneficiador?: Beneficiador | null;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string; // formato YYYY-MM-DD (vindo do backend como LocalDate)
  sexo: "M" | "F";
}

export interface Emprestimo {
  id: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  dataPrevistaDevolucao: string;
  prazoDias?: number;
  renovacoesRealizadas?: number;
  status?: string;
  livro: Livro;
  cliente: Cliente;
}

export interface Ticket {
  id: number;
  titulo: string;
  categoria: "BUG" | "SUGESTAO" | "DUVIDA";
  prioridade: "BAIXA" | "MEDIA" | "ALTA";
  status: "ABERTO" | "EM_ANALISE" | "CONCLUIDO";
  descricao: string;
  dataCriacao: string;
  resposta?: string | null;
}

export interface Funcionario {
  id: number;
  nome: string;
  username: string;
  email: string;
  cpf: string;
  ativo: boolean;
  perfil: "ADMIN" | "SUPORTE" | "ATENDENTE" | null;
}

// ─── Função utilitária: cálculo de idade ────────────────────────────
// Calcula a diferença entre a data de nascimento e a data atual em anos completos
export function calcularIdade(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesDiff = hoje.getMonth() - nascimento.getMonth();
  // Se o aniversário ainda não passou neste ano, subtrai 1
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}