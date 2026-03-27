# 📚 Sistema de Gestão de Biblioteca - Front-end

Este projeto é uma aplicação Full Stack completa em conjunto com o repositório " https://github.com/Bruno-lima-amaral/Projeto_Gestao_Biblioteca_Back_end.git "desenvolvida para a disciplina de Programação Orientada a Objetos (POO). O sistema permite o gerenciamento do acervo, dos clientes, controle de empréstimos em tempo real e um **novo módulo de tickets de suporte**, com persistência de dados em banco relacional e integração de envio de e-mails.

## 🚀 Funcionalidades Principais

- **Gestão de Acervo:** CRUD completo de livros com controle automático de disponibilidade.
- **Gestão de Clientes:** Cadastro e manutenção dos usuários e frequentadores da biblioteca.
- **Controle de Empréstimos:** Registro de saídas e devoluções vinculando clientes e livros, alterando o status do acervo instantaneamente no sistema.
- **Módulo de Suporte (Tickets):** 🆕
  - Sistema de Kanban para gerenciamento de solicitações de suporte.
  - Controle de status de ticket (ABERTO, EM ANÁLISE, CONCLUÍDO, CANCELADO) com atualização via interface.
  - Resolução de tickets diretamente pela plataforma com adição de texto de resposta.
- **Envio de Relatórios por E-mail:** 🆕
  - Geração de relatório de tickets pendentes/abertos disparado pela interface do sistema.
  - Integração implementada utilizando a API RESTful do Resend para envio contornando bloqueios comuns de portas SMTP.
- **Interface Moderna:** Dashboard responsivo de alta qualidade com tema escuro (Dark Mode) utilizando os padrões de design do Shadcn/UI.

## 🛠️ Tecnologias e Dependências

### Front-end
- **Framework:** Next.js 16.2.0 (App Router)
- **Biblioteca Base:** React 19.2.4 & React DOM
- **Estilização:** Tailwind CSS v4 (com `@tailwindcss/postcss`) e `tw-animate-css`
- **Componentes Acessíveis:** Shadcn/UI, `@base-ui/react` e `lucide-react` para iconografia
- **Gerenciamento de Estado/Comunicação:** React Context API & Fetch API (comunicação em tempo real com o backend hospedado no Railway)
- **Ferramentas e Utils:** TypeScript, `clsx`, `tailwind-merge`

### Back-end (API REST)
- **Linguagem:** Java 21
- **Framework Principal:** Spring Boot 3.4
- **ORM:** Spring Data JPA (Hibernate)
- **Integração de E-mails:** Resend API (via HTTP/Client JSON em Java)
- **Segurança:** Configurações de CORS habilitadas para garantir a integração segura e transparente com o Front-end.

### Banco de Dados
- **Tipo:** Relacional (SQL)
- **Engine:** MySQL 8.0
- **Modelagem:** Relacionamentos avançados (como `@ManyToOne`) para vincular domínios da aplicação, como tickets a contas, e o controle intrínseco de empréstimos.

## 🔧 Como rodar o projeto localmente

### 1. Configurar o Back-end
1. Certifique-se de ter o **MySQL** devidamente instalado e rodando.
2. No arquivo `src/main/resources/application.properties`, ajuste as credenciais (usuário e senha) apontando para o seu banco local de desenvolvimento. Se for testar envios de e-mail, garanta que a chave da API do Resend esteja configurada no ambiente.
3. Execute a classe alvo `BibliotecaApplication` através da sua IDE preferida (IntelliJ, Eclipse) ou com ferramentas de build como Maven.

### 2. Configurar o Front-end
1. Navegue pelo terminal até a pasta raiz do frontend (`biblioteca`).
2. Instale as dependências executando:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento local:
   ```bash
   npm run dev
   ```
4. Por fim, visualize a aplicação pelo navegador acessando: `http://localhost:3000`.

---
👨‍💻 **Autores:**
- **Bruno Lima Amaral** - Estudante de Ciência da Computação - 4º Semestre
- **Pedro Henrique Rodrigues dos Santos** - Estudante de Ciência da Computação - 4º Semestre
