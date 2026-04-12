import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BarraLateral } from "@/components/barra-lateral";
import { BibliotecaProvider } from "@/lib/biblioteca-contexto";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiblioTech — Sistema de Gerenciamento de Biblioteca",
  description:
    "Sistema de gerenciamento de biblioteca para controle de acervo, clientes e empréstimos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <BibliotecaProvider>
          <BarraLateral />
          <main className="flex-1 w-full md:w-auto md:ml-64 min-h-screen p-4 md:p-8">{children}</main>
        </BibliotecaProvider>
      </body>
    </html>
  );
}
