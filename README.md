Seu README já está bom, mas está um pouco desatualizado em relação ao que você implementou (feed, curtidas, comentários, upload de avatar, recuperação de senha por e-mail, etc.) e ainda possui funcionalidades marcadas como "em desenvolvimento" que já existem.

Segue uma versão mais profissional e atualizada.

<div align="center">

# CashBattle

### Plataforma Gamificada de Educação Financeira

Controle suas finanças, alcance metas, evolua através de conquistas e transforme sua organização financeira em uma experiência motivadora.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

</div>

---

# Sobre

O **CashBattle** é uma plataforma de finanças pessoais baseada em gamificação, desenvolvida para incentivar hábitos financeiros saudáveis por meio de desafios, objetivos, recompensas e acompanhamento da evolução do usuário.

O sistema permite registrar movimentações financeiras, acompanhar metas de economia, visualizar estatísticas e evoluir através de um sistema de XP, níveis, conquistas e interações sociais.

Arquitetura do projeto:

* Frontend em React + Vite
* Backend em Node.js + Express
* PostgreSQL
* Docker

---

# Funcionalidades

## Autenticação

* Cadastro de usuários
* Login com JWT
* Recuperação de senha por e-mail
* Redefinição de senha
* Sessão persistente
* Proteção de rotas privadas

---

## Dashboard

* Saldo disponível
* Receitas
* Despesas
* Economia acumulada
* Objetivo mensal
* Barra de progresso
* XP
* Nível
* Streak
* Navegação rápida

---

## Perfil

* Upload de avatar
* Remover foto
* Avatar padrão
* Editar perfil
* Alterar senha
* XP
* Nível
* Streak
* Objetivos ativos
* Conquistas

---

## Transações

Gerenciamento completo de:

* Receitas
* Despesas
* Economias

Cada movimentação possui:

* Valor
* Categoria
* Descrição
* Data
* Objetivo associado (opcional)

Também é possível:

* Pesquisar
* Editar
* Excluir
* Filtrar por categoria

---

## Objetivos Financeiros

* Criar objetivo
* Editar
* Excluir
* Adicionar progresso
* Barra de progresso
* Categorias

O progresso é atualizado automaticamente quando uma economia é vinculada ao objetivo.

---

## Feed

Sistema de atividades financeiras contendo:

* Histórico de ações
* Curtidas
* Comentários
* Compartilhamento
* Atualização automática

Eventos registrados:

* Nova receita
* Novo gasto
* Economia registrada
* Objetivo criado
* Objetivo concluído
* Conquistas
* Evolução do usuário

---

## Gamificação

* XP
* Sistema de níveis
* Streak
* Objetivos
* Conquistas
* Modos de competição

---

# Tecnologias

## Frontend

* React
* React Router DOM
* Axios
* Lucide React
* CSS3
* Vite

## Backend

* Node.js
* Express
* JWT
* bcrypt
* Multer
* Resend
* PostgreSQL

## Banco de Dados

* PostgreSQL
* Docker

---

# Estrutura do Projeto

```text
CashBattle
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── uploads
│   │   └── utils
│   └── ...
│
├── Frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   └── ...
│
└── README.md
```

---

# Banco de Dados

Principais entidades:

* Users
* Transactions
* Goals
* Feed
* FeedLikes
* FeedComments
* Achievements

Relacionamento simplificado:

```text
Users
├── Transactions
├── Goals
├── Feed
├── FeedLikes
├── FeedComments
└── Achievements
```

---

# Instalação

## Clonar

```bash
git clone https://github.com/AxioDevStudio/CashBattle.git

cd CashBattle
```

---

## Backend

```bash
cd Backend
npm install
```

Configure o arquivo `.env`:

```env
PORT=3001

JWT_SECRET=your_secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashbattle
DB_USER=postgres
DB_PASSWORD=password

RESEND_API_KEY=your_key
EMAIL_FROM=onboarding@resend.dev
FRONTEND_URL=http://localhost:5173
```

Execute:

```bash
npm run dev
```

---

## Frontend

```bash
cd Frontend

npm install
npm run dev
```

---

## Banco de Dados

```bash
docker compose up -d
```

ou

```bash
docker start cashbattle_db
```

---

# Roadmap

## Financeiro

* Histórico avançado
* Parcelamentos
* Cartões de crédito
* Investimentos
* Relatórios
* Exportação de dados

## Objetivos

* Prioridades
* Datas limite
* Objetivos compartilhados

## Gamificação

* Missões diárias
* Missões semanais
* Loja de recompensas
* Medalhas especiais
* Avatares desbloqueáveis

## Social

* Amigos
* Ranking global
* Ranking semanal
* Desafios
* Grupos

## Dashboard

* Gráficos financeiros
* Evolução mensal
* Gastos por categoria
* Insights inteligentes

## Inteligência Artificial

* Classificação automática de gastos
* Sugestões de economia
* Recomendações financeiras
* Assistente financeiro

---

# Status

| Funcionalidade          | Status |
| ----------------------- | :----: |
| Autenticação            |    ✅   |
| Recuperação de senha    |    ✅   |
| Dashboard               |    ✅   |
| Perfil                  |    ✅   |
| Upload de avatar        |    ✅   |
| Receitas                |    ✅   |
| Despesas                |    ✅   |
| Economias               |    ✅   |
| Objetivos               |    ✅   |
| Feed                    |    ✅   |
| Curtidas                |    ✅   |
| Comentários             |    ✅   |
| Sistema de XP           |    ✅   |
| Conquistas              |   🟡   |
| Ranking                 |   🟡   |
| Amigos                  |   🔜   |
| Desafios                |   🔜   |
| Inteligência Artificial |   🔜   |
