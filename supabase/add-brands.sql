-- ============================================================================
-- Mahendra Fancy Crackers — Brands add-on migration
-- Run this in Supabase → SQL Editor if you've ALREADY run schema.sql before.
-- Safe to run once; uses IF NOT EXISTS everywhere so it won't duplicate data
-- or error if some part already exists.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Brands  (e.g. Bairava Brand, Standard, Sonic, Ayyan...) — powers the
-- "Shop by Brand" section on the home page and the brand filter on Menu.
-- ----------------------------------------------------------------------------
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  status text not null default 'active',      -- 'active' | 'inactive'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Link products to a brand (nullable — a product can be brand-less)
alter table menu_items add column if not exists brand_id uuid references brands(id) on delete set null;
create index if not exists idx_menu_items_brand on menu_items(brand_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table brands enable row level security;

drop policy if exists "public read brands" on brands;
create policy "public read brands" on brands for select using (true);

drop policy if exists "admin write brands" on brands;
create policy "admin write brands" on brands for all using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage bucket for brand logos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('brand-images', 'brand-images', true)
on conflict (id) do nothing;

drop policy if exists "public read brand images" on storage.objects;
create policy "public read brand images" on storage.objects
  for select using (bucket_id = 'brand-images');

drop policy if exists "public upload brand images" on storage.objects;
create policy "public upload brand images" on storage.objects
  for insert with check (bucket_id = 'brand-images');

drop policy if exists "public update brand images" on storage.objects;
create policy "public update brand images" on storage.objects
  for update using (bucket_id = 'brand-images');

drop policy if exists "public delete brand images" on storage.objects;
create policy "public delete brand images" on storage.objects
  for delete using (bucket_id = 'brand-images');

-- ----------------------------------------------------------------------------
-- Seed a few real Sivakasi cracker brands (edit / delete from Admin any time;
-- images left blank so you can upload real logos via Admin → Brands).
-- ----------------------------------------------------------------------------
insert into brands (name, sort_order)
select * from (values
  ('Bairava Brand', 1),
  ('Standard Fireworks', 2),
  ('Ayyan Fireworks', 3),
  ('Sony Fireworks', 4),
  ('Coronation Fireworks', 5),
  ('Sri Kaliswari Fireworks', 6)
) as v(name, sort_order)
where not exists (select 1 from brands where brands.name = v.name);
