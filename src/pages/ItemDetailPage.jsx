import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Sparkles,
  Star,
  ShoppingBag,
  Send,
  User,
  MessageSquare,
} from "lucide-react";
import Stars from "../components/Stars";
import ReviewCard from "../components/ReviewCard";
import { useCart } from "../context/CartContext";
import { getItemReviews, submitReview } from "../lib/api";
import { useSEO } from "../lib/seo";
import logo from "../assets/placeholder.png";

export default function ItemDetailPage({ item, onBack, onToast, onGoToCart }) {
  useSEO({
    title: item
      ? `${item.name} | Sri Mahindra Fireworks`
      : "Product | Sri Mahindra Fireworks",
    description: item
      ? `${item.name}${item.description ? " - " + item.description : ""} — order online from Sri Mahindra Fireworks, Sattur. Home delivery & store pickup available.`
      : "Order this item online from Sri Mahindra Fireworks, Sattur.",
    path: item ? `/item/${item.id}` : undefined,
  });

  const { items: cartItems, addItem, updateQuantity } = useCart();
  const [variant, setVariant] = useState(item?.variants?.[0] || null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (item) getItemReviews(item.id).then(setReviews);
    setVariant(item?.variants?.[0] || null);
    setActiveImage(0);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const variantId = variant?.id ?? null;
    const cartEntry = cartItems.find(
      (i) => i.id === item.id && (i.variantId ?? null) === variantId
    );
    setQty(cartEntry?.quantity ?? 1);
  }, [item, variant]);

  if (!item) return null;

  const isSoldOut = item.status === "sold_out";
  const isBlocked = isSoldOut;
  const price = variant?.price ?? 0;

  const cartEntry = cartItems.find(
    (i) => i.id === item.id && (i.variantId ?? null) === (variant?.id ?? null)
  );
  const isInCart = !!cartEntry;

  function handleAddToCart() {
    if (isBlocked) return;

    if (isInCart) {
      updateQuantity(item.id, variant?.id ?? null, qty);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price,
        variantId: variant?.id ?? null,
        variantName: variant?.name ?? null,
        image: item.images?.[0] || logo,
        categoryName: item.categoryName,
        quantity: qty,
      });
    }
    onToast?.(`${item.name} added to cart`);
  }

  function handleQtyChange(nextQty) {
    const clamped = Math.max(1, nextQty);
    setQty(clamped);

    if (isInCart) {
      updateQuantity(item.id, variant?.id ?? null, clamped);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price,
        variantId: variant?.id ?? null,
        variantName: variant?.name ?? null,
        image: item.images?.[0] || logo,
        categoryName: item.categoryName,
        quantity: clamped,
      });
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    const review = await submitReview({ itemId: item.id, ...form });
    setReviews((prev) => [review, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitting(false);
    onToast?.("Review submitted, thank you!");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-40 md:pb-24 min-h-screen bg-[#fffaf3]">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 pt-4 md:pt-8 items-start">
        
        {/* 1. Image Showcase Area */}
        <div className="space-y-3">
          <div className="relative h-72 sm:h-96 md:h-[32rem] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] group">
            <img
              src={item.images?.[activeImage] || item.images?.[0] || logo}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <button
              onClick={onBack}
              className="absolute top-5 left-5 w-11 h-11 rounded-2xl bg-white/95 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg text-gray-800 hover:text-[#730ca8] transition-all active:scale-90 md:hidden z-10"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {item.images?.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
              {item.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={`h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    activeImage === i
                      ? "border-[#730ca8] shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Content Panel */}
        <div className="space-y-6 md:pt-2">
          <button
            onClick={onBack}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#730ca8] transition-colors group mb-2"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Products
          </button>

          <div>
            <h1 className="font-display font-black text-3xl md:text-5xl text-gray-950 tracking-tight leading-tight">
              {item.name}
            </h1>
            
            <div className="flex items-center gap-2 mt-2.5">
              <Stars rating={item.rating} size={14} />
              <span className="text-xs font-bold text-gray-500">({item.rating || "0.0"})</span>
            </div>
            
            <p className="text-sm md:text-base text-gray-600 mt-4 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>

          {isSoldOut && (
            <div className="bg-rose-50 text-rose-600 border border-rose-100 text-sm font-bold rounded-2xl px-4 py-3 text-center shadow-sm">
              Currently Unavailable (Sold Out)
            </div>
          )}

          {item.variants?.length > 1 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase px-1">
                Choose Pack Size
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {item.variants.map((v) => {
                  const isSelected = variant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] border-purple-600 text-white shadow-md scale-105"
                          : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-[#730ca8]"
                      }`}
                    >
                      {v.name} · ₹{v.price}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price & Quantity Workspace */}
          <div className="flex items-center justify-between bg-white border border-gray-100/80 rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Subtotal</span>
              <span className="font-display font-black text-2xl text-gray-900">₹{price * qty}</span>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full p-1.5">
              <button
                onClick={() => handleQtyChange(qty - 1)}
                className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90"
              >
                <Minus size={13} className="text-gray-700" />
              </button>
              <span className="font-bold text-gray-900 w-5 text-center text-sm">{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90"
              >
                <Plus size={13} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Desktop Checkouts Action Layer */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isBlocked}
              className="flex-1 py-4 rounded-2xl border-2 border-[#730ca8] text-[#730ca8] font-bold text-sm hover:bg-purple-50 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.99]"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                onGoToCart?.();
              }}
              disabled={isBlocked}
              className="group flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] hover:from-[#620992] hover:to-[#730ca8] text-white font-bold text-sm tracking-wide shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              Order Now
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Review Workspace Module */}
      <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start border-t border-gray-100 pt-10">
        
        <div className="space-y-4">
          <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 tracking-tight flex items-center gap-1.5 mb-2">
            <Sparkles size={18} className="text-[#730ca8]" /> Customer Reviews
          </h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
              No reviews yet for this item. Be the first to review it!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="transition-transform duration-300 hover:-translate-y-0.5">
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmitReview}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-5 space-y-4 lg:sticky lg:top-28"
        >
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-100">
            Review This Item
          </h4>
          
          <div className="relative group">
            <User size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#730ca8] transition-colors" />
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10"
              required
            />
          </div>

          <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-3 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Your Rating</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoveredStar ? star <= hoveredStar : star <= form.rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform duration-150 hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={`transition-colors duration-200 ${
                        isFilled ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative group">
            <MessageSquare size={16} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#730ca8] transition-colors" />
            <textarea
              placeholder="How was the quality, sound, and packing?"
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              rows={3}
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.comment.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white text-sm font-bold shadow-md tracking-wide disabled:opacity-40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {submitting ? "Publishing..." : "Publish Review"}
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* 4. Mobile Fixed Bottom Action Overlay */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100/80 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isBlocked}
            className="flex-1 py-3.5 rounded-xl border-2 border-[#730ca8] text-[#730ca8] font-bold text-sm active:scale-95 transition-transform disabled:opacity-40 bg-white"
          >
            Add to Cart
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              onGoToCart?.();
            }}
            disabled={isBlocked}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white font-bold text-sm active:scale-95 transition-transform shadow-md disabled:opacity-40"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}