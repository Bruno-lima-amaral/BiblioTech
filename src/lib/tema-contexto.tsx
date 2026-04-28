"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Tema = "light" | "dark";

interface TemaContexto {
  tema: Tema;
  alternarTema: () => void;
}

const TemaCtx = createContext<TemaContexto>({
  tema: "light",
  alternarTema: () => {},
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("light");
  const [montado, setMontado] = useState(false);

  // Ler preferência salva ao montar (padrão: claro)
  useEffect(() => {
    const salvo = localStorage.getItem("bibliotech-tema") as Tema | null;
    if (salvo === "dark" || salvo === "light") {
      setTema(salvo);
    }
    setMontado(true);
  }, []);

  // Aplicar a classe no <html>
  useEffect(() => {
    const root = document.documentElement;
    if (tema === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [tema]);

  const alternarTema = useCallback(() => {
    setTema((prev) => {
      const novo = prev === "dark" ? "light" : "dark";
      localStorage.setItem("bibliotech-tema", novo);
      return novo;
    });
  }, []);

  // Evitar flash de tema errado no SSR
  if (!montado) {
    return null;
  }

  return (
    <TemaCtx.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaCtx.Provider>
  );
}

export function useTema() {
  return useContext(TemaCtx);
}
