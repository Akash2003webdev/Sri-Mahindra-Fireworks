# Mahendra Fancy Crackers — Website

React + Vite + Tailwind, Supabase backend. Converted from the food-ordering
codebase to a crackers/fireworks shop site — same layout & structure, new
content model.

## Pages
- **Home** — banners, categories, popular products, reviews, store location
- **Products** (`/menu`) — full catalogue by category
- **Gift Box** (`/offers`) — combo gift boxes at a bundled price
- **Cart** (`/cart`) — order via WhatsApp (Home Delivery / Store Pickup)
- **Enquiry** — bulk / wholesale enquiry form → WhatsApp
- **Reviews** — customer reviews
- **Price List** — full price list, auto-generated from your products
- **About** — shop story (edit `src/lib/data.js`)
- **Safety Tips** — standard fireworks safety guidelines (edit `src/lib/data.js`)


## 1. Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project's URL and anon key (Project
Settings → API in the Supabase dashboard).

## 2. Database

Open your Supabase project → **SQL Editor** → paste the entire contents of
`supabase/schema.sql` → **Run**. This creates all tables, RLS policies,
storage buckets (with public read/upload policies), and a few sample
categories/products so the site isn't empty on first load.

## 3. Edit shop details (do this first)

Open `src/lib/data.js` and update:
- Shop name, address, phone, WhatsApp number
- `safetyTips` — shown on the Safety Tips page
- `aboutContent` — shown on the About page

Replace `src/assets/logo.png` with your own logo.

## 4. Admin login

Default: username `srimahindrafireworks`, password `123456`
(set in `src/pages/AdminPage.jsx` — **change this before going live**, it's
a plain client-side check, not real authentication).

## 5. Run

```bash
npm run dev       # local dev server
npm run build      # production build → dist/
```

## Notes
- Splash screen expects `/public/splash.mp4` (desktop) and
  `/public/splash-mobile.mp4` (mobile) — add your own video files, or
  remove `<SplashScreen />` from `src/App.jsx` if you don't want one.
- Admin writes to Supabase using the public anon key (no login system beyond
  the password screen) — see the note at the top of `supabase/schema.sql`
  for the security trade-off and how to tighten it later with Supabase Auth.
