import { supabase } from "./supabaseClient";
import { restaurantInfo } from "./data";

function normalizeItem(row) {
  return {
    ...row,
    images: row.images || [],
    videos: row.videos || [],
    variants: (row.variants || []).slice().sort((a, b) => a.sort_order - b.sort_order),
    categoryName: row.category?.name,
  };
}

function normalizeReview(row) {
  return { ...row, date: row.created_at?.slice(0, 10) };
}

export async function getRestaurantInfo() {
  return restaurantInfo;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, menu_items(count)")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map((c) => ({
    ...c,
    count: c.menu_items?.[0]?.count ?? 0,
  }));
}

export async function getCategoryById(id) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function getBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getMenuItems({ categoryId, search } = {}) {
  let query = supabase
    .from("menu_items")
    .select("*, variants:menu_item_variants(*), category:categories(name)");
  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  // Order by the admin-controlled sort_order first (so items show in the
  // order set from the Menu Items tab), then created_at as a tiebreaker
  // for items that share the same sort_order.
  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
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

export async function deleteReview(id, itemId) {
  const table = itemId ? "item_reviews" : "overall_reviews";
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function submitOrder({
  cartItems,
  orderType,
  mapLocation,
  address,
  name,
  phone,
  total,
  couponCode,
  discountAmount,
}) {
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
      coupon_code: couponCode || null,
      discount_amount: discountAmount || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOrder(id) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

// Returns ALL orders placed with this phone number.
export async function trackOrdersByPhone({ phone }) {
  const { data, error } = await supabase.rpc("get_orders_by_phone", {
    p_phone: phone,
  });
  if (error) throw error;
  return data || [];
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

export async function deleteEnquiry(id) {
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw error;
}

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

export async function createBanner({ image, link, sortOrder, placement }) {
  const { data, error } = await supabase
    .from("banners")
    .insert({
      image,
      link: link || null,
      sort_order: sortOrder ?? 0,
      placement: placement === "side" ? "side" : "main",
    })
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

const OFFER_SELECT =
  "*, offer_items(id, quantity, item:menu_items(id, name, images, sort_order, category:categories(id, name, sort_order)), variant:menu_item_variants(id, name, price))";

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
      // Used only for sorting below (category-wise, then position within
      // category — matching the order items appear in the Menu Items tab
      // and on the storefront). Not needed by callers after that.
      categoryName: oi.item.category?.name ?? null,
      _categorySortOrder: oi.item.category?.sort_order ?? 0,
      _itemSortOrder: oi.item.sort_order ?? 0,
    }))
    // Category-wise, then by the item's own position within that category —
    // instead of whatever order Supabase happens to return the offer_items
    // join in (which isn't guaranteed and used to come out jumbled).
    .sort((a, b) => {
      if (a._categorySortOrder !== b._categorySortOrder) {
        return a._categorySortOrder - b._categorySortOrder;
      }
      return a._itemSortOrder - b._itemSortOrder;
    })
    .map(({ _categorySortOrder, _itemSortOrder, ...p }) => p);
  const originalTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const { offer_items, ...offer } = row;
  const isExpired = Boolean(offer.valid_until) && new Date(offer.valid_until) < new Date();
  return { ...offer, products, originalTotal, isExpired };
}

export async function getOffers() {
  // Customer-facing combo packs: active status. Expired ones are still
  // returned (marked with isExpired) so the site can show them as
  // "Expired" instead of just disappearing — the Offers/Combo Pack page
  // decides what to do with that flag (grey out, block ordering, etc).
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

export async function createOffer({ title, description, image, rate, sortOrder, items, validUntil }) {
  const { data, error } = await supabase
    .from("offers")
    .insert({
      title,
      description: description || null,
      image: image || null,
      rate: rate ?? 0,
      sort_order: sortOrder ?? 0,
      valid_until: validUntil || null,
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

export async function updateOffer(id, fields, items) {
  const payload = {};
  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.description !== undefined) payload.description = fields.description;
  if (fields.image !== undefined) payload.image = fields.image;
  if (fields.rate !== undefined) payload.rate = fields.rate;
  if (fields.sortOrder !== undefined) payload.sort_order = fields.sortOrder;
  if (fields.validUntil !== undefined) payload.valid_until = fields.validUntil;
  if (fields.status !== undefined) payload.status = fields.status;

  const { data, error } = await supabase
    .from("offers")
    .update(payload)
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

export function uploadMenuItemVideo(file) {
  return uploadImage("menu-item-videos", file);
}

export async function uploadMultipleImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadMenuItemImage(file);
    urls.push(url);
  }
  return urls;
}

export async function uploadMultipleVideos(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadMenuItemVideo(file);
    urls.push(url);
  }
  return urls;
}

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

export async function getAllBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createBrand({ name, image }) {
  const { data, error } = await supabase
    .from("brands")
    .insert({ name, image })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBrand(id, fields) {
  const { data, error } = await supabase
    .from("brands")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBrand(id) {
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw error;
}

export function uploadBrandImage(file) {
  return uploadImage("brand-images", file);
}

export async function createMenuItem({ categoryId, name, images, videos }) {
  // New items are placed at the end of their category's list by default —
  // count how many items the category already has and use that as the
  // new item's sort_order.
  const { count } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  const { data: item, error } = await supabase
    .from("menu_items")
    .insert({
      category_id: categoryId,
      name,
      images: images || [],
      videos: videos || [],
      sort_order: count || 0,
    })
    .select()
    .single();
  if (error) throw error;
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

export async function createVariant(itemId, fields) {
  const { data, error } = await supabase
    .from("menu_item_variants")
    .insert({
      item_id: itemId,
      name: fields.name || "Regular",
      price: fields.price ?? 0,
      actual_rate: fields.actual_rate || null,
      discount_percent: fields.discount_percent || null,
      sort_order: fields.sort_order ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVariant(variantId, fields) {
  const { data, error } = await supabase
    .from("menu_item_variants")
    .update({
      name: fields.name,
      price: fields.price,
      actual_rate: fields.actual_rate,
      discount_percent: fields.discount_percent,
      sort_order: fields.sort_order,
    })
    .eq("id", variantId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVariant(variantId) {
  const { error } = await supabase
    .from("menu_item_variants")
    .delete()
    .eq("id", variantId);
  if (error) throw error;
}

// ----------------------------------------------------------------------------
// Coupons — flat-discount codes, shown as "Offers" on the Explore Gift page
// and applied on the Cart page. Each coupon carries its own minimum order
// value + discount amount, set by the admin — the cart never hardcodes the
// ₹10000→₹500 / ₹5000→₹300 style tiers, it just asks this table.
// ----------------------------------------------------------------------------
function normalizeCoupon(row) {
  return { ...row, discount_amount: Number(row.discount_amount) || 0, min_order_amount: Number(row.min_order_amount) || 0 };
}

export async function getCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeCoupon);
}

export async function getAllCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeCoupon);
}

export async function createCoupon({ name, image, code, discountAmount, minOrderAmount, validUntil, sortOrder }) {
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      name,
      image: image || null,
      code: code.trim().toUpperCase(),
      discount_amount: discountAmount ?? 0,
      min_order_amount: minOrderAmount ?? 0,
      valid_until: validUntil || null,
      sort_order: sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return normalizeCoupon(data);
}

export async function updateCoupon(id, fields) {
  const payload = {};
  if (fields.name !== undefined) payload.name = fields.name;
  if (fields.image !== undefined) payload.image = fields.image;
  if (fields.code !== undefined) payload.code = fields.code.trim().toUpperCase();
  if (fields.discountAmount !== undefined) payload.discount_amount = fields.discountAmount;
  if (fields.minOrderAmount !== undefined) payload.min_order_amount = fields.minOrderAmount;
  if (fields.validUntil !== undefined) payload.valid_until = fields.validUntil;
  if (fields.sortOrder !== undefined) payload.sort_order = fields.sortOrder;
  if (fields.status !== undefined) payload.status = fields.status;

  const { data, error } = await supabase
    .from("coupons")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return normalizeCoupon(data);
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

export function uploadCouponImage(file) {
  return uploadImage("coupon-images", file);
}

// ----------------------------------------------------------------------------
// Site settings — small key/value table for global toggles, e.g. the
// "online ordering paused" switch admin flips from HQ Dashboard.
// ----------------------------------------------------------------------------
export async function getSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const map = {};
  (data || []).forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function updateSiteSetting(key, value) {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value: String(value), updated_at: new Date().toISOString() },
      { onConflict: "key" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Looks up a coupon by its code and checks it against the cart total —
// active status, not expired, and the cart meets that coupon's own minimum
// order value. Returns { valid, coupon, message } so the Cart page can show
// exactly why a code didn't apply.
export async function validateCoupon(code, cartTotal) {
  const trimmed = (code || "").trim().toUpperCase();
  if (!trimmed) return { valid: false, message: "Enter a coupon code." };

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", trimmed)
    .maybeSingle();
  if (error) throw error;

  if (!data) return { valid: false, message: "Invalid coupon code." };
  const coupon = normalizeCoupon(data);

  if (coupon.status !== "active") {
    return { valid: false, message: "This coupon is no longer active." };
  }
  if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
    return { valid: false, message: "This coupon has expired." };
  }
  if (cartTotal < coupon.min_order_amount) {
    return {
      valid: false,
      message: `Add ₹${coupon.min_order_amount - cartTotal} more to use this coupon (min. order ₹${coupon.min_order_amount}).`,
    };
  }

  return { valid: true, coupon, message: `Coupon applied — you saved ₹${coupon.discount_amount}!` };
}