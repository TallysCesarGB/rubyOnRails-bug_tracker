# 🐞 Bug Tracker

Este é um sistema completo de gerenciamento e rastreamento de Bugs (Bug Tracker). O projeto é dividido em uma API RESTful construída com **Ruby on Rails** no backend, e uma Single Page Application (SPA) moderna feita com **React** no frontend.

## ✨ Funcionalidades

- **Dashboard Integrado:** Visão geral de todos os bugs abertos, em andamento e resolvidos.
- **Gerenciamento de Projetos (CRUD):** Crie, edite e arquive projetos. Cada projeto funciona como um escopo isolado de acompanhamento.
- **Rastreamento de Bugs:** Crie cards detalhados associando-os a um projeto, severidade (Baixa, Média, Alta, Crítica) e acompanhe o status.
- **Comentários:** Sistema de discussão interno para cada bug registrado.
- **Atribuições:** Vincule usuários como "Relatores" (Reporters) e "Responsáveis" (Assignees).
- **Interface e UI Moderna:** Layout resposivo baseado em CSS Grid, sidebar persistente, navegação em cascata inteligente visando a melhor experiência (UX/UI).

---

## 🛠️ Tecnologias Utilizadas

**Backend (API)**
- Ruby on Rails 8.x (Modo API)
- Banco de Dados SQLite (`storage/development.sqlite3`)
- `rack-cors` (Permissão de recursos para o Frontend)

**Frontend (UI)**
- React.js
- Comunicação Fetch API Nativa
- Estilização in-JS dinâmica.

---

## 🚀 Como Executar o Projeto Localmente

Para rodar a aplicação simulando o ambiente completo, você precisará iniciar o servidor do Backend (Rails) e o servidor de desenvolvimento do Frontend (React) em **terminais separados**.

### 1. Inicializando a API (Backend)
No nível raiz do projeto, instale as gems e rode o banco de dados:

```bash
# Instale as dependências do Ruby
bundle install

# Crie e rode as migrações do banco de dados (SQLite)
bin/rails db:migrate

# Inicie o servidor (padrão em http://localhost:3000)
bin/rails server
```

### 2. Inicializando a Interface (Frontend)
Abra uma nova aba/janela do seu terminal, acesse a subpasta `/frontend` e instale as dependências JavaScript:

```bash
# Entre na pasta do frontend
cd frontend

# Instale os pacotes do Node
npm install

# Inicie o servidor frontend (padrão em http://localhost:3001 ou 3002)
npm start
```

A aplicação frontend deverá se abrir automaticamente no seu navegador. Se não, acesse a porta gerada (comumente `http://localhost:3001`). O frontend já está configurado para consumir os dados do backend rodando na porta `3000`.

---

## 🗄️ Estrutura do Banco de Dados

* **Users:** Tabela de usuários.
* **Projects:** Engloba escopos (ex: *App Mobile*, *API Core*, *Portal Web*).
* **Bugs:** Vinculados diretamente a um `Project`, a um `Reporter (User)` e opcionalmente a um `Assignee (User)`.
* **Comments:** Respostas/Comentários, que têm chave estrangeira obrigatória com um `Bug` e um `User`.

Feito com dedicação para simplificar a organização de tarefas. 🚀
