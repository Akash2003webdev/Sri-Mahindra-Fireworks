-- ============================================================================
-- Mahendra Fancy Crackers — Product videos add-on migration
-- Run this in Supabase → SQL Editor. Safe to run once; uses IF NOT EXISTS
-- so it won't error if already applied.
-- ============================================================================

-- Product demo/burst videos — kept separate from `images` since the
-- frontend needs to know to render a <video> tag instead of <img>.
alter table menu_items add column if not exists videos text[] not null default '{}';

-- ----------------------------------------------------------------------------
-- Storage bucket for product videos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('menu-item-videos', 'menu-item-videos', true, 52428800) -- 50 MB per file
on conflict (id) do nothing;

drop policy if exists "public read item videos" on storage.objects;
create policy "public read item videos" on storage.objects
  for select using (bucket_id = 'menu-item-videos');

drop policy if exists "public upload item videos" on storage.objects;
create policy "public upload item videos" on storage.objects
  for insert with check (bucket_id = 'menu-item-videos');

drop policy if exists "public update item videos" on storage.objects;
create policy "public update item videos" on storage.objects
  for update using (bucket_id = 'menu-item-videos');

drop policy if exists "public delete item videos" on storage.objects;
create policy "public delete item videos" on storage.objects
  for delete using (bucket_id = 'menu-item-videos');
