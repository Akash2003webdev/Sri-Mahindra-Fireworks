-- ============================================================================
-- Mahendra Fancy Crackers — Order status tracking add-on migration
-- Run this in Supabase → SQL Editor if you've ALREADY run schema.sql before.
-- Safe to run once; uses IF NOT EXISTS / OR REPLACE everywhere.
-- ============================================================================

alter table orders add column if not exists status text not null default 'pending';
alter table orders add column if not exists updated_at timestamptz not null default now();

-- Guard the allowed status values (skips if the constraint already exists)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_status_check'
  ) then
    alter table orders add constraint orders_status_check
      check (status in ('pending', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled'));
  end if;
end $$;

-- Admin previously had no permission to UPDATE orders (only insert + select),
-- so changing a status from the Admin panel would have failed silently.
drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders for update using (true) with check (true);

-- Lets a customer check their OWN order (must know the order id + the phone
-- number used to place it) without granting public read on the whole table.
create or replace function get_order_status(p_order_id uuid, p_phone text)
returns table (
  id uuid,
  order_type text,
  status text,
  total numeric,
  items jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select o.id, o.order_type, o.status, o.total, o.items, o.created_at, o.updated_at
  from orders o
  where o.id = p_order_id and o.customer_phone = p_phone
$$;

grant execute on function get_order_status(uuid, text) to anon, authenticated;
