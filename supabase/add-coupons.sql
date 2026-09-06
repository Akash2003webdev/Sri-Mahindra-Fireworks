-- ============================================================================
-- Sri Lakshmi Crackers — Coupons add-on migration
-- Run this in Supabase → SQL Editor if you've ALREADY run schema.sql before.
-- Safe to run once; uses IF NOT EXISTS everywhere so it won't duplicate data
-- or error if some part already exists.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Coupons — shown as "Offers" (canva-style coupon cards, copy code) on the
-- Explore Gift page, and redeemed on the Cart page. Each coupon carries its
-- OWN minimum order value + flat discount amount, so the ₹10000→₹500,
-- ₹5000→₹300 style tiers are just rows here, not hardcoded in the app —
-- add/edit/remove tiers any time from Admin → Coupons without a code change.
-- ----------------------------------------------------------------------------
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  name text not null,                          -- e.g. "Diwali Mega Saver"
  image text,                                   -- canva-style banner/poster image
  code text not null unique,                    -- e.g. "DIWALI500" (stored upper-case)
  discount_amount numeric not null default 0,   -- flat ₹ off, e.g. 500
  min_order_amount numeric not null default 0,  -- cart must reach this to qualify, e.g. 10000
  valid_until timestamptz,                      -- null = no expiry
  status text not null default 'active',        -- 'active' | 'inactive'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Orders — record which coupon (if any) was applied and how much it saved,
-- so Admin → Orders and the customer's WhatsApp message both show the
-- discounted rate, not just the raw cart subtotal.
-- ----------------------------------------------------------------------------
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount numeric not null default 0;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table coupons enable row level security;

drop policy if exists "public read coupons" on coupons;
create policy "public read coupons" on coupons for select using (true);

drop policy if exists "admin write coupons" on coupons;
create policy "admin write coupons" on coupons for all using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage bucket for coupon banner images
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('coupon-images', 'coupon-images', true)
on conflict (id) do nothing;

drop policy if exists "public read coupon images" on storage.objects;
create policy "public read coupon images" on storage.objects
  for select using (bucket_id = 'coupon-images');

drop policy if exists "public upload coupon images" on storage.objects;
create policy "public upload coupon images" on storage.objects
  for insert with check (bucket_id = 'coupon-images');

drop policy if exists "public update coupon images" on storage.objects;
create policy "public update coupon images" on storage.objects
  for update using (bucket_id = 'coupon-images');

drop policy if exists "public delete coupon images" on storage.objects;
create policy "public delete coupon images" on storage.objects
  for delete using (bucket_id = 'coupon-images');

-- ----------------------------------------------------------------------------
-- Example coupons (edit or delete from Admin → Coupons any time) — this is
-- exactly the "10000 → 500 off, 5000 → 300 off" tiering, as two rows.
-- ----------------------------------------------------------------------------
insert into coupons (name, code, discount_amount, min_order_amount, sort_order)
select * from (values
  ('Big Basket Saver', 'SAVE500', 500, 10000, 1),
  ('Family Pack Saver', 'SAVE300', 300, 5000, 2)
) as v(name, code, discount_amount, min_order_amount, sort_order)
where not exists (select 1 from coupons where coupons.code = v.code);
