import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Navigation,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag,
  X,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ConfirmOrderModal from "../components/ConfirmOrderModal";
import { orderTypes } from "../lib/data";
import { buildOrderMessage, sendWhatsAppMessage } from "../lib/whatsapp";
import { submitOrder, validateCoupon } from "../lib/api";
import { useSEO } from "../lib/seo";
import logo from "../assets/placeholder.png";

export default function CartPage({ onToast, onOrderSent }) {
  useSEO({
    title: "Your Cart | Mahendra Fancy Crackers",
    description:
      "Review your crackers order from Mahendra Fancy Crackers, Sattur before checkout.",
    path: "/cart",
    noindex: true,
  });

  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [orderType, setOrderType] = useState("Store Pickup");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [mapLocation, setMapLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Coupon code — validated against the backend `coupons` table (each coupon
  // carries its own min order value + flat discount, so the 10000→500,
  // 5000→300 style tiers live in the DB, not hardcoded here).
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const discountAmount = appliedCoupon?.discount_amount || 0;
  const payableTotal = Math.max(total - discountAmount, 0);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    setCouponMessage("");
    try {
      const result = await validateCoupon(couponInput, total);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setCouponMessage(result.message);
      } else {
        setAppliedCoupon(null);
        setCouponMessage(result.message);
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponMessage("Couldn't check that coupon right now — try again.");
    }
    setCheckingCoupon(false);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");
  }

  // A coupon is only valid above its own min order value. If the cart total
  // drops below that (e.g. the user reduces quantity or removes an item
  // after applying the coupon), the coupon must stop applying automatically
  // — otherwise the discount stays active on a cart that no longer qualifies.
  useEffect(() => {
    if (!appliedCoupon) return;
    if (total < appliedCoupon.min_order_amount) {
      setAppliedCoupon(null);
      setCouponMessage(
        `"${appliedCoupon.code}" removed — cart total fell below the ₹${appliedCoupon.min_order_amount} minimum for this coupon.`,
      );
    }
  }, [total, appliedCoupon]);

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location not supported on this device.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapLocation(
          `https://www.google.com/maps?q=${latitude},${longitude}`,
        );
        setLocating(false);
      },
      () => {
        setLocationError(
          "Couldn't get your location. Please allow location access and try again.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const canOrder =
    items.length > 0 &&
    name.trim() &&
    phone.trim().length >= 10 &&
    (orderType !== "Home Delivery" || address.trim());

  async function handleSend() {
    const message = buildOrderMessage({
      cartItems: items,
      orderType,
      address,
      mapLocation,
      name,
      phone,
      couponCode: appliedCoupon?.code,
      discountAmount,
    });
    let savedOrder = null;
    try {
      savedOrder = await submitOrder({
        cartItems: items,
        orderType,
        address,
        mapLocation,
        name,
        phone,
        total: payableTotal,
        couponCode: appliedCoupon?.code,
        discountAmount,
      });
    } catch (err) {
      console.error("Failed to save order to backend:", err);
    }
    sendWhatsAppMessage(message);
    clearCart();
    setShowConfirm(false);
    onToast?.("Order sent via WhatsApp!");
    onOrderSent?.(savedOrder);
  }

  // Modern Empty Cart Screen
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100/80 mb-6 shadow-inner relative">
          <ShoppingBag size={32} className="text-gray-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-[#730ca8]" />
        </div>
        <h2 className="font-display font-black text-xl text-gray-800 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
          Looks like you haven't added any crackers yet. Head back and pick some
          for your celebration!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-40 md:pb-20 min-h-screen bg-gray-50/40">
      {/* Title Header with Clear Cart Option */}
      <div className="mb-6 md:mb-10 flex items-end justify-between">
        <div>
          <span className="flex items-center gap-1.5 text-[#730ca8] text-xs font-bold tracking-[0.2em] uppercase mb-1">
            <Sparkles size={14} /> Review & Checkout
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
            Your Cart
          </h1>
        </div>

        {/* Clear All Cart Items Button */}
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear all items from your cart?",
              )
            ) {
              clearCart();
              onToast?.("Cart cleared successfully");
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 px-3.5 py-2 rounded-xl transition-colors"
        >
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 items-start">
        {/* Responsive Items List */}
        <div className="space-y-4">
          {items.map((item) => {
            return (
              <div
                key={`${item.id}-${item.variantId || "default"}`}
                className="bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
              >
                <div className="relative shrink-0">
                  <img
                    src={item.image || logo}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100 bg-stone-100"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base text-gray-800 truncate">
                    {item.name}
                  </h3>
                  {item.variantName && (
                    <span className="inline-block bg-purple-50 text-purple-700 font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 border border-purple-100">
                      {item.variantName}
                    </span>
                  )}
                  {item.comboItems?.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                      Includes: {item.comboItems.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <div className="text-base font-extrabold text-[#ff5e14] mt-1">
                    ₹{item.price}
                  </div>
                </div>

                {/* Modern Premium Quantity Controls */}
                <div className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-100 rounded-full p-1.5">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.variantId, item.quantity - 1)
                    }
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90 hover:text-[#730ca8]"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-5 text-center text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.variantId, item.quantity + 1)
                    }
                    className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform active:scale-90 hover:text-[#730ca8]"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Trash Action */}
                <button
                  onClick={() => removeItem(item.id, item.variantId)}
                  className="text-gray-400 hover:text-rose-500 p-1.5 transition-colors rounded-xl hover:bg-rose-50/50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Premium Checkout Side Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-5 md:p-6 space-y-6 lg:sticky lg:top-28 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          {/* Order Type Tabs */}
          <div>
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase mb-2.5 block px-1">
              Order Details
            </label>
            <div className="flex bg-gray-50 border border-gray-200/50 p-1 rounded-2xl">
              {orderTypes.map((type) => {
                const active = orderType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white shadow-md scale-[1.02]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Input Fields */}
          <div className="space-y-4">
            {orderType === "Home Delivery" && (
              <div className="relative group">
                <MapPin
                  size={16}
                  className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#730ca8] transition-colors"
                />
                <textarea
                  placeholder="Full Delivery Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10 resize-none"
                />
              </div>
            )}

            {orderType === "Home Delivery" && (
              <div className="space-y-2">
                {mapLocation ? (
                  <div className="flex items-center justify-between gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600 shrink-0"
                      />
                      <a
                        href={mapLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-700 underline underline-offset-2 truncate"
                      >
                        Location pinned — view on map
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-[11px] font-bold text-gray-400 hover:text-[#730ca8] shrink-0"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="w-full flex items-center justify-center gap-2 bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200/70 text-[#730ca8] font-bold text-xs py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Navigation
                      size={14}
                      className={locating ? "animate-pulse" : ""}
                    />
                    {locating
                      ? "Getting your location..."
                      : "Pin My Current Location"}
                  </button>
                )}
                {locationError && (
                  <p className="text-[11px] text-rose-500 font-medium px-1">
                    {locationError}
                  </p>
                )}
              </div>
            )}

            <div className="relative group">
              <User
                size={16}
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#730ca8] transition-colors"
              />
              <input
                type="text"
                placeholder="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div className="relative group">
              <Phone
                size={16}
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#730ca8] transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase px-1 flex items-center gap-1.5">
                <Tag size={13} className="text-[#730ca8]" /> Have a coupon code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700 truncate">
                      {appliedCoupon.code} applied — you saved ₹{discountAmount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-rose-500 shrink-0"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponMessage("");
                    }}
                    className="flex-1 bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-3 text-sm font-medium outline-none uppercase transition-all duration-300 focus:bg-white focus:border-[#730ca8] focus:ring-4 focus:ring-purple-500/10"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={checkingCoupon || !couponInput.trim()}
                    className="px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shrink-0 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {checkingCoupon && <Loader2 size={13} className="animate-spin" />}
                    Apply
                  </button>
                </div>
              )}

              {couponMessage && !appliedCoupon && (
                <p className="text-[11px] text-rose-500 font-medium px-1">
                  {couponMessage}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Summary Footer */}
          <div className="hidden md:block border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-500">
                Basket Subtotal
              </span>
              <span className="font-bold text-base text-gray-700">
                ₹{total}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-emerald-600">
                  Coupon ({appliedCoupon.code})
                </span>
                <span className="font-bold text-base text-emerald-600">
                  − ₹{discountAmount}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-dashed border-gray-200">
              <span className="text-sm font-bold text-gray-800">
                Total Payable
              </span>
              <span className="font-display font-black text-2xl text-gray-900">
                ₹{payableTotal}
              </span>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canOrder}
              className="group w-full py-4 rounded-2xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] hover:from-[#620992] hover:to-[#730ca8] text-white font-bold text-sm tracking-wide shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              Order via WhatsApp
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-16 md:hidden left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100/80 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              {discountAmount > 0 ? "Total (after coupon)" : "Total"}
            </span>
            <span className="font-display font-black text-xl text-gray-900">
              ₹{payableTotal}
            </span>
            {discountAmount > 0 && (
              <span className="text-[10px] text-emerald-600 font-bold block">
                Saved ₹{discountAmount} with {appliedCoupon.code}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canOrder}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white font-bold text-sm tracking-wide shadow-md disabled:opacity-40 transition-transform active:scale-95"
          >
            Order via WhatsApp
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmOrderModal
        open={showConfirm}
        title="Verify Your Order"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSend}
      >
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                Order Modality
              </span>
              <span className="font-bold text-[#730ca8] text-sm">
                {orderType}
              </span>
            </div>
            {orderType === "Home Delivery" && address && (
              <div className="text-right max-w-[150px] truncate">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                  Delivery To
                </span>
                <span className="font-medium text-gray-700 text-xs truncate block">
                  {address}
                </span>
              </div>
            )}
          </div>

          {orderType === "Home Delivery" && mapLocation && (
            <a
              href={mapLocation}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-700"
            >
              <MapPin size={14} className="shrink-0" />
              Location pin attached — view on map
            </a>
          )}

          <div className="border border-gray-100 rounded-2xl p-3.5 space-y-2.5 bg-white shadow-inner max-h-40 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variantId || "default"}`}
                className="flex justify-between items-start text-xs text-gray-600"
              >
                <span className="font-medium max-w-[70%]">
                  {item.name} {item.variantName ? `(${item.variantName})` : ""}{" "}
                  <span className="text-[#730ca8] font-bold">
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-bold text-gray-800">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-gray-200/60 pt-3">
            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>− ₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-black text-gray-900 text-base pt-1">
              <span>Amount Payable</span>
              <span className="text-xl text-[#730ca8]">₹{payableTotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50/50 text-purple-900 p-3 rounded-xl border border-purple-100/60 text-xs font-medium">
            <AlertCircle size={14} className="shrink-0" />
            <p className="truncate">
              Sending to: <span className="font-bold">{name}</span> ({phone})
            </p>
          </div>
        </div>
      </ConfirmOrderModal>
    </div>
  );
}
