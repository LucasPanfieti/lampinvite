# 🎉 LampInvite — MVP

Site de convites para eventos com Next.js 15, Supabase e Vercel.

## Funcionalidades

- Cadastro e login de organizadores
- Criação de eventos com data, local e limite de convidados
- Página pública do evento com mapa embutido
- Confirmação de presença (RSVP) sem precisar de conta
- Dashboard com lista de convidados

---

## Setup em 5 passos

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute todo o conteúdo do arquivo `supabase-schema.sql`
3. Copie as credenciais em **Settings → API**

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5. Deploy na Vercel

1. Suba o projeto no GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Adicione as variáveis de ambiente (com `NEXT_PUBLIC_SITE_URL` apontando para a URL final)
4. Clique em **Deploy**

**Importante:** Após o deploy, vá em **Supabase → Authentication → URL Configuration** e adicione a URL da Vercel em "Redirect URLs".

---

## Estrutura do projeto

```
src/
├── app/
│   ├── auth/signout/route.ts       # Logout
│   ├── dashboard/
│   │   ├── page.tsx                # Lista de eventos
│   │   ├── new/page.tsx            # Criar evento
│   │   └── events/[id]/page.tsx    # Lista de convidados
│   ├── e/[slug]/
│   │   ├── page.tsx                # Página pública do evento
│   │   └── rsvp-form.tsx           # Formulário de confirmação
│   ├── login/page.tsx              # Login/cadastro
│   ├── layout.tsx
│   ├── page.tsx                    # Redirect automático
│   └── not-found.tsx
├── lib/supabase/
│   ├── client.ts                   # Client-side Supabase
│   └── server.ts                   # Server-side Supabase
└── middleware.ts                   # Proteção de rotas
```
