import * as XLSX from "xlsx";
import type { Livro, Cliente, Emprestimo } from "@/lib/dados-mockados";
import { calcularIdade } from "@/lib/dados-mockados";

// ─── Exportar Clientes ──────────────────────────────────────────────

export function exportarClientes(clientes: Cliente[]) {
  const dados = clientes.map((c) => ({
    ID: c.id,
    Nome: c.nome,
    "E-mail": c.email,
    CPF: c.cpf,
    Telefone: c.telefone,
    "Data de Nascimento": c.data_nascimento,
    Idade: calcularIdade(c.data_nascimento),
    Sexo: c.sexo === "F" ? "Feminino" : "Masculino",
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Clientes");
  XLSX.writeFile(wb, "bibliotech_clientes.xlsx");
}

// ─── Exportar Acervo ────────────────────────────────────────────────

export function exportarAcervo(livros: Livro[]) {
  const dados = livros.map((l) => ({
    ID: l.id,
    Título: l.titulo,
    Autor: l.autor,
    Ano: l.ano,
    Gênero: l.genero,
    ISBN: l.isbn,
    Status: l.disponivel ? "Disponível" : "Emprestado",
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Acervo");
  XLSX.writeFile(wb, "bibliotech_acervo.xlsx");
}

// ─── Exportar Empréstimos ───────────────────────────────────────────

export function exportarEmprestimos(emprestimos: Emprestimo[]) {
  const dados = emprestimos.map((e) => ({
    ID: e.id,
    Livro: e.livro.titulo,
    "Autor do Livro": e.livro.autor,
    "Gênero do Livro": e.livro.genero,
    Cliente: e.cliente.nome,
    "Sexo do Cliente": e.cliente.sexo === "F" ? "Feminino" : "Masculino",
    "Data do Empréstimo": e.dataEmprestimo,
    "Devolução Prevista": e.dataPrevistaDevolucao,
    "Data de Devolução": e.dataDevolucao || "Pendente",
    Status: e.dataDevolucao ? "Devolvido" : "Em andamento",
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Empréstimos");
  XLSX.writeFile(wb, "bibliotech_emprestimos.xlsx");
}

// ─── Exportar Dashboard (múltiplas abas) ────────────────────────────

export function exportarDashboard(
  clientes: Cliente[],
  livros: Livro[],
  emprestimos: Emprestimo[]
) {
  const wb = XLSX.utils.book_new();

  // Aba 1: Resumo
  const resumo = [
    { Métrica: "Total de Livros", Valor: livros.length },
    { Métrica: "Livros Disponíveis", Valor: livros.filter((l) => l.disponivel).length },
    { Métrica: "Livros Emprestados", Valor: livros.filter((l) => !l.disponivel).length },
    { Métrica: "Total de Clientes", Valor: clientes.length },
    { Métrica: "Total de Empréstimos", Valor: emprestimos.length },
    { Métrica: "Empréstimos Ativos", Valor: emprestimos.filter((e) => !e.dataDevolucao).length },
    { Métrica: "Empréstimos Devolvidos", Valor: emprestimos.filter((e) => e.dataDevolucao).length },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumo), "Resumo");

  // Aba 2: Clientes
  const dadosClientes = clientes.map((c) => ({
    ID: c.id,
    Nome: c.nome,
    "E-mail": c.email,
    CPF: c.cpf,
    Telefone: c.telefone,
    Idade: calcularIdade(c.data_nascimento),
    Sexo: c.sexo === "F" ? "Feminino" : "Masculino",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosClientes), "Clientes");

  // Aba 3: Acervo
  const dadosLivros = livros.map((l) => ({
    ID: l.id,
    Título: l.titulo,
    Autor: l.autor,
    Ano: l.ano,
    Gênero: l.genero,
    ISBN: l.isbn,
    Status: l.disponivel ? "Disponível" : "Emprestado",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosLivros), "Acervo");

  // Aba 4: Empréstimos
  const dadosEmp = emprestimos.map((e) => ({
    ID: e.id,
    Livro: e.livro.titulo,
    Cliente: e.cliente.nome,
    "Sexo Cliente": e.cliente.sexo === "F" ? "Feminino" : "Masculino",
    "Gênero Livro": e.livro.genero,
    "Data Empréstimo": e.dataEmprestimo,
    "Devolução Prevista": e.dataPrevistaDevolucao,
    "Data Devolução": e.dataDevolucao || "Pendente",
    Status: e.dataDevolucao ? "Devolvido" : "Em andamento",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosEmp), "Empréstimos");

  XLSX.writeFile(wb, "bibliotech_dashboard.xlsx");
}
