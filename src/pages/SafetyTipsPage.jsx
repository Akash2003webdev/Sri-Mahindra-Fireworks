import { ArrowLeft, ShieldAlert, Flame, CheckCircle } from "lucide-react";
import { useSEO } from "../lib/seo";
import { restaurantInfo, safetyTips } from "../lib/data";

export default function SafetyTipsPage({ onBack }) {
  useSEO({
    title: `Cracker Safety Tips | ${restaurantInfo.name}`,
    description:
      "Important firework safety guidelines — buy from licensed dealers, burst crackers in open areas, keep water ready, and more.",
    path: "/safety-tips",
  });

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-28 lg:pb-16">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {/* Header Section */}
      <div className="max-w-2xl mb-10">
        <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">
          <ShieldAlert size={14} /> Stay Safe
        </span>
        <h1 className="font-display font-black text-3xl md:text-5xl text-gray-900 tracking-tight mb-3">
          Cracker Safety Tips
        </h1>
        <p className="text-base text-gray-600">
          Please follow these vital guidelines every time you burst crackers to ensure a safe and happy celebration.
        </p>
      </div>

      {/* Desktop View: 3-Column Responsive Grid | Mobile View: Stacked grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {safetyTips.map((tip, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-gray-200 hover:shadow-[0_15px_35px_rgba(0,0,0,0.04)] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <Flame size={20} />
                </span>
                <span className="text-xs font-bold text-gray-300 tracking-wider">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                {tip.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tip.detail}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <CheckCircle size={13} /> Recommended Practice
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}