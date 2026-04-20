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
  data_nascimento: string; // formato YYYY-MM-DD
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
  senha: string;
  cargo: string;
  ativo: boolean;
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

// ─── Dados Mockados ─────────────────────────────────────────────────

export const livrosMockados: Livro[] = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: 1899,
    disponivel: true,
    genero: "Romance",
    isbn: "978-85-7232-001-5",
  },
  {
    id: 2,
    titulo: "Grande Sertão: Veredas",
    autor: "Guimarães Rosa",
    ano: 1956,
    disponivel: false,
    genero: "Aventura",
    isbn: "978-85-209-0263-6",
  },
  {
    id: 3,
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis",
    ano: 1881,
    disponivel: true,
    genero: "Romance",
    isbn: "978-85-7232-002-2",
  },
  {
    id: 4,
    titulo: "O Cortiço",
    autor: "Aluísio Azevedo",
    ano: 1890,
    disponivel: true,
    genero: "Ficção",
    isbn: "978-85-7232-003-9",
  },
  {
    id: 5,
    titulo: "Iracema",
    autor: "José de Alencar",
    ano: 1865,
    disponivel: false,
    genero: "Aventura",
    isbn: "978-85-7232-004-6",
  },
  {
    id: 6,
    titulo: "Capitães da Areia",
    autor: "Jorge Amado",
    ano: 1937,
    disponivel: true,
    genero: "Ficção",
    isbn: "978-85-7232-005-3",
  },
  {
    id: 7,
    titulo: "A Hora da Estrela",
    autor: "Clarice Lispector",
    ano: 1977,
    disponivel: false,
    genero: "Romance",
    isbn: "978-85-325-0611-1",
  },
  {
    id: 8,
    titulo: "Vidas Secas",
    autor: "Graciliano Ramos",
    ano: 1938,
    disponivel: true,
    genero: "Ficção",
    isbn: "978-85-7232-006-0",
  },
];

export const clientesMockados: Cliente[] = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@email.com", cpf: "111.111.111-11", telefone: "(11) 91111-1111", data_nascimento: "1995-03-15", sexo: "F" },
  { id: 2, nome: "Carlos Oliveira", email: "carlos.oliveira@email.com", cpf: "222.222.222-22", telefone: "(11) 92222-2222", data_nascimento: "1988-07-22", sexo: "M" },
  { id: 3, nome: "Beatriz Santos", email: "beatriz.santos@email.com", cpf: "333.333.333-33", telefone: "(11) 93333-3333", data_nascimento: "2000-11-08", sexo: "F" },
  { id: 4, nome: "Pedro Souza", email: "pedro.souza@email.com", cpf: "444.444.444-44", telefone: "(11) 94444-4444", data_nascimento: "1992-01-30", sexo: "M" },
  { id: 5, nome: "Mariana Costa", email: "mariana.costa@email.com", cpf: "555.555.555-55", telefone: "(11) 95555-5555", data_nascimento: "1998-06-12", sexo: "F" },
  { id: 6, nome: "Lucas Ferreira", email: "lucas.ferreira@email.com", cpf: "666.666.666-66", telefone: "(11) 96666-6666", data_nascimento: "1985-09-25", sexo: "M" },
  { id: 7, nome: "Julia Mendes", email: "julia.mendes@email.com", cpf: "777.777.777-77", telefone: "(11) 97777-7777", data_nascimento: "2002-04-03", sexo: "F" },
  { id: 8, nome: "Rafael Lima", email: "rafael.lima@email.com", cpf: "888.888.888-88", telefone: "(11) 98888-8888", data_nascimento: "1990-12-18", sexo: "M" },
];

// ─── Empréstimos expandidos para cruzamento de dados ────────────────
// Distribuição variada entre sexos e gêneros literários no trimestre atual

