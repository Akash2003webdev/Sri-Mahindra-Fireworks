-- ============================================================================
-- Mahendra Fancy Crackers — fix: orders table was missing `map_location`
-- The checkout form (Home Delivery) sends a Google Maps link, but the
-- `orders` table didn't have a column for it, so placing an order with a
-- shared map location would fail. Run this once in Supabase → SQL Editor.
-- ============================================================================

alter table orders add column if not exists map_location text;
