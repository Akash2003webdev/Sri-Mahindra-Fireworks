import { ArrowLeft, Sparkles, CheckCircle2, Phone, MapPin } from "lucide-react";
import { useSEO } from "../lib/seo";
import { restaurantInfo, aboutContent } from "../lib/data";

export default function AboutPage({ onBack }) {
  useSEO({
    title: `About Us | ${restaurantInfo.name}`,
    description: aboutContent.intro,
    path: "/about",
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
        <Sparkles size={14} /> {aboutContent.heading}
      </span>
      <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight mb-4">
        {restaurantInfo.name}
      </h1>

      <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
        {aboutContent.intro}
      </p>

      <div className="space-y-3 mb-10">
        {aboutContent.points.map((point, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <CheckCircle2 size={18} className="text-gold-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gold-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">{restaurantInfo.address}</p>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={18} className="text-gold-500 shrink-0 mt-0.5" />
          <a href={`tel:${restaurantInfo.phone}`} className="text-sm text-gray-600 font-semibold">
            {restaurantInfo.phone}
          </a>
        </div>
      </div>
    </main>
  );
}
