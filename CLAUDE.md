# CLAUDE.md — Plataforma ENEM

Contexto do projeto para auxiliar agentes de IA a entender a estrutura, regras e decisões técnicas.

---

## Visão Geral

Plataforma de estudos voltada ao ENEM. Alunos podem visualizar e baixar provas e gabaritos em PDF organizados por ano ou tipo. Admins gerenciam o conteúdo do sistema.

---

## Arquitetura

O projeto é dividido em **dois repositórios Next.js separados**:

| Projeto | Responsabilidade | Hospedagem |
|---|---|---|
| `frontend` | Interface do usuário, autenticação com NextAuth v5 | Vercel |
| `backend` | API REST, acesso ao banco, upload de arquivos | Vercel |

A comunicação entre frontend e backend é feita via `fetch` usando a variável de ambiente `NEXT_PUBLIC_API_URL`.

---

## Stack

- **Framework:** Next.js (App Router) com TypeScript
- **Autenticação:** NextAuth v5 (Auth.js) com Credentials Provider — vive no frontend
- **Banco de dados:** PostgreSQL acessado via `pg` (pool de conexões em `src/lib/db.ts` no backend)
- **Armazenamento de arquivos:** Vercel Blob (PDFs de provas e gabaritos)
- **Gerenciador de pacotes:** pnpm
- **Estilização:** CSS Modules + Tailwind

---

