// API layer backed by Supabase. Function names/signatures match what the
// components already call, so no component code had to change.

import { supabase } from "./supabaseClient";
import { restaurantInfo } from "./data";

function normalizeItem(row) {
  return {
    ...row,
    images: row.images || [],
    variants: (row.variants || []).slice().sort((a, b) => a.sort_order - b.sort_order),
    categoryName: row.category?.name,
  };
}

function normalizeReview(row) {
  return { ...row, date: row.created_at?.slice(0, 10) };
}

export async function getRestaurantInfo() {
  // Static — not stored in the DB.
  return restaurantInfo;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getCategoryById(id) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function getMenuItems({ categoryId, search } = {}) {
  let query = supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*), category:categories(name)");
  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeItem);
}

export async function getMenuItemById(id) {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*), category:categories(name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return normalizeItem(data);
}

export async function getPopularItems(limit = 8) {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*), category:categories(name)")
    .order("rating", { ascending: false });
  if (error) throw error;
  const items = (data || []).map(normalizeItem);

  // Items with a real photo uploaded should show first on the home page;
  // items still missing a photo (or rating) fall to the back.
  const withImage = items.filter((i) => i.images?.[0]);
  const withoutImage = items.filter((i) => !i.images?.[0]);

  return [...withImage, ...withoutImage].slice(0, limit);
}

export async function getOverallReviews() {
  const { data, error } = await supabase
    .from("overall_reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeReview);
}

export async function getItemReviews(itemId) {
  const { data, error } = await supabase
    .from("item_reviews")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeReview);
}

export async function submitReview({ itemId, name, rating, comment }) {
  const table = itemId ? "item_reviews" : "overall_reviews";
  const payload = itemId ? { item_id: itemId, name, rating, comment } : { name, rating, comment };
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return normalizeReview(data);
}

export async function submitOrder({ cartItems, orderType, mapLocation, address, name, phone, total }) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_type: orderType,
      map_location: mapLocation || null,
      address: address || null,
      customer_name: name,
      customer_phone: phone,
      items: cartItems,
      total,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitEnquiry({ name, phone, enquiryType, message }) {
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      phone,
      enquiry_type: enquiryType || "General",
      message,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEnquiries() {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ----------------------------------------------------------------------------
// Banners (home page auto-scrolling promo carousel — admin managed)
// ----------------------------------------------------------------------------

export async function getBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAllBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createBanner({ image, link, sortOrder }) {
  const { data, error } = await supabase
    .from("banners")
    .insert({ image, link: link || null, sort_order: sortOrder ?? 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBanner(id, fields) {
  const { data, error } = await supabase
    .from("banners")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBanner(id) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

export function uploadBannerImage(file) {
  return uploadImage("banner-images", file);
}

// ----------------------------------------------------------------------------
// Offers (dedicated Offers page — admin managed combo deals)
// ----------------------------------------------------------------------------

const OFFER_SELECT =
  "*, offer_items(id, quantity, item:menu_items(id, name, images), variant:menu_item_variants(id, name, price))";

// Turns the raw offer_items join rows into a simple `products` array the UI
// can render directly, and works out the combo's original (pre-discount)
// total so the Offers page can show "You save ₹X".
function normalizeOffer(row) {
  const products = (row.offer_items || [])
    .filter((oi) => oi.item)
    .map((oi) => ({
      id: oi.item.id,
      name: oi.item.name,
      image: oi.item.images?.[0] || null,
      quantity: oi.quantity ?? 1,
      variantId: oi.variant?.id ?? null,
      variantName: oi.variant?.name ?? null,
      price: oi.variant?.price ?? 0,
    }));
  const originalTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const { offer_items, ...offer } = row;
  return { ...offer, products, originalTotal };
}

export async function getOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select(OFFER_SELECT)
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeOffer);
}

export async function getAllOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select(OFFER_SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeOffer);
}

// items: [{ itemId, variantId, quantity }] — the products grouped into this combo.
export async function createOffer({ title, description, image, rate, sortOrder, items }) {
  const { data, error } = await supabase
    .from("offers")
    .insert({
      title,
      description: description || null,
      image: image || null,
      rate: rate ?? 0,
      sort_order: sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;

  if (items?.length) {
    const rows = items.map((it) => ({
      offer_id: data.id,
      item_id: it.itemId,
      variant_id: it.variantId || null,
      quantity: it.quantity ?? 1,
    }));
    const { error: itemsError } = await supabase.from("offer_items").insert(rows);
    if (itemsError) throw itemsError;
  }

  return data;
}

// `items`, if passed, fully replaces the combo's product list.
export async function updateOffer(id, fields, items) {
  const { data, error } = await supabase
    .from("offers")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  if (items) {
    const { error: delError } = await supabase.from("offer_items").delete().eq("offer_id", id);
    if (delError) throw delError;
    if (items.length) {
      const rows = items.map((it) => ({
        offer_id: id,
        item_id: it.itemId,
        variant_id: it.variantId || null,
        quantity: it.quantity ?? 1,
      }));
      const { error: itemsError } = await supabase.from("offer_items").insert(rows);
      if (itemsError) throw itemsError;
    }
  }

  return data;
}

export async function deleteOffer(id) {
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) throw error;
}

export function uploadOfferImage(file) {
  return uploadImage("offer-images", file);
}

// ----------------------------------------------------------------------------
// Image uploads (Supabase Storage)
// ----------------------------------------------------------------------------

async function uploadImage(bucket, file) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function uploadCategoryImage(file) {
  return uploadImage("category-images", file);
}

export function uploadMenuItemImage(file) {
  return uploadImage("menu-item-images", file);
}

// ----------------------------------------------------------------------------
// Category CRUD (admin)
// ----------------------------------------------------------------------------

export async function createCategory({ name, image }) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, image })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, fields) {
  const { data, error } = await supabase
    .from("categories")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------------
// Menu item CRUD (admin)
// ----------------------------------------------------------------------------

export async function createMenuItem({ categoryId, name, image, price }) {
  const { data: item, error } = await supabase
    .from("menu_items")
    .insert({
      category_id: categoryId,
      name,
      images: image ? [image] : [],
    })
    .select()
    .single();
  if (error) throw error;
  const { error: variantError } = await supabase
    .from("menu_item_variants")
    .insert({ item_id: item.id, name: "Regular", price });
  if (variantError) throw variantError;
  return item;
}

export async function updateMenuItem(id, fields) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function updateVariantPrice(variantId, price) {
  const { error } = await supabase
    .from("menu_item_variants")
    .update({ price })
    .eq("id", variantId);
  if (error) throw error;
}