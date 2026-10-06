create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null default 'starter' check (plan in ('starter','pro','agency')),
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "Users read own subscription" on public.subscriptions for select using (auth.uid()=user_id);

create table if not exists public.usage_hourly (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket timestamptz not null,
  count int not null default 0 check (count>=0),
  primary key(user_id,bucket)
);
alter table public.usage_hourly enable row level security;
create policy "Users read own usage" on public.usage_hourly for select using (auth.uid()=user_id);