## Variáveis de Ambiente

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=https://backend-tcc-one.vercel.app/api
AUTH_SECRET=                  # gerado com: openssl rand -base64 32
```

### Backend (`.env.local`)
```
DATABASE_URL=                 # string de conexão do PostgreSQL
BLOB_READ_WRITE_TOKEN=        # token do Vercel Blob — nunca expor no frontend
```

---

## Usuários e Níveis de Acesso

| Perfil | nivel | Permissões |
|---|---|---|
| Aluno | 1 | Visualizar e baixar provas e gabaritos |
| Admin | 2 | Tudo do aluno + adicionar provas, gabaritos e gerenciar conteúdo |

- Qualquer pessoa pode se cadastrar como aluno (cadastro aberto)
- Admins são definidos manualmente no banco alterando o campo `nivel`
- O `nivel` do usuário é salvo no token JWT da sessão e acessível via `session.user.nivel`

---

## Banco de Dados

### Tabela Usuario
```sql
CREATE TABLE Usuario (
    CodUsuario  SERIAL PRIMARY KEY,
    Nome        VARCHAR(255) NOT NULL,
    Email       VARCHAR(255) UNIQUE NOT NULL,
    Senha       TEXT NOT NULL,          -- armazenar com hash bcrypt
    Nivel       INT DEFAULT 1,          -- 1: aluno, 2: admin
    Pontos      INT DEFAULT 0,
    Foto_url    TEXT                    -- URL do Vercel Blob
);
```

### Tabela Prova
```sql
CREATE TABLE Prova (
    CodProva    SERIAL PRIMARY KEY,
    Titulo      VARCHAR(255) NOT NULL,
    Ano         INT,                    -- ex: 2023
    Tipo        VARCHAR(50),            -- 'oficial' ou 'simulado'
    Prova_url   TEXT NOT NULL,          -- URL do Vercel Blob
    Gabarito_url TEXT NOT NULL,         -- URL do Vercel Blob
    CriadoEm   TIMESTAMP DEFAULT NOW()
);
```

---

## Estrutura de Pastas

### Frontend
```
frontend/
├── auth.ts                  # configuração do NextAuth v5
├── middleware.ts            # proteção de rotas
├── next.config.ts
├── src/
│   └── app/
│       ├── api/
│       │   └── auth/
│       │       └── [...nextauth]/
│       │           └── route.ts   # handlers do NextAuth
│       ├── login/
│       │   └── page.tsx
│       ├── signup/
│       │   └── page.tsx
│       └── components/
│           ├── Input/
│           └── Button/
```

### Backend
```
backend/
├── middleware.ts            # headers CORS para todas as rotas /api/*
├── next.config.ts           # configuração de headers CORS
├── src/
│   ├── lib/
│   │   └── db.ts            # pool de conexão PostgreSQL
│   └── app/
│       └── api/
│           ├── auth/
│           │   └── login/
│           │       └── route.ts   # valida email e senha no banco
│           ├── Usuario/
│           │   └── route.ts       # GET e POST de usuários
│           ├── Prova/
│           │   └── route.ts       # GET e POST de provas
│           └── upload/
│               └── route.ts       # upload de arquivos para Vercel Blob
```

---

## CORS

O backend está hospedado em domínio diferente do frontend, por isso CORS é necessário. A solução usa `middleware.ts` no backend que adiciona os headers em todas as rotas `/api/*`:

```ts
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

Todas as API Routes do backend também exportam `OPTIONS` retornando status 200 com os mesmos headers.

---

## Autenticação

- NextAuth v5 com Credentials Provider (email e senha)
- O `authorize()` no `auth.ts` chama `POST /api/auth/login` no backend
- O backend valida as credenciais no banco e retorna o usuário
- O callback `jwt` salva `id` e `nivel` no token
- O callback `session` expõe `id` e `nivel` na sessão
- Rotas protegidas pelo `middleware.ts` do frontend
- Rotas públicas: `/`, `/login`, `/signup`

---

## Upload de Arquivos

- Arquivos enviados via `FormData` do frontend para o backend
- Backend usa `@vercel/blob` para fazer upload e receber a URL pública
- URL é salva no banco de dados
- `BLOB_READ_WRITE_TOKEN` fica apenas no backend — nunca expor no frontend

---

## Decisões Técnicas

- Senhas devem ser armazenadas com hash **bcrypt** — ainda não implementado
- `Content-Type` não deve ser definido manualmente em requisições com `FormData`
- Commits devem ser feitos pela conta GitHub dona do projeto na Vercel para evitar bloqueio de deploy
- Variáveis sem prefixo `NEXT_PUBLIC_` ficam apenas no servidor e nunca são expostas ao browser# CLAUDE.md — Plataforma ENEM

Contexto do projeto para auxiliar agentes de IA a entender a estrutura, regras e decisões técnicas.

---

## Visão Geral

Plataforma de estudos voltada ao ENEM. Alunos podem visualizar e baixar provas e gabaritos em PDF organizados por ano ou tipo. Admins gerenciam o conteúdo do sistema.

---

## Arquitetura

O projeto é dividido em **dois repositórios Next.js separados**:

| Projeto | Responsabilidade | Hospedagem |
|---|---|---|
| `frontend` | Interface do usuário, autenticação com NextAuth v5 | Vercel |
| `backend` | API REST, acesso ao banco, upload de arquivos | Vercel |

A comunicação entre frontend e backend é feita via `fetch` usando a variável de ambiente `NEXT_PUBLIC_API_URL`.

---

## Stack

- **Framework:** Next.js (App Router) com TypeScript
- **Autenticação:** NextAuth v5 (Auth.js) com Credentials Provider — vive no frontend
- **Banco de dados:** PostgreSQL acessado via `pg` (pool de conexões em `src/lib/db.ts` no backend)
- **Armazenamento de arquivos:** Vercel Blob (PDFs de provas e gabaritos)
- **Gerenciador de pacotes:** pnpm
- **Estilização:** CSS Modules + Tailwind

---

## Variáveis de Ambiente

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=https://backend-tcc-one.vercel.app/api
AUTH_SECRET=                  # gerado com: openssl rand -base64 32
```

### Backend (`.env.local`)
```
DATABASE_URL=                 # string de conexão do PostgreSQL
BLOB_READ_WRITE_TOKEN=        # token do Vercel Blob — nunca expor no frontend
```

---

## Usuários e Níveis de Acesso

| Perfil | nivel | Permissões |
|---|---|---|
| Aluno | 1 | Visualizar e baixar provas e gabaritos |
| Admin | 2 | Tudo do aluno + adicionar provas, gabaritos e gerenciar conteúdo |

- Qualquer pessoa pode se cadastrar como aluno (cadastro aberto)
- Admins são definidos manualmente no banco alterando o campo `nivel`
- O `nivel` do usuário é salvo no token JWT da sessão e acessível via `session.user.nivel`

---

## Banco de Dados

### Tabela Usuario
```sql
CREATE TABLE Usuario (
    CodUsuario  SERIAL PRIMARY KEY,
    Nome        VARCHAR(255) NOT NULL,
    Email       VARCHAR(255) UNIQUE NOT NULL,
    Senha       TEXT NOT NULL,          -- armazenar com hash bcrypt
    Nivel       INT DEFAULT 1,          -- 1: aluno, 2: admin
    Pontos      INT DEFAULT 0,
    Foto_url    TEXT                    -- URL do Vercel Blob
);
```

### Tabela Prova
```sql
CREATE TABLE Prova (
    CodProva    SERIAL PRIMARY KEY,
    Titulo      VARCHAR(255) NOT NULL,
    Ano         INT,                    -- ex: 2023
    Tipo        VARCHAR(50),            -- 'oficial' ou 'simulado'
    Prova_url   TEXT NOT NULL,          -- URL do Vercel Blob
    Gabarito_url TEXT NOT NULL,         -- URL do Vercel Blob
    CriadoEm   TIMESTAMP DEFAULT NOW()
);
```

---

## Estrutura de Pastas

### Frontend
```
frontend/
├── auth.ts                  # configuração do NextAuth v5
├── middleware.ts            # proteção de rotas
├── next.config.ts
├── src/
│   └── app/
│       ├── api/
│       │   └── auth/
│       │       └── [...nextauth]/
│       │           └── route.ts   # handlers do NextAuth
│       ├── login/
│       │   └── page.tsx
│       ├── signup/
│       │   └── page.tsx
│       └── components/
│           ├── Input/
│           └── Button/
```

### Backend
```
backend/
├── middleware.ts            # headers CORS para todas as rotas /api/*
├── next.config.ts           # configuração de headers CORS
├── src/
│   ├── lib/
│   │   └── db.ts            # pool de conexão PostgreSQL
│   └── app/
│       └── api/
│           ├── auth/
│           │   └── login/
│           │       └── route.ts   # valida email e senha no banco
│           ├── Usuario/
│           │   └── route.ts       # GET e POST de usuários
│           ├── Prova/
│           │   └── route.ts       # GET e POST de provas
│           └── upload/
│               └── route.ts       # upload de arquivos para Vercel Blob
```

---

## CORS

O backend está hospedado em domínio diferente do frontend, por isso CORS é necessário. A solução usa `middleware.ts` no backend que adiciona os headers em todas as rotas `/api/*`:

```ts
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

Todas as API Routes do backend também exportam `OPTIONS` retornando status 200 com os mesmos headers.

---

## Autenticação

- NextAuth v5 com Credentials Provider (email e senha)
- O `authorize()` no `auth.ts` chama `POST /api/auth/login` no backend
- O backend valida as credenciais no banco e retorna o usuário
- O callback `jwt` salva `id` e `nivel` no token
- O callback `session` expõe `id` e `nivel` na sessão
- Rotas protegidas pelo `middleware.ts` do frontend
- Rotas públicas: `/`, `/login`, `/signup`

---

## Upload de Arquivos

- Arquivos enviados via `FormData` do frontend para o backend
- Backend usa `@vercel/blob` para fazer upload e receber a URL pública
- URL é salva no banco de dados
- `BLOB_READ_WRITE_TOKEN` fica apenas no backend — nunca expor no frontend

---

## Decisões Técnicas

- Senhas devem ser armazenadas com hash **bcrypt** — ainda não implementado
- `Content-Type` não deve ser definido manualmente em requisições com `FormData`
- Commits devem ser feitos pela conta GitHub dona do projeto na Vercel para evitar bloqueio de deploy
- Variáveis sem prefixo `NEXT_PUBLIC_` ficam apenas no servidor e nunca são expostas ao browser