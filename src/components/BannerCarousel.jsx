import { useEffect, useRef, useState } from "react";

const AUTO_SCROLL_MS = 3500;

const FALLBACK_BANNERS = [
  { id: "fallback-1", image: null, link: null },
  { id: "fallback-2", image: null, link: null },
  { id: "fallback-3", image: null, link: null },
];

export default function BannerCarousel({
  banners,
  fullBleed = false,
  className = "",
}) {
  const slides = banners?.length ? banners : FALLBACK_BANNERS;
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startAutoScroll = () => {
    if (slides.length <= 1) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, AUTO_SCROLL_MS);
  };

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length]);

  function goTo(i) {
    setIndex(i);
    startAutoScroll();
  }

  return (
    <div
      className={`relative w-full h-full min-h-0 overflow-hidden ${
        fullBleed
          ? ""
          : "rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
      } ${className}`}
    >
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((banner, i) => (
          <a
            key={banner.id}
            href={banner.link || undefined}
            target={banner.link ? "_blank" : undefined}
            rel={banner.link ? "noopener noreferrer" : undefined}
            className="relative block w-full h-full min-w-full shrink-0"
          >
            {banner.image ? (
              <img
                src={banner.image}
                alt={`Promo banner ${i + 1}`}
                className="block w-full h-full object-cover"
              />
            ) : (
              <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-primary-800 via-primary-600 to-primary-500">
                <span className="px-5 text-center font-display text-lg font-bold text-white/70">
                  Add a banner image in Admin → Banners
                </span>
              </div>
            )}
          </a>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}