export const emprestimosMockados: Emprestimo[] = [
  // ─── Empréstimos do trimestre (jan-mar 2026) ──────────────────────
  {
    id: 1,
    dataEmprestimo: "2026-01-05",
    dataPrevistaDevolucao: "2026-01-12",
    dataDevolucao: "2026-01-11",
    livro: livrosMockados[0], // Dom Casmurro — Romance
    cliente: clientesMockados[0], // Ana (F)
  },
  {
    id: 2,
    dataEmprestimo: "2026-01-10",
    dataPrevistaDevolucao: "2026-01-17",
    dataDevolucao: "2026-01-16",
    livro: livrosMockados[1], // Grande Sertão — Aventura
    cliente: clientesMockados[1], // Carlos (M)
  },
  {
    id: 3,
    dataEmprestimo: "2026-01-15",
    dataPrevistaDevolucao: "2026-01-22",
    dataDevolucao: "2026-01-20",
    livro: livrosMockados[2], // Memórias Póstumas — Romance
    cliente: clientesMockados[2], // Beatriz (F)
  },
  {
    id: 4,
    dataEmprestimo: "2026-02-01",
    dataPrevistaDevolucao: "2026-02-08",
    dataDevolucao: "2026-02-07",
    livro: livrosMockados[0], // Dom Casmurro — Romance
    cliente: clientesMockados[4], // Mariana (F)
  },
  {
    id: 5,
    dataEmprestimo: "2026-02-05",
    dataPrevistaDevolucao: "2026-02-12",
    dataDevolucao: "2026-02-12",
    livro: livrosMockados[3], // O Cortiço — Ficção
    cliente: clientesMockados[3], // Pedro (M)
  },
  {
    id: 6,
    dataEmprestimo: "2026-02-10",
    dataPrevistaDevolucao: "2026-02-17",
    dataDevolucao: "2026-02-15",
    livro: livrosMockados[5], // Capitães da Areia — Ficção
    cliente: clientesMockados[6], // Julia (F)
  },
  {
    id: 7,
    dataEmprestimo: "2026-02-18",
    dataPrevistaDevolucao: "2026-02-25",
    dataDevolucao: "2026-02-24",
    livro: livrosMockados[1], // Grande Sertão — Aventura
    cliente: clientesMockados[5], // Lucas (M)
  },
  {
    id: 8,
    dataEmprestimo: "2026-03-01",
    dataPrevistaDevolucao: "2026-03-08",
    dataDevolucao: "2026-03-07",
    livro: livrosMockados[6], // A Hora da Estrela — Romance
    cliente: clientesMockados[0], // Ana (F)
  },
  {
    id: 9,
    dataEmprestimo: "2026-03-03",
    dataPrevistaDevolucao: "2026-03-10",
    dataDevolucao: "2026-03-09",
    livro: livrosMockados[4], // Iracema — Aventura
    cliente: clientesMockados[7], // Rafael (M)
  },
  {
    id: 10,
    dataEmprestimo: "2026-03-05",
    dataPrevistaDevolucao: "2026-03-12",
    dataDevolucao: "2026-03-10",
    livro: livrosMockados[2], // Memórias Póstumas — Romance
    cliente: clientesMockados[4], // Mariana (F)
  },
  {
    id: 11,
    dataEmprestimo: "2026-03-10",
    dataPrevistaDevolucao: "2026-03-17",
    dataDevolucao: "2026-03-16",
    livro: livrosMockados[7], // Vidas Secas — Ficção
    cliente: clientesMockados[1], // Carlos (M)
  },
  {
    id: 12,
    dataEmprestimo: "2026-03-15",
    dataPrevistaDevolucao: "2026-03-22",
    dataDevolucao: "2026-03-20",
    livro: livrosMockados[0], // Dom Casmurro — Romance
    cliente: clientesMockados[6], // Julia (F)
  },
  // ─── Empréstimos do trimestre atual (abr 2026) ────────────────────
  {
    id: 13,
    dataEmprestimo: "2026-04-01",
    dataPrevistaDevolucao: "2026-04-08",
    dataDevolucao: "2026-04-07",
    livro: livrosMockados[1], // Grande Sertão — Aventura
    cliente: clientesMockados[2], // Beatriz (F)
  },
  {
    id: 14,
    dataEmprestimo: "2026-04-05",
    dataPrevistaDevolucao: "2026-04-12",
    dataDevolucao: null,
    livro: livrosMockados[4], // Iracema — Aventura
    cliente: clientesMockados[3], // Pedro (M)
  },
  {
    id: 15,
    dataEmprestimo: "2026-04-08",
    dataPrevistaDevolucao: "2026-04-15",
    dataDevolucao: null,
    livro: livrosMockados[6], // A Hora da Estrela — Romance
    cliente: clientesMockados[0], // Ana (F)
  },
  {
    id: 16,
    dataEmprestimo: "2026-04-10",
    dataPrevistaDevolucao: "2026-04-17",
    dataDevolucao: null,
    livro: livrosMockados[1], // Grande Sertão — Aventura
    cliente: clientesMockados[5], // Lucas (M)
  },
];

export const ticketsMockados: Ticket[] = [
  {
    id: 1,
    titulo: "Erro ao fazer login",
    categoria: "BUG",
    prioridade: "ALTA",
    status: "ABERTO",
    descricao: "Não consigo fazer login, recebo erro 500.",
    dataCriacao: "2026-04-01T10:00:00Z",
  },
  {
    id: 2,
    titulo: "Sugestão de tema escuro",
    categoria: "SUGESTAO",
    prioridade: "BAIXA",
    status: "CONCLUIDO",
    descricao: "Seria bom ter um tema escuro para a noite.",
    dataCriacao: "2026-04-02T15:30:00Z",
    resposta: "Implementado na versão mais recente.",
  },
];

export const funcionariosMockados: Funcionario[] = [
  {
    id: 1,
    nome: "Admin Suporte",
    username: "admin_bitech202601",
    email: "suporte@bibliotech.com",
    senha: "Sup0rt3!",
    cargo: "Suporte",
    ativo: true,
  },
];