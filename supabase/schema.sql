-- ============================================================================
-- Sri Lakshmi Crackers — Supabase schema
-- Run this whole file once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Categories  (e.g. Sparklers, Flower Pots, Sound Crackers, Aerial Shots...)
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  status text not null default 'active',      -- 'active' | 'inactive'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Menu items = Products
-- ----------------------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  images text[] not null default '{}',
  status text not null default 'available',   -- 'available' | 'sold_out'
  rating numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_menu_items_category on menu_items(category_id);

-- Pack sizes / rates for a product, e.g. "1 Box - ₹120", "5 Box - ₹550"
create table if not exists menu_item_variants (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references menu_items(id) on delete cascade,
  name text not null default 'Regular',
  price numeric not null default 0,
  sort_order int not null default 0
);

create index if not exists idx_variants_item on menu_item_variants(item_id);

-- ----------------------------------------------------------------------------
-- Banners — home page promo carousel
-- ----------------------------------------------------------------------------
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  link text,
  status text not null default 'active',      -- 'active' | 'inactive'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Offers = Gift Boxes (bundled products sold at one combo rate)
-- ----------------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  rate numeric not null default 0,
  status text not null default 'active',      -- 'active' | 'inactive'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers(id) on delete cascade,
  item_id uuid not null references menu_items(id) on delete cascade,
  variant_id uuid references menu_item_variants(id) on delete set null,
  quantity int not null default 1
);

create index if not exists idx_offer_items_offer on offer_items(offer_id);

-- ----------------------------------------------------------------------------
-- Orders  (placed from Cart, sent to shop via WhatsApp)
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_type text not null,                   -- 'Home Delivery' | 'Store Pickup'
  table_number text,
  address text,
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null default '[]',
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Enquiries  (bulk / wholesale / general enquiry form)
-- ----------------------------------------------------------------------------
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  enquiry_type text not null default 'General',
  message text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Reviews
-- ----------------------------------------------------------------------------
create table if not exists overall_reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists item_reviews (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references menu_items(id) on delete cascade,
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists idx_item_reviews_item on item_reviews(item_id);

-- ============================================================================
-- Row Level Security
--
-- The admin page in this app is gated by a client-side password only (no
-- Supabase Auth), so it talks to the DB with the same public "anon" key as
-- customers. That means the write policies below are intentionally open to
-- the anon role so admin actions (add product, mark sold out, etc.) work.
-- Anyone with your anon key could technically write to these tables too — for
-- a small shop site this is a common, accepted trade-off, but if you want
-- stronger protection later, switch the admin page to Supabase Auth and
-- tighten these to `auth.role() = 'authenticated'`.
-- ============================================================================

alter table categories enable row level security;
alter table menu_items enable row level security;
alter table menu_item_variants enable row level security;
alter table banners enable row level security;
alter table offers enable row level security;
alter table offer_items enable row level security;
alter table orders enable row level security;
alter table enquiries enable row level security;
alter table overall_reviews enable row level security;
alter table item_reviews enable row level security;

-- Public read
create policy "public read categories" on categories for select using (true);
create policy "public read menu_items" on menu_items for select using (true);
create policy "public read menu_item_variants" on menu_item_variants for select using (true);
create policy "public read banners" on banners for select using (true);
create policy "public read offers" on offers for select using (true);
create policy "public read offer_items" on offer_items for select using (true);
create policy "public read overall_reviews" on overall_reviews for select using (true);
create policy "public read item_reviews" on item_reviews for select using (true);

-- Public write (customer actions: place order, send enquiry, leave a review)
create policy "public insert orders" on orders for insert with check (true);
create policy "public insert enquiries" on enquiries for insert with check (true);
create policy "public insert overall_reviews" on overall_reviews for insert with check (true);
create policy "public insert item_reviews" on item_reviews for insert with check (true);

-- Admin write (see note above — trusts the anon key)
create policy "admin write categories" on categories for all using (true) with check (true);
create policy "admin write menu_items" on menu_items for all using (true) with check (true);
create policy "admin write menu_item_variants" on menu_item_variants for all using (true) with check (true);
create policy "admin write banners" on banners for all using (true) with check (true);
create policy "admin write offers" on offers for all using (true) with check (true);
create policy "admin write offer_items" on offer_items for all using (true) with check (true);
create policy "admin read orders" on orders for select using (true);
create policy "admin read enquiries" on enquiries for select using (true);

-- ============================================================================
-- Storage buckets — product/category/banner/offer images
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('category-images', 'category-images', true),
  ('menu-item-images', 'menu-item-images', true),
  ('banner-images', 'banner-images', true),
  ('offer-images', 'offer-images', true)
on conflict (id) do nothing;

create policy "public read bucket images" on storage.objects
  for select using (bucket_id in ('category-images', 'menu-item-images', 'banner-images', 'offer-images'));

create policy "public upload bucket images" on storage.objects
  for insert with check (bucket_id in ('category-images', 'menu-item-images', 'banner-images', 'offer-images'));

create policy "public update bucket images" on storage.objects
  for update using (bucket_id in ('category-images', 'menu-item-images', 'banner-images', 'offer-images'));

create policy "public delete bucket images" on storage.objects
  for delete using (bucket_id in ('category-images', 'menu-item-images', 'banner-images', 'offer-images'));

-- ============================================================================
-- Seed data — sample crackers categories & products so the site isn't empty.
-- Edit / delete these from the Admin page any time; images default to blank
-- (no `image` value) so add your own product photos via Admin → Products.
-- ============================================================================

insert into categories (name, sort_order) values
  ('Sparklers', 1),
  ('Flower Pots', 2),
  ('Ground Chakkars', 3),
  ('Sound Crackers', 4),
  ('Aerial / Sky Shots', 5),
  ('Rockets', 6),
  ('Fancy & Novelty', 7),
  ('Kids Special', 8)
on conflict do nothing;

-- Sample products with one price variant each
do $$
declare
  cat_id uuid;
  item_id uuid;
begin
  select id into cat_id from categories where name = 'Sparklers' limit 1;
  insert into menu_items (category_id, name) values (cat_id, '7cm Electric Sparklers (Pack of 10)') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Pack', 40);

  select id into cat_id from categories where name = 'Flower Pots' limit 1;
  insert into menu_items (category_id, name) values (cat_id, 'Colour Flower Pot - Large') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Piece', 60);

  select id into cat_id from categories where name = 'Ground Chakkars' limit 1;
  insert into menu_items (category_id, name) values (cat_id, 'Deluxe Ground Chakkar (Pack of 5)') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Pack', 90);

  select id into cat_id from categories where name = 'Sound Crackers' limit 1;
  insert into menu_items (category_id, name) values (cat_id, '2000 Wala Sound Crackers') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Box', 150);

  select id into cat_id from categories where name = 'Aerial / Sky Shots' limit 1;
  insert into menu_items (category_id, name) values (cat_id, '10 Shot Sky Shot Rocket') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Piece', 320);

  select id into cat_id from categories where name = 'Rockets' limit 1;
  insert into menu_items (category_id, name) values (cat_id, 'Bottle Rocket (Pack of 10)') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Pack', 50);

  select id into cat_id from categories where name = 'Kids Special' limit 1;
  insert into menu_items (category_id, name) values (cat_id, 'Kids Safety Sparklers Combo') returning id into item_id;
  insert into menu_item_variants (item_id, name, price) values (item_id, '1 Set', 99);
end $$;
