<<<<<<< HEAD
=======
🇺🇸 [English](README.md) | 🇧🇷 [Português](README.pt.md)

>>>>>>> f6e94b9 (update `README`)
# 🐞 Bug Tracker

<div align="center">

<<<<<<< HEAD
[![English](https://img.shields.io/badge/lang-English-blue?style=flat-square)](README.md)

=======
>>>>>>> f6e94b9 (update `README`)
![Ruby on Rails](https://img.shields.io/badge/Ruby_on_Rails-8.x-CC0000?style=flat-square&logo=ruby-on-rails&logoColor=white)
![React](https://img.shields.io/badge/React-SPA-61DAFB?style=flat-square&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Licença](https://img.shields.io/badge/Licença-MIT-green?style=flat-square)

</div>

Sistema completo de gerenciamento e rastreamento de bugs. A aplicação é dividida em uma **API RESTful** construída com Ruby on Rails e uma **Single Page Application (SPA)** moderna em React.

---

## ✨ Funcionalidades

- **Dashboard Integrado** — Visão geral de todos os bugs: abertos, em andamento e resolvidos, com cards de métricas em tempo real.
- **Autenticação por Sessão** — Cadastro e login de usuários. A sessão persiste no navegador e identifica o usuário automaticamente ao abrir chamados e comentar.
- **Gerenciamento de Projetos** — Crie, edite e arquive projetos. Cada projeto funciona como um escopo isolado de acompanhamento de bugs.
- **Rastreamento de Bugs** — Cards detalhados com severidade (Baixa, Média, Alta, Crítica), status, reporter e responsável.
- **Comentários** — Sistema de discussão interno por bug, com contador de caracteres e identificação automática pelo usuário logado.
- **Atribuições** — Vincule usuários como *Reporter* e *Assignee* em cada chamado.
- **UI Responsiva** — Layout em CSS Grid, sidebar persistente e fixa, navegação em cascata com breadcrumb inteligente.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Backend | Ruby on Rails 8.x (modo API) |
| Banco de Dados | SQLite (`storage/development.sqlite3`) |
| CORS | `rack-cors` |
| Frontend | React.js (SPA) |
| Estilização | CSS-in-JS dinâmico |
| HTTP Client | Fetch API nativa |

---

## 🗄️ Modelo de Dados

```
Users ──────────────────────────────────────────────┐
  id, name, email, password, role                   │
                                                     │
Projects                                            │
  id, name, description, status                     │
    │                                               │
    └──► Bugs ◄──────────────────────────────────── ┘
           id, title, description                  reporter_id / assignee_id
           severity (low|medium|high|critical)
           status (open|in_progress|resolved|closed)
           project_id, reporter_id, assignee_id
             │
             └──► Comments
                    id, body, bug_id, user_id
```

---

## 🚀 Executando o Projeto

Você precisará de **dois terminais abertos** simultaneamente.

### 1. Backend (API Rails)

```bash
# Instale as dependências Ruby
bundle install

# Rode as migrações do banco de dados
bin/rails db:migrate

# Inicie o servidor na porta 3000
bin/rails server
```

> API disponível em `http://localhost:3000/api/v1`

### 2. Frontend (React)

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências Node
npm install

# Inicie o servidor de desenvolvimento
npm start
```

> Interface disponível em `http://localhost:3001`  
> O frontend já está configurado para consumir a API na porta `3000`.

---

## 📁 Estrutura do Projeto

```
/
├── app/
│   ├── controllers/api/v1/
│   │   ├── bugs_controller.rb
│   │   ├── comments_controller.rb
│   │   ├── projects_controller.rb
│   │   ├── sessions_controller.rb
│   │   └── users_controller.rb
│   └── models/
│       ├── bug.rb
│       ├── comment.rb
│       ├── project.rb
│       └── user.rb
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── BugCard.jsx
│   │   │   ├── BugForm.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── MetricCards.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── BugDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Projects.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
└── config/
    └── routes.rb
```

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/v1/login` | Autenticação do usuário |
| `GET` | `/api/v1/users` | Listar usuários |
| `POST` | `/api/v1/users` | Cadastrar usuário |
| `GET` | `/api/v1/projects` | Listar projetos |
| `POST` | `/api/v1/projects` | Criar projeto |
| `PUT` | `/api/v1/projects/:id` | Atualizar projeto |
| `DELETE` | `/api/v1/projects/:id` | Excluir projeto |
| `GET` | `/api/v1/bugs` | Listar bugs (aceita filtros) |
| `POST` | `/api/v1/bugs` | Criar bug |
| `PUT` | `/api/v1/bugs/:id` | Atualizar bug |
| `DELETE` | `/api/v1/bugs/:id` | Excluir bug |
| `GET` | `/api/v1/bugs/:id/comments` | Listar comentários |
| `POST` | `/api/v1/bugs/:id/comments` | Criar comentário |
| `DELETE` | `/api/v1/bugs/:bug_id/comments/:id` | Excluir comentário |

---

<div align="center">
Feito com dedicação para simplificar a organização de tarefas. 🚀
<br><br>
<a href="#-bug-tracker">⬆ Voltar ao topo</a>
</div>