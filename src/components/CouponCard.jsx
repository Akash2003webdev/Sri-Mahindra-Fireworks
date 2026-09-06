import { useState } from "react";
import { BadgePercent, Copy, Check } from "lucide-react";

// Canva-style coupon card — banner image (if the admin uploaded one) with
// the code shown as a dashed "ticket" the customer can copy in one tap.
// Shared between OfferPage (full list) and the HomePage preview section.
export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, code is still visible.
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
      {coupon.image ? (
        <img src={coupon.image} alt={coupon.name} className="w-full h-auto object-contain bg-gray-100" />
      ) : (
        <div className="h-32 w-full bg-gradient-to-br from-[#ff6d00] via-[#ff1744] to-[#730ca8] flex flex-col items-center justify-center text-white">
          <BadgePercent size={28} />
          <span className="font-display font-black text-lg mt-1">₹{coupon.discount_amount} OFF</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-black text-lg text-gray-900 tracking-tight">{coupon.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          On orders above ₹{coupon.min_order_amount} — flat ₹{coupon.discount_amount} off
        </p>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#730ca8]/40 bg-purple-50/50 hover:bg-purple-50 transition-colors"
        >
          <span className="font-display font-black text-base tracking-widest text-[#730ca8]">
            {coupon.code}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#730ca8]">
            {copied ? (
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
