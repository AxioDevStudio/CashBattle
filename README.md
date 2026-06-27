<div align="center">

# CashBattle

### Plataforma de gamificação para educação financeira

Aplicação desenvolvida para auxiliar usuários no controle financeiro por meio de objetivos, desafios e mecânicas de gamificação.

</div>

---

# Visão Geral

O **CashBattle** é uma plataforma de finanças pessoais que une organização financeira e gamificação para incentivar hábitos saudáveis de economia.

A aplicação permite registrar receitas, despesas e valores economizados, acompanhar metas financeiras e visualizar a evolução do usuário através de indicadores como experiência (XP), níveis, conquistas e sequência de dias (streak).

O projeto é dividido em uma arquitetura cliente-servidor composta por:

- Frontend desenvolvido em React
- Backend desenvolvido em Node.js/Express
- Banco de dados PostgreSQL

---

# Funcionalidades Implementadas

## Autenticação

- Cadastro de usuários
- Login com autenticação JWT
- Recuperação de senha (interface)
- Persistência da sessão
- Proteção de rotas autenticadas

---

## Dashboard

- Visualização do saldo disponível
- Receita total
- Gastos acumulados
- Valor economizado
- Meta financeira mensal
- Barra de progresso da meta
- Saudação personalizada
- Navegação entre funcionalidades

---

## Transações

Cadastro de movimentações financeiras:

- Receita
- Despesa
- Economia

Cada registro possui:

- Valor
- Categoria
- Descrição
- Data
- Associação opcional com um objetivo financeiro

---

## Objetivos Financeiros

Gerenciamento de objetivos personalizados contendo:

- Nome
- Categoria
- Valor alvo
- Valor acumulado
- Barra de progresso

O progresso dos objetivos é atualizado automaticamente quando uma transação do tipo **economia** é vinculada ao objetivo.

---

## Perfil

- Informações pessoais
- Foto de perfil
- XP
- Nível
- Sequência de dias (Streak)
- Estatísticas gerais
- Objetivos ativos
- Conquistas desbloqueadas

---

## Sistema de Gamificação

Implementado:

- XP
- Sistema de níveis
- Conquistas
- Objetivos
- Sequência diária (Streak)
- Modos de competição

---

# Tecnologias Utilizadas

## Frontend

- React
- React Router
- Axios
- Lucide React
- CSS

## Backend

- Node.js
- Express
- JWT
- bcrypt
- PostgreSQL

## Banco de Dados

- PostgreSQL
- Docker

---

# Estrutura do Projeto

```
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
│   │   └── utils
│   └── ...
│
├── Frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   └── ...
│
└── README.md
```

---

# Banco de Dados

Atualmente o sistema utiliza as seguintes entidades:

- Users
- Transactions
- Goals

Relacionamento simplificado:

```
Users
 ├── Transactions
 └── Goals
      └── Transactions (Savings)
```

---

# Como Executar

## 1. Clonar o repositório

```bash
git clone https://github.com/AxioDevStudio/CashBattle.git
```

---

## 2. Backend

```bash
cd Backend
npm install
```

Configure o arquivo `.env`.

Exemplo:

```env
PORT=3001

JWT_SECRET=your_secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashbattle
DB_USER=postgres
DB_PASSWORD=password
```

Execute:

```bash
npm run dev
```

---

## 3. Frontend

```bash
cd Frontend

npm install
npm run dev
```

---

## 4. Banco de Dados

Inicie o container PostgreSQL:

```bash
docker compose up -d
```

ou

```bash
docker start cashbattle_db
```

---

# Funcionalidades em Desenvolvimento

## Financeiro

- Histórico completo de transações
- Edição de transações
- Exclusão de transações
- Parcelamentos
- Cartões de crédito
- Investimentos
- Relatórios
- Exportação de dados

---

## Objetivos

- Edição de objetivos
- Exclusão de objetivos
- Prioridades
- Datas limite
- Objetivos compartilhados

---

## Gamificação

- Missões diárias
- Missões semanais
- Sistema completo de XP
- Medalhas
- Loja de recompensas
- Avatares desbloqueáveis

---

## Social

- Sistema de amizades
- Rankings
- Desafios entre usuários
- Grupos
- Feed de atividades

---

## Dashboard

- Indicadores financeiros
- Gráficos
- Evolução mensal
- Gastos por categoria
- Recomendações inteligentes

---

## Inteligência Artificial

Planejado para versões futuras:

- Classificação automática de gastos
- Sugestões de economia
- Recomendações financeiras
- Assistente financeiro baseado em IA

---

# Roadmap

| Funcionalidade | Status |
|---------------|--------|
| Sistema de autenticação | Concluído |
| Dashboard inicial | Concluído |
| Cadastro de transações | Concluído |
| Objetivos financeiros | Concluído |
| Perfil do usuário | Concluído |
| Sistema inicial de gamificação | Concluído |
| Histórico financeiro | Em desenvolvimento |
| Rankings | Planejado |
| Sistema de amizades | Planejado |
| Missões | Planejado |
| Feed social | Planejado |
| Inteligência Artificial | Planejado |

