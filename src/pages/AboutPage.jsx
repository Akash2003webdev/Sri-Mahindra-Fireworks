import { ArrowLeft, Sparkles, CheckCircle2, Phone, MapPin, ShieldCheck, Award } from "lucide-react";
import { useSEO } from "../lib/seo";
import { restaurantInfo, aboutContent } from "../lib/data";

export default function AboutPage({ onBack }) {
  useSEO({
    title: `About Us | ${restaurantInfo.name}`,
    description: aboutContent.intro,
    path: "/about",
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
          <Sparkles size={14} /> {aboutContent.heading}
        </span>
        <h1 className="font-display font-black text-3xl md:text-5xl text-gray-900 tracking-tight mb-4">
          {restaurantInfo.name}
        </h1>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          {aboutContent.intro}
        </p>
      </div>

      {/* Desktop Grid Layout: Content left, Info Card / Badges right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Points / Features List (Takes 2 columns on lg screens) */}
        <div className="lg:col-span-2 space-y-4">
          {aboutContent.points.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-gold-50 text-gold-600 shrink-0 mt-0.5">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed pt-1">
                {point}
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar Card (Takes 1 column on lg screens) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col gap-5">
            <h3 className="font-display font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Store Information
            </h3>
            
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-gray-50 text-gold-600 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Address</p>
                <p className="text-sm text-gray-700 leading-snug">{restaurantInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-gray-50 text-gold-600 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Phone Support</p>
                <a href={`tel:${restaurantInfo.phone}`} className="text-sm text-gray-800 font-bold hover:text-gold-600 transition-colors">
                  {restaurantInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Trust Badge Box */}
          <div className="rounded-3xl bg-gradient-to-br from-gold-500/10 via-gold-500/5 to-transparent border border-gold-500/20 p-6 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gold-500 text-white shadow-md shadow-gold-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">100% Safe & Certified</h4>
              <p className="text-xs text-gray-500 mt-0.5">Original branded crackers at standard wholesale rates.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}