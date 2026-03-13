-- ============================================
-- LampInvite - Schema do Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Tabela de eventos
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  date timestamptz not null,
  location_name text not null,
  location_address text not null,
  cover_image_url text,
  slug text unique not null,
  max_guests integer,
  created_at timestamptz default now()
);

-- Tabela de confirmações de presença
create table public.rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  email text not null,
  status text check (status in ('confirmed', 'declined')) default 'confirmed',
  created_at timestamptz default now(),
  unique(event_id, email)
);

-- Habilitar RLS
alter table public.events enable row level security;
alter table public.rsvps enable row level security;

-- Políticas para events
create policy "Usuarios veem seus proprios eventos"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Usuarios criam seus proprios eventos"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Usuarios editam seus proprios eventos"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Usuarios deletam seus proprios eventos"
  on public.events for delete
  using (auth.uid() = user_id);

-- Eventos são públicos para leitura (página do convite)
create policy "Eventos sao publicos para leitura"
  on public.events for select
  using (true);

-- Políticas para rsvps
create policy "Qualquer pessoa pode confirmar presenca"
  on public.rsvps for insert
  with check (true);

create policy "Organizador ve RSVPs do seu evento"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.events
      where events.id = rsvps.event_id
        and events.user_id = auth.uid()
    )
  );
