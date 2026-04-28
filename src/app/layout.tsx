import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BibliotecaProvider } from "@/lib/biblioteca-contexto";
import { TemaProvider } from "@/lib/tema-contexto";
import LayoutInterno from "@/components/layout-interno";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <TemaProvider>
          <BibliotecaProvider>
            <LayoutInterno>{children}</LayoutInterno>
          </BibliotecaProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
