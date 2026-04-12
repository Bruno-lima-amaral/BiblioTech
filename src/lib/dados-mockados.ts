// Tipos baseados no Diagrama de Classes do sistema

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
  beneficiador?: Beneficiador | null;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
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

// ─── Dados Mockados ─────────────────────────────────────────────────

export const livrosMockados: Livro[] = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: 1899,
    disponivel: true,
  },
  {
    id: 2,
    titulo: "Grande Sertão: Veredas",
    autor: "Guimarães Rosa",
    ano: 1956,
    disponivel: false,
  },
  {
    id: 3,
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis",
    ano: 1881,
    disponivel: true,
  },
  {
    id: 4,
    titulo: "O Cortiço",
    autor: "Aluísio Azevedo",
    ano: 1890,
    disponivel: true,
  },
  {
    id: 5,
    titulo: "Iracema",
    autor: "José de Alencar",
    ano: 1865,
    disponivel: false,
  },
  {
    id: 6,
    titulo: "Capitães da Areia",
    autor: "Jorge Amado",
    ano: 1937,
    disponivel: true,
  },
  {
    id: 7,
    titulo: "A Hora da Estrela",
    autor: "Clarice Lispector",
    ano: 1977,
    disponivel: false,
  },
  {
    id: 8,
    titulo: "Vidas Secas",
    autor: "Graciliano Ramos",
    ano: 1938,
    disponivel: true,
  },
];

export const clientesMockados: Cliente[] = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@email.com", cpf: "111.111.111-11", telefone: "(11) 91111-1111" },
  { id: 2, nome: "Carlos Oliveira", email: "carlos.oliveira@email.com", cpf: "222.222.222-22", telefone: "(11) 92222-2222" },
  { id: 3, nome: "Beatriz Santos", email: "beatriz.santos@email.com", cpf: "333.333.333-33", telefone: "(11) 93333-3333" },
  { id: 4, nome: "Pedro Souza", email: "pedro.souza@email.com", cpf: "444.444.444-44", telefone: "(11) 94444-4444" },
];

export const emprestimosMockados: Emprestimo[] = [
  {
    id: 1,
    dataEmprestimo: "2026-03-01",
    dataPrevistaDevolucao: "2026-03-08",
    dataDevolucao: null,
    livro: livrosMockados[1],
    cliente: clientesMockados[0],
  },
  {
    id: 2,
    dataEmprestimo: "2026-03-05",
    dataPrevistaDevolucao: "2026-03-12",
    dataDevolucao: null,
    livro: livrosMockados[4],
    cliente: clientesMockados[1],
  },
  {
    id: 3,
    dataEmprestimo: "2026-02-20",
    dataPrevistaDevolucao: "2026-02-27",
    dataDevolucao: "2026-03-10",
    livro: livrosMockados[0],
    cliente: clientesMockados[2],
  },
];
