import { useEffect, useState } from "react";
import { Tag, Sparkles } from "lucide-react";
import { getCoupons } from "../lib/api";
import { useSEO } from "../lib/seo";
import CouponCard from "../components/CouponCard";

export default function OfferPage() {
  useSEO({
    title: "Offers & Coupon Codes | Mahendra Fancy Crackers",
    description:
      "Latest offers and coupon codes at Mahendra Fancy Crackers, Sattur — copy a code and apply it at checkout.",
    path: "/offer",
  });

  const [coupons, setCoupons] = useState(null);

  useEffect(() => {
    getCoupons()
      .then(setCoupons)
      .catch(() => setCoupons([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-24 md:pb-16 min-h-screen bg-gray-50/40">
      <div className="mb-8 md:mb-12">
        <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
          <Sparkles size={14} /> Extra Savings
        </span>
        <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
          Offers & Coupon Codes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Copy a code below and apply it on the Cart page at checkout.
        </p>
      </div>

      {coupons === null && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
        </div>
      )}

      {coupons?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
          <Tag size={28} className="mx-auto mb-3 text-gray-300" />
          No offers available right now — check back soon!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {coupons?.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
}
