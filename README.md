# 📚 Sistema de Gestão de Biblioteca - Back-end

Essa branch é uma aplicação Front-end com dados Mockados, simulando o gerenciamento de um sistema de uma biblioteca.

## 🚀 Funcionalidades Principais

- **Gestão de Acervo**: CRUD completo de livros com controle de disponibilidade automática.
- **Gestão de Clientes**: Cadastro, edição, remoção e manutenção de usuários da biblioteca.
- **Controle de Empréstimos**: Registro de saídas com vínculo entre o cliente e o livro, alterando o status do acervo instantaneamente em tempo real.
- **Módulo de Suporte (Tickets)**:
  - Criação e acompanhamento de tickets (Kanban interativo).
  - Atualização automática de status (`ABERTO`, `EM_ANALISE`, `CONCLUIDO`) e níveis de prioridade.
  - Sistema de interações/respostas dentro dos cards de cada ticket.
  - **Relatórios por E-mail**: Geração de resumos de tickets pendentes/abertos, enviados automaticamente via e-mail utilizando a API Rest do Resend.
- **Interface Moderna e Intuitiva**: Dashboard amplamente responsivo com suporte a Dark Mode integrado, construído em cima de Shadcn/UI.

## 🛠️ Tecnologias e Dependências Utilizadas

### Front-end
- **Framework Core**: Next.js (App Router)
- **Estilização**: Tailwind CSS
- **Biblioteca de Componentes UI**: Shadcn/UI (Radix UI)
- **Ícones**: Lucide React
- **Estado e Integração HTTP**: React Context API e chamadas Fetch nativas.


## 🔧 Pré-requisitos e Instalação


###  Configurando o Front-end
1. Acesse o diretório do front-end (`/biblioteca`).
2. Realize a instalação de todos os pacotes das dependências do Node listados em `package.json`:
   ```bash
   npm install || npm.cmd install
   ```
3. Inicie o servidor Node de desenvolvimento:
   ```bash
   npm run dev || npm.cmd run dev
   ```
4. A aplicação agora estará disponível no seu navegador em `http://localhost:3000`.

## 👨‍💻 Autores

- **Bruno Lima Amaral** - Estudante de Engenharia/TI - 4º Semestre
- **Pedro Henrique Rodrigues dos Santos** - Estudante de Engenharia/TI - 4º Semestre

> *"Desenvolvido em uma maratona épica de código, superando desafios de integração e infraestrutura."*
