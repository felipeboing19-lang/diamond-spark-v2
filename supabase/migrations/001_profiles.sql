create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('aluno', 'professor')) default 'aluno',
  avatar_url text,
  riasec_profile char(1) check (riasec_profile in ('R', 'I', 'A', 'S', 'E', 'C')),
  intelligence_profile text,
  level int not null default 1,
  xp int not null default 0,
  coins int not null default 0,
  gems int not null default 0,
  energy int not null default 120,
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles visíveis para autenticados"
  on public.profiles for select using (auth.role() = 'authenticated');

create policy "Usuário atualiza próprio profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'aluno')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
