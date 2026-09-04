import { ArrowLeft, ShieldAlert, Flame } from "lucide-react";
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
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-28 md:pb-16">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
        <ShieldAlert size={14} /> Stay Safe
      </span>
      <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight mb-2">
        Cracker Safety Tips
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Please follow these guidelines every time you burst crackers.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {safetyTips.map((tip, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Flame size={16} />
              </span>
              <h3 className="text-sm font-bold text-gray-900">{tip.title}</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed pl-[42px]">{tip.detail}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
