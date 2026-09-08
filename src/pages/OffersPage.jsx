import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Sparkles, ShoppingBag, ArrowRight, X, Plus, Store } from "lucide-react";
import { getOffers } from "../lib/api";
import { useSEO } from "../lib/seo";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";

// Cover image if the admin set one; otherwise a collage built from the
// combo's own product photos, so every offer always looks visual.
function OfferVisual({ offer }) {
  if (offer.image) {
    return (
      <div className="w-full bg-gray-100">
        <img src={offer.image} alt={offer.title} className="w-full h-auto object-contain" />
      </div>
    );
  }

  const photos = (offer.products || []).map((p) => p.image).filter(Boolean);

  if (photos.length === 0) {
    return (
      <div className="h-40 w-full bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 flex items-center justify-center">
        <Tag size={32} className="text-white/70" />
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div className="w-full bg-gray-100">
        <img src={photos[0]} alt={offer.title} className="w-full h-auto object-contain" />
      </div>
    );
  }

  return (
    <div className="h-40 w-full grid grid-cols-2 gap-0.5 overflow-hidden bg-gray-100">
      {photos.slice(0, 4).map((src, i) => (
        <img key={i} src={src} alt="" className="w-full h-full object-cover" />
      ))}
    </div>
  );
}

// Full-detail popup for what's inside a combo — opens when the avatar
// stack is tapped.
function ComboDetailsModal({ offer, onClose, onOrder, onlineOrderEnabled }) {
  const savings = offer.originalTotal - offer.rate;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <OfferVisual offer={offer} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <h3 className="font-display font-black text-xl text-gray-900 tracking-tight">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{offer.description}</p>
          )}

          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mt-5 mb-2">
            What's in this gift box · {offer.products?.length} items
          </p>

          <div className="flex flex-col gap-2">
            {offer.products?.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 pr-3 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-50 flex-shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-center block"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary-600">
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  {p.variantName && (
                    <p className="text-xs text-gray-400">{p.variantName}</p>
                  )}
                </div>
                {p.quantity > 1 && (
                  <span className="text-xs font-bold text-primary-700 bg-primary-100 rounded-full px-2 py-1 flex-shrink-0">
                    x{p.quantity}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 pt-3 border-t border-gray-100">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-primary-700">₹{offer.rate}</span>
                {savings > 0 && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    ₹{offer.originalTotal}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  You save ₹{savings}
                </span>
              )}
            </div>
          </div>
          {onlineOrderEnabled ? (
            <button
              onClick={() => onOrder(offer)}
              disabled={!offer.products?.length}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm tracking-wide shadow-md shadow-primary-500/10 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ShoppingBag size={16} /> Order This Gift Box <ArrowRight size={15} />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-50 text-primary-700 font-bold text-sm border border-purple-100">
              <Store size={16} /> Visit Store to Order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer, onOrder, onlineOrderEnabled }) {
  const savings = offer.originalTotal - offer.rate;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
        <OfferVisual offer={offer} />

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-black text-lg text-gray-900 tracking-tight">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{offer.description}</p>
          )}

          {offer.products?.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="mt-3.5 flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="flex -space-x-3 flex-shrink-0">
                {offer.products.slice(0, 4).map((p, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full ring-2 ring-white overflow-hidden bg-primary-50 shadow-sm group-hover:ring-primary-100 transition-colors"
                    style={{ zIndex: 10 - i }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover object-center block scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-primary-600">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
                {offer.products.length > 4 && (
                  <div
                    className="w-9 h-9 rounded-full ring-2 ring-white bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm"
                    style={{ zIndex: 0 }}
                  >
                    +{offer.products.length - 4}
                  </div>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold group-hover:text-primary-700">
                <Plus size={12} strokeWidth={3} /> View combo pack
              </span>
            </button>
          )}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-primary-700">₹{offer.rate}</span>
                {savings > 0 && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    ₹{offer.originalTotal}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  You save ₹{savings}
                </span>
              )}
            </div>
          </div>

          {onlineOrderEnabled ? (
            <button
              onClick={() => onOrder(offer)}
              disabled={!offer.products?.length}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm tracking-wide shadow-md shadow-primary-500/10 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ShoppingBag size={16} /> Order This Combo Pack <ArrowRight size={15} />
            </button>
          ) : (
            <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-50 text-primary-700 font-bold text-sm border border-purple-100">
              <Store size={16} /> Visit Store to Order
            </div>
          )}
        </div>
      </div>

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

export default function OffersPage({ onToast }) {
  useSEO({
    title: "Combo Packs | Mahendra Fancy Crackers - Combo Deals & Discounts",
    description:
      "Check out ready-made crackers Combo packs at Mahendra Fancy Crackers, Sattur — bundled and priced specially.",
    path: "/offers",
  });

  const [offers, setOffers] = useState(null);
  const { addItem } = useCart();
  const { onlineOrderEnabled } = useStoreSettings();
  const navigate = useNavigate();

  useEffect(() => {
    getOffers()
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  // The whole combo goes into the cart as ONE line item — its price is the
  // offer's combo rate, not the sum of the individual products — so it
  // places as a single combo order, exactly as sold.
  function handleOrder(offer) {
    addItem({
      id: `offer-${offer.id}`,
      name: offer.title,
      price: offer.rate,
      variantId: null,
      variantName: "Gift Box",
      image: offer.image || offer.products?.[0]?.image,
      categoryName: null,
      quantity: 1,
      comboItems: offer.products,
    });
    onToast?.(`${offer.title} added to cart`);
    navigate("/cart");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-24 md:pb-16 min-h-screen bg-gray-50/40">
      <div className="mb-8 md:mb-12">
        <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
          <Sparkles size={14} /> Deals Just For You
        </span>
        <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
          Combo Pack
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ready-made crackers combo pack bundled and priced specially — order the whole box in one tap.
        </p>
      </div>

      {offers === null && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
        </div>
      )}

      {offers?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
          No combo pack available right now — check back soon!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {offers?.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onOrder={handleOrder} onlineOrderEnabled={onlineOrderEnabled} />
        ))}
      </div>
    </div>
  );
}
