import { useState } from "react";
import { BadgePercent, Copy, Check, CalendarClock, Ban } from "lucide-react";

function formatValidUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Canva-style coupon card — banner image (if the admin uploaded one) with
// the code shown as a dashed "ticket" the customer can copy in one tap.
// Shared between OfferPage (full list) and the HomePage preview section.
export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  const isExpired = coupon.valid_until && new Date(coupon.valid_until) < new Date();
  const validUntilLabel = formatValidUntil(coupon.valid_until);

  async function handleCopy() {
    if (isExpired) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, code is still visible.
    }
  }

  return (
    <div
      className={`bg-white rounded-3xl border shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 flex flex-col ${
        isExpired
          ? "border-gray-100/80 opacity-60"
          : "border-gray-100/80 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="relative">
        {coupon.image ? (
          <img
            src={coupon.image}
            alt={coupon.name}
            className={`w-full h-auto object-contain bg-gray-100 ${isExpired ? "grayscale" : ""}`}
          />
        ) : (
          <div
            className={`h-32 w-full flex flex-col items-center justify-center text-white ${
              isExpired
                ? "bg-gray-400"
                : "bg-gradient-to-br from-[#ff6d00] via-[#ff1744] to-[#730ca8]"
            }`}
          >
            <BadgePercent size={28} />
            <span className="font-display font-black text-lg mt-1">₹{coupon.discount_amount} OFF</span>
          </div>
        )}

        {isExpired && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-900/85 text-white">
            <Ban size={11} /> Expired
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-black text-lg text-gray-900 tracking-tight">{coupon.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          On orders above ₹{coupon.min_order_amount} — flat ₹{coupon.discount_amount} off
        </p>

        {validUntilLabel && (
          <p
            className={`flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
              isExpired ? "text-rose-500" : "text-gray-400"
            }`}
          >
            <CalendarClock size={12} />
            {isExpired ? `Expired on ${validUntilLabel}` : `Valid until ${validUntilLabel}`}
          </p>
        )}

        <button
          type="button"
          onClick={handleCopy}
          disabled={isExpired}
          className={`mt-4 w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
            isExpired
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-[#730ca8]/40 bg-purple-50/50 hover:bg-purple-50"
          }`}
        >
          <span
            className={`font-display font-black text-base tracking-widest ${
              isExpired ? "text-gray-400" : "text-[#730ca8]"
            }`}
          >
            {coupon.code}
          </span>
          <span
            className={`flex items-center gap-1.5 text-xs font-bold ${
              isExpired ? "text-gray-400" : "text-[#730ca8]"
            }`}
          >
            {isExpired ? (
              <>
                <Ban size={14} /> Expired
              </>
            ) : copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
