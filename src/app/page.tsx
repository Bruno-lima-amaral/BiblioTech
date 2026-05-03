"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, ClipboardList, TrendingUp, FileSpreadsheet } from "lucide-react";
import { useBiblioteca } from "@/lib/biblioteca-contexto";
import { calcularIdade } from "@/lib/dados-mockados";
import { exportarDashboard } from "@/lib/exportar-excel";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Registra os componentes do Chart.js necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Definição das faixas etárias
const FAIXAS_ETARIAS = [
  { label: "18–25", min: 18, max: 25 },
  { label: "26–35", min: 26, max: 35 },
  { label: "36–50", min: 36, max: 50 },
  { label: "50+", min: 51, max: 200 },
];

export default function PaginaInicial() {
  const { livros, clientes, emprestimos } = useBiblioteca();

  // ─── Estado do filtro de gênero no gráfico de sexo ────────────────
  const [filtroGenero, setFiltroGenero] = useState("TODOS");

  // ─── Cards de estatísticas ────────────────────────────────────────
  const estatisticas = [
    {
      titulo: "Total de Livros",
      valor: livros.length,
      icone: BookOpen,
      cor: "from-blue-500/20 to-blue-600/5",
      corIcone: "text-blue-400",
      corBorda: "border-blue-500/20",
      hoverBorda: "hover:border-blue-500/40",
      href: "/acervo",
    },
    {
      titulo: "Clientes Cadastrados",
      valor: clientes.length,
      icone: Users,
      cor: "from-emerald-500/20 to-emerald-600/5",
      corIcone: "text-emerald-400",
      corBorda: "border-emerald-500/20",
      hoverBorda: "hover:border-emerald-500/40",
      href: "/clientes",
    },
    {
      titulo: "Empréstimos Ativos",
      valor: emprestimos.filter((e) => e.dataDevolucao === null).length,
      icone: ClipboardList,
      cor: "from-amber-500/20 to-amber-600/5",
      corIcone: "text-amber-400",
      corBorda: "border-amber-500/20",
      hoverBorda: "hover:border-amber-500/40",
      href: "/emprestimos",
    },
    {
      titulo: "Livros Disponíveis",
      valor: livros.filter((l) => l.disponivel).length,
      icone: TrendingUp,
      cor: "from-violet-500/20 to-violet-600/5",
      corIcone: "text-violet-400",
      corBorda: "border-violet-500/20",
      hoverBorda: "hover:border-violet-500/40",
      href: "/acervo",
    },
  ];

  // ─── Lista de gêneros únicos para o filtro ────────────────────────
  const generosUnicos = useMemo(() => {
    const set = new Set<string>();
    emprestimos.forEach((e) => set.add(e.livro.genero));
    return Array.from(set).sort();
  }, [emprestimos]);

  // ─── Cruzamento de dados: Preferência por Sexo (COM FILTRO) ───────
  const { dadosPorSexo, generosGrafico, insightSexo } = useMemo(() => {
    // Filtra empréstimos pelo gênero selecionado
    const empFiltrados =
      filtroGenero === "TODOS"
        ? emprestimos
        : emprestimos.filter((e) => e.livro.genero === filtroGenero);

    const generosSet = new Set<string>();
    empFiltrados.forEach((e) => generosSet.add(e.livro.genero));
    const generos = Array.from(generosSet).sort();

    const contagem: Record<string, { M: number; F: number }> = {};
    generos.forEach((g) => (contagem[g] = { M: 0, F: 0 }));

    empFiltrados.forEach((e) => {
      const genero = e.livro.genero;
      const sexo = e.cliente.sexo;
      if (contagem[genero]) {
        contagem[genero][sexo]++;
      }
    });

    const dadosM = generos.map((g) => contagem[g].M);
    const dadosF = generos.map((g) => contagem[g].F);

    // Gera insight textual
    let maiorDiff = 0;
    let insightSexo = "";
    generos.forEach((g) => {
      const diff = contagem[g].F - contagem[g].M;
      if (Math.abs(diff) > Math.abs(maiorDiff)) {
        maiorDiff = diff;
        const total = contagem[g].F + contagem[g].M;
        if (total > 0) {
          const percentual = Math.round(
            (Math.abs(diff) / Math.min(contagem[g].M || 1, contagem[g].F || 1)) * 100
          );
          if (diff > 0) {
            insightSexo = `Clientes do sexo feminino alugaram ${percentual}% mais livros de ${g} que o sexo masculino.`;
          } else if (diff < 0) {
            insightSexo = `Clientes do sexo masculino alugaram ${percentual}% mais livros de ${g} que o sexo feminino.`;
          }
        }
      }
    });

    if (!insightSexo) {
      insightSexo = "Distribuição equilibrada entre os sexos nos empréstimos.";
    }

    return {
      dadosPorSexo: { dadosM, dadosF },
      generosGrafico: generos,
      insightSexo,
    };
  }, [emprestimos, filtroGenero]);

  // ─── Cruzamento de dados: Gênero em Alta no Trimestre ─────────────
  const { dadosTrimestre, generoEmAlta, totalEmAlta } = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const inicioTrimestre = mesAtual - (mesAtual % 3);
    const anoAtual = hoje.getFullYear();
    const dataInicioTrimestre = new Date(anoAtual, inicioTrimestre, 1);

    const empTrimestre = emprestimos.filter((e) => {
      const dataEmp = new Date(e.dataEmprestimo);
      return dataEmp >= dataInicioTrimestre;
    });

    const contagem: Record<string, number> = {};
    empTrimestre.forEach((e) => {
      const g = e.livro.genero;
      contagem[g] = (contagem[g] || 0) + 1;
    });

    const generosTrimestre = Object.keys(contagem).sort();
    const valores = generosTrimestre.map((g) => contagem[g]);

    let generoEmAlta = "";
    let totalEmAlta = 0;
    generosTrimestre.forEach((g) => {
      if (contagem[g] > totalEmAlta) {
        totalEmAlta = contagem[g];
        generoEmAlta = g;
      }
    });

    return {
      dadosTrimestre: { labels: generosTrimestre, dados: valores },
      generoEmAlta,
      totalEmAlta,
    };
  }, [emprestimos]);

  // ─── NOVO: Preferência de Gênero por Faixa Etária ────────────────
  const { dadosFaixaEtaria, generosTopFaixa } = useMemo(() => {
    // Descobre os gêneros mais populares (top 4 para o gráfico não ficar poluído)
    const contagemGeral: Record<string, number> = {};
    emprestimos.forEach((e) => {
      const g = e.livro.genero;
      contagemGeral[g] = (contagemGeral[g] || 0) + 1;
    });
    const generosOrdenados = Object.entries(contagemGeral)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([g]) => g);

    // Monta a contagem por faixa etária x gênero
    const contagem: Record<string, Record<string, number>> = {};
    FAIXAS_ETARIAS.forEach((faixa) => {
      contagem[faixa.label] = {};
      generosOrdenados.forEach((g) => {
        contagem[faixa.label][g] = 0;
      });
    });

    emprestimos.forEach((e) => {
      const idade = calcularIdade(e.cliente.dataNascimento);
      const genero = e.livro.genero;
      if (!generosOrdenados.includes(genero)) return;

      const faixa = FAIXAS_ETARIAS.find((f) => idade >= f.min && idade <= f.max);
      if (faixa) {
        contagem[faixa.label][genero]++;
      }
    });

    return {
      dadosFaixaEtaria: contagem,
      generosTopFaixa: generosOrdenados,
    };
  }, [emprestimos]);

  // ─── Configuração dos gráficos ────────────────────────────────────

  const dadosGraficoSexo = {
    labels: generosGrafico,
    datasets: [
      {
        label: "Masculino",
        data: dadosPorSexo.dadosM,
        backgroundColor: "rgba(56, 189, 248, 0.6)",
        borderColor: "rgba(56, 189, 248, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Feminino",
        data: dadosPorSexo.dadosF,
        backgroundColor: "rgba(244, 114, 182, 0.6)",
        borderColor: "rgba(244, 114, 182, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const opcoesGraficoBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "rgba(255,255,255,0.7)", font: { size: 12 } },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 }, stepSize: 1 },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const coresDoughnut = [
    "rgba(139, 92, 246, 0.7)",
    "rgba(56, 189, 248, 0.7)",
    "rgba(244, 114, 182, 0.7)",
    "rgba(52, 211, 153, 0.7)",
    "rgba(251, 191, 36, 0.7)",
    "rgba(248, 113, 113, 0.7)",
  ];

  const dadosGraficoTrimestre = {
    labels: dadosTrimestre.labels,
    datasets: [
      {
        data: dadosTrimestre.dados,
        backgroundColor: coresDoughnut.slice(0, dadosTrimestre.labels.length),
        borderColor: "rgba(0,0,0,0.3)",
        borderWidth: 2,
      },
    ],
  };

  const opcoesGraficoTrimestre = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: "rgba(255,255,255,0.7)", font: { size: 12 }, padding: 16 },
      },
    },
  };

  // ─── Gráfico de Faixa Etária ──────────────────────────────────────

  const coresFaixa = [
    "rgba(139, 92, 246, 0.65)",
    "rgba(56, 189, 248, 0.65)",
    "rgba(244, 114, 182, 0.65)",
    "rgba(52, 211, 153, 0.65)",
  ];

  const dadosGraficoFaixaEtaria = {
    labels: FAIXAS_ETARIAS.map((f) => f.label),
    datasets: generosTopFaixa.map((genero, i) => ({
      label: genero,
      data: FAIXAS_ETARIAS.map((faixa) => dadosFaixaEtaria[faixa.label][genero] || 0),
      backgroundColor: coresFaixa[i % coresFaixa.length],
      borderColor: coresFaixa[i % coresFaixa.length].replace("0.65", "1"),
      borderWidth: 1,
      borderRadius: 4,
    })),
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho com botão de exportar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Painel de Controle
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visão geral do Sistema de Gerenciamento de Biblioteca.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          onClick={() => exportarDashboard(clientes, livros, emprestimos)}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Exportar para Excel
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {estatisticas.map((item) => {
          const Icone = item.icone;
          return (
            <Link
              key={item.titulo}
              href={item.href}
              className={`group relative overflow-hidden rounded-xl border ${item.corBorda} bg-gradient-to-br ${item.cor} p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${item.hoverBorda}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.titulo}
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">
                    {item.valor}
                  </p>
                </div>
                <div className={`rounded-xl bg-background/50 p-3 ${item.corIcone}`}>
                  <Icone className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ─── Gráficos de Cruzamento de Dados ──────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Preferência por Sexo (COM FILTRO) */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Preferência por Sexo</h2>
              <p className="text-sm text-muted-foreground">
                Empréstimos por gênero literário, separados por sexo
              </p>
            </div>
            {/* Filtro de Gênero */}
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="h-9 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="TODOS" className="bg-popover text-popover-foreground">
                Todos os Gêneros
              </option>
              {generosUnicos.map((g) => (
                <option key={g} value={g} className="bg-popover text-popover-foreground">
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <Bar data={dadosGraficoSexo} options={opcoesGraficoBar} />
          </div>
          <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 px-4 py-3">
            <p className="text-sm text-pink-300 font-medium">📊 Insight</p>
            <p className="text-xs text-muted-foreground mt-1">{insightSexo}</p>
          </div>
        </div>

        {/* Gênero em Alta no Trimestre */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Gênero em Alta no Trimestre</h2>
            <p className="text-sm text-muted-foreground">
              Volume de empréstimos por gênero literário no trimestre atual
            </p>
          </div>
          <div className="h-64">
            <Doughnut data={dadosGraficoTrimestre} options={opcoesGraficoTrimestre} />
          </div>
          {generoEmAlta && (
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
              <p className="text-sm text-violet-300 font-medium">🔥 Destaque</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{generoEmAlta}</span> foi o gênero mais emprestado neste trimestre com{" "}
                <span className="font-semibold text-foreground">{totalEmAlta}</span> aluguéis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── NOVO: Gráfico de Faixa Etária x Gênero ─────────────── */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Preferência de Gênero por Faixa Etária</h2>
          <p className="text-sm text-muted-foreground">
            Volume de empréstimos dos gêneros mais populares, agrupados pela idade dos clientes
          </p>
        </div>
        <div className="h-72">
          <Bar data={dadosGraficoFaixaEtaria} options={opcoesGraficoBar} />
        </div>
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 px-4 py-3">
          <p className="text-sm text-sky-300 font-medium">📈 Análise</p>
          <p className="text-xs text-muted-foreground mt-1">
            Os gêneros mais populares são cruzados com a idade calculada de cada cliente via{" "}
            <code className="text-xs bg-muted/50 px-1 rounded">calcularIdade()</code>.
            Faixas: 18–25, 26–35, 36–50 e 50+.
          </p>
        </div>
      </div>

      {/* Empréstimos Recentes */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Empréstimos Recentes</h2>
        <div className="space-y-3">
          {emprestimos.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Nenhum empréstimo registrado.
            </p>
          ) : (
            emprestimos
              .slice(-5)
              .reverse()
              .map((emprestimo) => (
                <div
                  key={emprestimo.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{emprestimo.livro.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        Cliente: {emprestimo.cliente.nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(emprestimo.dataEmprestimo).toLocaleDateString("pt-BR")}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        emprestimo.dataDevolucao ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {emprestimo.dataDevolucao ? "Devolvido" : "Em andamento"}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
