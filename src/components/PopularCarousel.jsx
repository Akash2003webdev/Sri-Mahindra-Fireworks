import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MenuItemCard from "./MenuItemCard";

// Mobile: a swipeable, snap-scrolling row with a "1 / N" counter + arrow
// buttons (same pattern as lovely-cards.com's product carousels).
// Desktop (md+): falls back to a plain grid, which reads better on a wide
// screen than an endless horizontal scroller.
export default function PopularCarousel({ items = [], onSelectItem, onToast, badgeFor }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const cardWidth = el.children[0].getBoundingClientRect().width + 12; // + gap
    const index = Math.round(el.scrollLeft / cardWidth);
    setActive(Math.min(index, items.length - 1));
  }

  function scrollByCards(dir) {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const cardWidth = el.children[0].getBoundingClientRect().width + 12;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <>
      {/* Mobile swipeable carousel */}
      <div className="md:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-1"
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-[46vw] max-w-[220px] shrink-0 snap-start">
              <MenuItemCard
                item={item}
                onClick={() => onSelectItem(item)}
                onToast={onToast}
                badge={badgeFor?.(index)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">
            {active + 1} / {items.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Previous"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-200 bg-white text-primary-700 shadow-sm transition-transform active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Next"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-200 bg-white text-primary-700 shadow-sm transition-transform active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.id} className="w-full">
            <MenuItemCard
              item={item}
              onClick={() => onSelectItem(item)}
              onToast={onToast}
              badge={badgeFor?.(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
