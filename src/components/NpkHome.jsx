import { useEffect, useRef, useState } from "react";
import { Flame, ShoppingCart, Sparkles, ArrowRight } from "lucide-react";
import FireworksCanvas from "./FireworksCanvas";

/* ------------------------------------------------------------------ */
/* Top scrolling announcement marquee                                  */
/* ------------------------------------------------------------------ */
export function TopMarquee({ items = [] }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 py-2">
      <div className="flex w-max animate-[marqueeScroll_22s_linear_infinite] gap-8 whitespace-nowrap px-4 text-[11px] font-bold tracking-wide text-gold-100 sm:text-xs">
        {loop.map((text, i) => (
          <span key={i} className="flex items-center gap-2">
            <Flame size={12} className="text-orange-400" />
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero banner grid: big auto-rotating main card + side stack           */
/* ------------------------------------------------------------------ */
export function HeroBannerGrid({ mainSlides = [], sideSlides = [], onCTAClick }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [sideIndex, setSideIndex] = useState(0);

  useEffect(() => {
    if (mainSlides.length < 2) return;
    const t = setInterval(() => setMainIndex((i) => (i + 1) % mainSlides.length), 4200);
    return () => clearInterval(t);
  }, [mainSlides.length]);

  useEffect(() => {
    if (sideSlides.length < 2) return;
    const t = setInterval(() => setSideIndex((i) => (i + 1) % sideSlides.length), 3200);
    return () => clearInterval(t);
  }, [sideSlides.length]);

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-[1.6fr_1fr]">
      {/* Main slider */}
      <button
        type="button"
        onClick={onCTAClick}
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] sm:aspect-[16/8]"
      >
        {mainSlides.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="Main promotional banner"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === mainIndex ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-3">
          {mainSlides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === mainIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </button>

      {/* Side rotating card */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] sm:aspect-auto sm:h-full">
        {sideSlides.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="Side promotional banner"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === sideIndex ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gradient promo banner (Diwali / kids range style CTA)                */
/* ------------------------------------------------------------------ */
export function PromoBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  onCTAClick,
  gradient = "from-[#1e1b4b] via-[#311042] to-[#4c0519]",
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${gradient} px-6 py-10 text-center text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] sm:px-10 sm:py-12`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />

      <span className="relative mb-2 block text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300">
        {eyebrow}
      </span>
      <h2 className="relative font-display text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
        {description}
      </p>

      {ctaLabel && (
        <button
          type="button"
          onClick={onCTAClick}
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-7 py-3 text-sm font-bold tracking-wide text-white shadow-[0_10px_25px_rgba(255,94,20,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,94,20,0.55)]"
        >
          <ShoppingCart size={16} />
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section title with the orange→pink underline accent                 */
/* ------------------------------------------------------------------ */
export function GlamicsSectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-8 max-w-xl text-center">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.25em] text-orange-500">
        {eyebrow}
      </span>
      <h2 className="relative inline-block pb-3 font-display text-2xl font-black text-primary-950 sm:text-3xl">
        {title}
        <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600" />
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-gray-500">{description}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Category grid — white cards, fixed-height, rounded thumb + count    */
/* ------------------------------------------------------------------ */
export function CategoryGrid({ categories = [], onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect?.(cat)}
          className="group flex h-[210px] flex-col items-center justify-between rounded-[20px] border border-gray-100 bg-white p-4 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-[0_15px_25px_rgba(0,0,0,0.06)]"
        >
          <div className="h-[85px] w-[85px] overflow-hidden rounded-xl">
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              draggable={false}
            />
          </div>
          <div>
            <h5 className="line-clamp-2 text-[13px] font-bold leading-tight text-primary-950">
              {cat.name}
            </h5>
            <span className="mt-1 block text-[11px] font-semibold text-gray-400">
              Shop now
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Three-column feature banner strip                                   */
/* ------------------------------------------------------------------ */
export function FeatureBanners({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-[20px] bg-gradient-to-br from-primary-950 to-primary-800 p-6 text-white shadow-[0_15px_30px_rgba(0,0,0,0.12)]"
        >
          <Sparkles size={20} className="mb-3 text-orange-400" />
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
            {item.sub}
          </span>
          <h4 className="font-display text-lg font-black leading-snug">{item.title}</h4>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diwali countdown banner with a live day/hour/min/sec timer           */
/* ------------------------------------------------------------------ */
// TODO: confirm the exact Diwali 2026 date and adjust below if needed.
const DIWALI_2026 = new Date("2026-11-08T00:00:00+05:30").getTime();

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, DIWALI_2026 - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.d },
    { label: "Hours", value: timeLeft.h },
    { label: "Mins", value: timeLeft.m },
    { label: "Secs", value: timeLeft.s },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] px-6 py-14 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:px-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.8) 100%), url(/images/hero/hero-main-1.jpg) center/cover no-repeat",
      }}
    >
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.25em] text-orange-300">
        Diwali Celebration 2026
      </span>
      <h2 className="font-display text-2xl font-black sm:text-3xl">
        Countdown to the Festival of Lights
      </h2>

      <div className="pointer-events-none absolute inset-0">
        <FireworksCanvas density={1400} opacity={0.9} maxRockets={2} />
      </div>

      <div className="relative mx-auto mt-7 flex max-w-md justify-center gap-3 sm:gap-5">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex w-16 flex-col items-center rounded-2xl bg-white/10 py-3 backdrop-blur-sm sm:w-20"
          >
            <span className="font-display text-2xl font-black sm:text-3xl">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-md text-sm text-white/60">
        Make this Diwali spectacular with verified quality Sivakasi crackers, delivered to your door.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Glamics-style product/combo card                                    */
/* ------------------------------------------------------------------ */
export function GlamicsProductCard({ image, badge, weight, name, price, mrp, onAdd, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex h-full cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_12px_20px_rgba(255,94,20,0.1)]"
    >
      <div className="relative mb-2 flex h-[130px] items-center justify-center rounded-xl bg-gray-50 p-2">
        {badge && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-2 py-0.5 text-[9px] font-extrabold text-white shadow">
            {badge}
          </span>
        )}
        <img src={image} alt={name} className="max-h-[110px] max-w-full object-contain" />
      </div>

      <div className="flex-1">
        {weight && <span className="block text-[10px] font-semibold text-gray-400">{weight}</span>}
        <h4 className="line-clamp-2 text-[13px] font-bold leading-snug text-primary-950">{name}</h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-extrabold text-orange-600">₹{price}</span>
          {mrp && <span className="text-xs text-gray-400 line-through">₹{mrp}</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAdd?.();
        }}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary-950 py-2 text-[11px] font-bold text-white transition-colors hover:bg-orange-600"
      >
        <ShoppingCart size={13} />
        Add to Cart
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* YouTube-style video gallery — horizontal scroll of thumb cards       */
/* ------------------------------------------------------------------ */
export function VideoGallery({ videos = [] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:px-0">
      {videos.map((v, i) => (
        <a
          key={i}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-video w-[220px] shrink-0 overflow-hidden rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] md:w-full"
        >
          <img
            src={v.thumb}
            alt={v.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary-950 shadow-lg">
              ▶
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Blog / safety-tips card grid                                        */
/* ------------------------------------------------------------------ */
export function BlogGrid({ posts = [] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(0,0,0,0.06)]"
        >
          <div className="relative h-36 w-full overflow-hidden">
            <span className="absolute left-2 top-2 z-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-2.5 py-1 text-[10px] font-extrabold text-white">
              {post.badge}
            </span>
            <span className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-primary-950">
              {post.date}
            </span>
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <h4 className="mb-1.5 text-sm font-bold leading-snug text-primary-950">{post.title}</h4>
            <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">{post.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
