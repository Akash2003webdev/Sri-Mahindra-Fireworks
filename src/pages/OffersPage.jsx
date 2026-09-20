import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  X,
  Plus,
  Store,
} from "lucide-react";

import { getOffers } from "../lib/api";
import { useSEO } from "../lib/seo";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";

/* =========================================================
   OFFER VISUAL
   ========================================================= */

function OfferVisual({ offer }) {
  const products = Array.isArray(offer?.products) ? offer.products : [];

  // Admin selected combo cover image
  if (offer?.image) {
    return (
      <div className="w-full bg-gray-100">
        <img
          src={offer.image}
          alt={offer.title || "Combo Pack"}
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  // Product images for fallback collage
  const photos = products.map((p) => p?.image).filter(Boolean);

  // No image
  if (photos.length === 0) {
    return (
      <div className="h-40 w-full bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 flex items-center justify-center">
        <Tag size={32} className="text-white/70" />
      </div>
    );
  }

  // One image
  if (photos.length === 1) {
    return (
      <div className="w-full bg-gray-100">
        <img
          src={photos[0]}
          alt={offer?.title || "Combo Pack"}
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  // Multiple product images
  return (
    <div className="h-40 w-full grid grid-cols-2 gap-0.5 overflow-hidden bg-gray-100">
      {photos.slice(0, 4).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
}

/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function ProductImage({ product }) {
  const image =
    product?.image || product?.image_url || product?.imageUrl || null;

  const name =
    product?.name || product?.product_name || product?.title || "Product";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-center block"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary-600">
      {name?.[0]?.toUpperCase() || "P"}
    </div>
  );
}

/* =========================================================
   COMBO DETAILS MODAL
   ========================================================= */

function ComboDetailsModal({ offer, onClose, onOrder, onlineOrderEnabled }) {
  const products = Array.isArray(offer?.products) ? offer.products : [];

  const rate = Number(offer?.rate || 0);

  const originalTotal = Number(offer?.originalTotal || 0);

  const savings = originalTotal - rate;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4"
      onClick={onClose}
    >
      {/* =====================================================
          MODAL
         ===================================================== */}

      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================
            FIXED COMBO IMAGE
            IMPORTANT:
            Previously image was h-auto and occupied huge space.
            Now fixed height.
           =================================================== */}

        <div className="relative w-full h-52 sm:h-60 flex-shrink-0 bg-gray-100 overflow-hidden">
          {offer?.image ? (
            <img
              src={offer.image}
              alt={offer?.title || "Combo Pack"}
              className="w-full h-full object-cover"
            />
          ) : products.length > 0 && products[0]?.image ? (
            <img
              src={products[0].image}
              alt={offer?.title || "Combo Pack"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 flex items-center justify-center">
              <Tag size={42} className="text-white/70" />
            </div>
          )}

          {/* Dark bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          {/* Product count */}
          {products.length > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </div>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===================================================
            SCROLLABLE CONTENT
           =================================================== */}

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-5">
            {/* Title */}
            <h3 className="font-display font-black text-xl text-gray-900 tracking-tight">
              {offer?.title || "Combo Pack"}
            </h3>

            {/* Description */}
            {offer?.description && (
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {offer.description}
              </p>
            )}

            {/* =================================================
                PRODUCTS HEADER
               ================================================= */}

            <div className="flex items-center justify-between mt-5 mb-3">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  What's in this combo
                </p>

                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"} included
                </p>
              </div>

              <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                {products.length} Items
              </span>
            </div>

            {/* =================================================
                ALL PRODUCTS
               ================================================= */}

            {products.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {products.map((product, index) => {
                  const productName =
                    product?.name ||
                    product?.product_name ||
                    product?.title ||
                    "Product";

                  const variantName =
                    product?.variantName ||
                    product?.variant_name ||
                    product?.variant ||
                    null;

                  const quantity = Number(
                    product?.quantity || product?.qty || 1,
                  );

                  const productPrice = product?.price ?? product?.rate ?? null;

                  return (
                    <div
                      key={
                        product?.id ||
                        product?.productId ||
                        product?.itemId ||
                        `${productName}-${index}`
                      }
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2.5 border border-gray-100"
                    >
                      {/* -------------------------------------
                          NUMBER
                         ------------------------------------- */}

                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold">
                          {index + 1}
                        </span>
                      </div>

                      {/* -------------------------------------
                          PRODUCT IMAGE
                         ------------------------------------- */}

                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                        <ProductImage product={product} />
                      </div>

                      {/* -------------------------------------
                          PRODUCT DETAILS
                         ------------------------------------- */}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 break-words leading-snug">
                          {productName}
                        </p>

                        {variantName && (
                          <p className="text-xs text-gray-400 mt-1">
                            {variantName}
                          </p>
                        )}

                        {productPrice !== null && (
                          <p className="text-xs font-semibold text-primary-600 mt-1">
                            ₹{productPrice}
                          </p>
                        )}
                      </div>

                      {/* -------------------------------------
                          QUANTITY
                         ------------------------------------- */}

                      <div className="flex-shrink-0">
                        <span className="text-xs font-bold text-primary-700 bg-primary-100 rounded-full px-2 py-1">
                          x{quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No products */
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <ShoppingBag size={26} className="mx-auto text-gray-300 mb-2" />

                <p className="text-sm text-gray-500 font-semibold">
                  No products found in this combo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            FOOTER
           =================================================== */}

        <div className="p-5 pt-3 border-t border-gray-100 bg-white flex-shrink-0">
          {/* Price */}
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-primary-700">
                  ₹{rate}
                </span>

                {/* {savings > 0 && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    ₹{originalTotal}
                  </span>
                )} */}
              </div>
              {/* 
              {savings > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  You save ₹{savings}
                </span>
              )} */}
            </div>
          </div>

          {/* Order */}
          {onlineOrderEnabled ? (
            <button
              type="button"
              onClick={() => onOrder(offer)}
              disabled={!products.length}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm tracking-wide shadow-md shadow-primary-500/10 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ShoppingBag size={16} />
              Order This Combo Box
              <ArrowRight size={15} />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-50 text-primary-700 font-bold text-sm border border-purple-100">
              <Store size={16} />
              Visit Store to Order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   OFFER CARD
   ========================================================= */

function OfferCard({ offer, onOrder, onlineOrderEnabled }) {
  const [showDetails, setShowDetails] = useState(false);

  const products = Array.isArray(offer?.products) ? offer.products : [];

  const rate = Number(offer?.rate || 0);

  const originalTotal = Number(offer?.originalTotal || 0);

  const savings = originalTotal - rate;

  return (
    <>
      {/* ===================================================
          CARD
         =================================================== */}

      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
        {/* Visual */}
        <OfferVisual offer={offer} />

        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-display font-black text-lg text-gray-900 tracking-tight">
            {offer?.title || "Combo Pack"}
          </h3>

          {/* Description */}
          {offer?.description && (
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              {offer.description}
            </p>
          )}

          {/* =================================================
              VIEW COMBO
             ================================================= */}

          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="mt-3.5 flex items-center gap-2.5 text-left group cursor-pointer"
            >
              {/* Preview images */}
              <div className="flex -space-x-3 flex-shrink-0">
                {products.slice(0, 4).map((product, index) => (
                  <div
                    key={
                      product?.id ||
                      product?.productId ||
                      product?.itemId ||
                      `${index}`
                    }
                    className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden bg-primary-50 shadow-sm group-hover:ring-primary-100 transition-colors"
                    style={{
                      zIndex: 10 - index,
                    }}
                  >
                    <ProductImage product={product} />
                  </div>
                ))}

                {/* More count */}
                {products.length > 4 && (
                  <div
                    className="w-9 h-9 rounded-full ring-2 ring-white bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm"
                    style={{ zIndex: 0 }}
                  >
                    +{products.length - 4}
                  </div>
                )}
              </div>

              {/* View */}
              <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold group-hover:text-primary-700">
                <Plus size={12} strokeWidth={3} />
                View combo pack
                <span className="text-Black-400">({products.length})</span>
              </span>
            </button>
          )}

          {/* =================================================
              PRICE
             ================================================= */}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-primary-700">
                  ₹{rate}
                </span>

                {/* {savings > 0 && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    ₹{originalTotal}
                  </span>
                )} */}
              </div>

              {/* {savings > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  You save ₹{savings}
                </span>
              )} */}
            </div>
          </div>

          {/* =================================================
              ORDER BUTTON
             ================================================= */}

          {onlineOrderEnabled ? (
            <button
              type="button"
              onClick={() => onOrder(offer)}
              disabled={!products.length}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm tracking-wide shadow-md shadow-primary-500/10 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ShoppingBag size={16} />
              Order This Combo Pack
              <ArrowRight size={15} />
            </button>
          ) : (
            <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-50 text-primary-700 font-bold text-sm border border-purple-100">
              <Store size={16} />
              Visit Store to Order
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          MODAL
         =================================================== */}

      {showDetails && (
        <ComboDetailsModal
          offer={offer}
          onClose={() => setShowDetails(false)}
          onOrder={onOrder}
          onlineOrderEnabled={onlineOrderEnabled}
        />
      )}
    </>
  );
}

/* =========================================================
   OFFERS PAGE
   ========================================================= */

export default function OffersPage({ onToast }) {
  /* =======================================================
     SEO
     ======================================================= */

  useSEO({
    title: "Combo Packs | Mahendra Fancy Crackers - Combo Deals & Discounts",

    description:
      "Check out ready-made crackers Combo packs at Mahendra Fancy Crackers, Sattur — bundled and priced specially.",

    path: "/offers",
  });

  /* =======================================================
     STATE
     ======================================================= */

  const [offers, setOffers] = useState(null);

  const { addItem } = useCart();

  const { onlineOrderEnabled } = useStoreSettings();

  const navigate = useNavigate();

  /* =======================================================
     LOAD OFFERS
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    getOffers()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          setOffers([]);
        }
      })
      .catch(() => {
        if (!mounted) return;

        setOffers([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     ORDER COMBO
     ======================================================= */

  function handleOrder(offer) {
    const products = Array.isArray(offer?.products) ? offer.products : [];

    addItem({
      id: `offer-${offer.id}`,

      name: offer.title,

      price: offer.rate,

      variantId: null,

      variantName: "Gift Box",

      image: offer.image || products?.[0]?.image || null,

      categoryName: null,

      quantity: 1,

      // IMPORTANT:
      // Store ALL combo products in cart.
      comboItems: products,
    });

    onToast?.(`${offer.title} added to cart`);

    navigate("/cart");
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-24 md:pb-16 min-h-screen bg-gray-50/40">
      {/* ===================================================
          HEADER
         =================================================== */}

      <div className="mb-8 md:mb-12">
        <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
          <Sparkles size={14} />
          Deals Just For You
        </span>

        <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
          Combo Pack
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Ready-made crackers combo pack bundled and priced specially — order
          the whole box in one tap.
        </p>
      </div>

      {/* ===================================================
          LOADING
         =================================================== */}

      {offers === null && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />

          <p className="text-sm text-gray-400">Loading combo packs...</p>
        </div>
      )}

      {/* ===================================================
          EMPTY
         =================================================== */}

      {offers?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
          No combo pack available right now — check back soon!
        </div>
      )}

      {/* ===================================================
          OFFERS GRID
         =================================================== */}

      {offers?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onOrder={handleOrder}
              onlineOrderEnabled={onlineOrderEnabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
