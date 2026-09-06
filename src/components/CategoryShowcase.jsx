import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import categoryPlaceholder from '../assets/placeholder.png';

export default function CategoryShowcase({
  categories = [],
  selectedId,
  onSelect,
  onViewAll,
}) {
  const trackRef = useRef(null);

  // Duplicate the list once so the marquee can loop seamlessly (the CSS
  // animation slides exactly -50%, i.e. one full original-length set).
  const loopCategories = categories.length ? [...categories, ...categories] : [];

  function pauseScroll() {
    trackRef.current?.classList.add("marquee-paused");
  }
  function resumeScroll() {
    trackRef.current?.classList.remove("marquee-paused");
  }

  return (
    <div className="w-full animate-fadeUp">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-6 px-1">
        <div>
          <span className="block text-gold-500 text-[11px] font-bold tracking-[0.25em] uppercase mb-1">
            Fireworks Collection
          </span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-900 tracking-tight">
            Shop By Category
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="group flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {/* Auto-scrolling marquee of category cards — pauses on touch/hover so
          it's still easy to tap a card, resumes once the user lets go. */}
      <div
        className="marquee-viewport -mx-4 px-4 md:mx-0 md:px-0"
        onMouseEnter={pauseScroll}
        onMouseLeave={resumeScroll}
        onTouchStart={pauseScroll}
        onTouchEnd={resumeScroll}
      >
        <div ref={trackRef} className="marquee-track">
          {loopCategories.map((cat, i) => {
            const isActive = selectedId === cat.id;

            return (
              <button
                key={`${cat.id}-${i}`}
                onClick={() => onSelect(cat)}
                className={`group relative aspect-[4/5] w-[42vw] max-w-[210px] shrink-0 overflow-hidden rounded-2xl text-left shadow-[0_10px_30px_rgba(76,14,23,0.12)] transition-all duration-300 focus:outline-none sm:w-[220px] ${
                  isActive ? "ring-2 ring-gold-500 ring-offset-2" : ""
                }`}
              >
                <img
                  src={cat.image || categoryPlaceholder}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 md:p-4">
                  <span className="font-display text-sm font-bold leading-tight text-white line-clamp-2 md:text-base">
                    {cat.name}
                  </span>

                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-primary-950 md:text-[11px]">
                    Shop Now
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
