import { useState } from "react";
import { Plus, Minus, Heart, PlayCircle, Store } from "lucide-react";
import Stars from "./Stars";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import logo from "../assets/product-placeholder.png";

const BADGE_STYLES = {
  bestseller: "bg-primary-600 text-white",
  popular: "bg-gold-500 text-primary-900",
  save: "bg-emerald-600 text-white",
};

export default function MenuItemCard({ item, onClick, onToast, badge }) {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const { onlineOrderEnabled } = useStoreSettings();
  const [liked, setLiked] = useState(false);

  // Logic Integration
  const isSoldOut = item.status === "sold_out" || item.stock_status === "out_of_stock";
  const isLowStock = !isSoldOut && item.stock_status === "low_stock";
  const isBlocked = isSoldOut || !onlineOrderEnabled;
  const defaultVariant = item.variants?.[0];

  // Total quantity of this item already in the cart, across any variant —
  // keeps the count in sync with the detail screen / menu list.
  const cartQty = cartItems
    .filter((i) => i.id === item.id)
    .reduce((sum, i) => sum + i.quantity, 0);
  const cartEntry = cartItems.find((i) => i.id === item.id);

  function handleQuickAdd(e) {
    e.stopPropagation();
    if (isBlocked) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: defaultVariant?.price ?? 0,
      mrp:
        Number(defaultVariant?.actual_rate) > Number(defaultVariant?.price)
          ? Number(defaultVariant.actual_rate)
          : null,
      discountPercent: defaultVariant?.discount_percent || null,
      variantId: defaultVariant?.id ?? null,
      variantName: defaultVariant?.name ?? null,
      image: item.images?.[0] || logo,
      categoryName: item.categoryName,
      quantity: 1,
    });
    
    onToast?.(`${item.name} added to cart`);
  }

  function handleDecrease(e) {
    e.stopPropagation();
    if (!cartEntry) return;
    updateQuantity(item.id, cartEntry.variantId ?? null, cartEntry.quantity - 1);
  }

  function handleIncrease(e) {
    e.stopPropagation();
    if (!cartEntry) return;
    updateQuantity(item.id, cartEntry.variantId ?? null, cartEntry.quantity + 1);
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl md:rounded-3xl shadow-soft hover:shadow-card overflow-hidden animate-fadeUp cursor-pointer flex flex-col transition-shadow duration-300 group"
    >
      {/* Image Container */}
      <div className="relative h-32 md:h-40 overflow-hidden">
        <img
          src={item.images?.[0] || logo}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wide">
              Sold Out
            </span>
          </div>
        )}

        {/* Low Stock tag, bottom-left */}
        {isLowStock && (
          <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-wide px-2 py-1 rounded-md shadow-sm bg-amber-500 text-white">
            Only Few Left
          </span>
        )}

        {/* Promo tag, top-left */}
        {badge && (
          <span
            className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-wide px-2 py-1 rounded-md shadow-sm ${
              BADGE_STYLES[badge.type] || BADGE_STYLES.bestseller
            }`}
          >
            {badge.label}
          </span>
        )}

        {/* Wishlist heart, top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-label="Save to favorites"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart
            size={13}
            className={liked ? "fill-primary-600 text-primary-600" : "text-gray-400"}
          />
        </button>

        {/* Video available indicator, bottom-right */}
        {item.videos?.length > 0 && (
          <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
            <PlayCircle size={14} className="text-white" />
          </span>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3 md:p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-sm md:text-[15px] text-primary-800 leading-tight">
          {item.name}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 hidden sm:block">
          {item.description}
        </p>

        {item.rating ? (
          <div className="flex items-center gap-1.5 mt-1">
            <Stars rating={item.rating} size={12} />
            <span className="text-[11px] text-gray-400 font-medium">
              {item.rating}{item.reviewCount ? ` (${item.reviewCount})` : ""}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-auto pt-2">
          {defaultVariant && (
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-primary-600">
                ₹{defaultVariant.price}
              </span>
              {Number(defaultVariant.actual_rate) > Number(defaultVariant.price) && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 line-through">
                    ₹{defaultVariant.actual_rate}
                  </span>
                  {defaultVariant.discount_percent > 0 && (
                    <span className="text-[9px] font-bold text-emerald-600">
                      {defaultVariant.discount_percent}% off
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Add Button / Quantity Stepper — hidden entirely while
              online ordering is paused; view + rate still show above. */}
          {!onlineOrderEnabled ? (
            <span className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-gray-400 border border-gray-200 rounded-full px-2.5 py-1.5 whitespace-nowrap">
              <Store size={11} /> Visit Store
            </span>
          ) : cartQty > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-1 py-1 shadow-sm"
            >
              <button
                onClick={handleDecrease}
                aria-label={`Decrease ${item.name} quantity`}
                className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
              >
                <Minus size={13} />
              </button>

              <span className="min-w-[1rem] text-center text-xs md:text-sm font-bold text-primary-700">
                {cartQty}
              </span>

              <button
                onClick={handleIncrease}
                aria-label={`Increase ${item.name} quantity`}
                className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-50"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isBlocked}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 flex items-center justify-center shadow-soft transition-colors shrink-0"
            >
              <Plus size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}