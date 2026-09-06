// Static shop info — doesn't need its own DB table.
// Products, reviews, and orders live in Supabase (see src/lib/api.js and supabase/schema.sql).
//
// ⚠️ EDIT THIS FILE FIRST — update the placeholder name, address, and phone
// numbers below to your actual crackers shop details before going live.

export const restaurantInfo = {
  name: "Mahendra Fancy Crackers",
  tagline: "Light Up Every Celebration",
  address: "4/269, Sattur Main Road, Krishnapuram, Elayirampannai - 626201",
  phone: "8754977578",
  whatsapp: "918754977578", // WhatsApp number (with country code, no +)
  altPhone: "9342877365",
  email: "srimahindrafw@gmail.com",
  altEmail: "mk06kumar398@gmail.com",
  youtubeUrl: "", // TODO: paste your YouTube channel link here to show the "Watch on YouTube" card
  rating: 4.6,
  reviewCount: 32,
  googleReviewUrl: "", // TODO: paste your Google Business review/maps link here to make the badge clickable
  priceRange: "₹10 – ₹5000 per item",
  hours: "8:00 AM – 9:00 PM",
};

export const orderTypes = ["Home Delivery", "Store Pickup"];

// Categories are stored in the DB with their real/original name (e.g. the
// "Gift Box" category), but we want to *display* certain ones under a
// different, more customer-friendly label everywhere in the UI (home page
// card, category page title) without touching the underlying data or its
// links to products. Add more { from, to } mappings here any time.
const CATEGORY_DISPLAY_NAME_MAP = {
  "gift box": "Combo Packs",
};

export function getCategoryDisplayName(name) {
  if (!name) return name;
  const mapped = CATEGORY_DISPLAY_NAME_MAP[name.trim().toLowerCase()];
  return mapped || name;
}

// Shown as a strip under the homepage banner — standard, honest framing for
// how firecracker sales legally work in India (enquiry / WhatsApp confirm,
// not instant online checkout). Edit freely.
export const legalNotice = {
  heading: "Please Note",
  text:
    "As per Government regulations, firecrackers cannot be sold through instant online checkout. Add your items to the cart and submit — we'll confirm your order and final price over WhatsApp or a phone call within 24 hours.",
};

export const minOrderAmount = 500; // TODO: set your real minimum order value, or null to hide the strip

// Shown as trust/feature cards on the homepage, just under the categories.
export const whyChooseUs = [
  {
    icon: "ShieldCheck",
    title: "Licensed & Safe",
    detail: "Sourced from licensed, quality-tested manufacturers in Sivakasi.",
  },
  {
    icon: "BadgeIndianRupee",
    title: "Genuine Pricing",
    detail: "Honest, transparent rates with real discounts — no inflated MRP tricks.",
  },
  {
    icon: "Truck",
    title: "Delivery & Pickup",
    detail: "Home delivery or store pickup, packed and shipped safely.",
  },
  {
    icon: "Heart",
    title: "Trusted by Families",
    detail: "Serving happy customers across Tamil Nadu, season after season.",
  },
];

// Shown on the Safety Tips page — standard PESO / government fireworks
// safety guidelines. Edit freely to match what you want to publish.
export const safetyTips = [
  {
    title: "Buy only licensed crackers",
    detail:
      "Purchase fireworks only from licensed dealers. Check for proper packaging and manufacturer details before buying.",
  },
  {
    title: "Burst crackers in open areas",
    detail:
      "Always light fireworks in open, outdoor spaces — away from homes, dry leaves, vehicles, and overhead wires.",
  },
  {
    title: "Keep water and sand ready",
    detail:
      "Keep a bucket of water or sand nearby before you start, in case of a small fire or to douse used crackers safely.",
  },
  {
    title: "Adult supervision for children",
    detail:
      "Children should burst crackers only under the direct supervision of adults, and never handle sparklers or sound crackers alone.",
  },
  {
    title: "Wear cotton clothes, avoid loose or synthetic fabric",
    detail:
      "Synthetic clothing can catch fire quickly. Prefer cotton clothes and tie back long hair when bursting crackers.",
  },
  {
    title: "Light one at a time, keep a safe distance",
    detail:
      "Never hold lit crackers in your hand. Light one cracker at a time and move back to a safe distance immediately.",
  },
  {
    title: "Never re-light a dud",
    detail:
      "If a cracker doesn't burst, don't go near it or try to relight it. Wait at least 20-30 minutes, then douse it in water.",
  },
  {
    title: "Store crackers safely",
    detail:
      "Store unused crackers in a cool, dry place, away from any flame, direct sunlight, or other burning crackers.",
  },
];

// Shown on the About page. Edit to describe your shop's story.
export const aboutContent = {
  heading: "About Us",
  intro:
    "Mahendra Fancy Crackers (Bairava Brand) has been bringing light, sound, and colour to festivals across Tamil Nadu — sourced directly from trusted, licensed manufacturers in Sivakasi.",
  points: [
    "Wide range of sparklers, flower pots, ground chakkars, aerial shots, sound crackers, and gift boxes",
    "Sourced from licensed, quality-tested manufacturers under the Bairava Brand",
    "Bulk and wholesale orders welcome for weddings, functions, and celebrations",
    "Home delivery and store pickup available",
  ],
};
