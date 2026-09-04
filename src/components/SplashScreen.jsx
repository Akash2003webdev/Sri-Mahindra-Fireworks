import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { restaurantInfo } from "../lib/data";

const DISPLAY_MS = 2600;
const FADE_OUT_MS = 500;

// Deterministic-ish sparkle positions so they don't jump around on re-render.
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 3 + (i % 4),
  delay: (i % 6) * 0.3,
  duration: 1.8 + (i % 5) * 0.4,
}));

export default function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);

  const displayTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);

  const sparkles = useMemo(() => SPARKLES, []);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    setFadingOut(true);

    clearTimeout(displayTimerRef.current);

    finishTimerRef.current = setTimeout(() => {
      onFinishRef.current?.();
    }, FADE_OUT_MS);
  }, []);

  useEffect(() => {
    displayTimerRef.current = setTimeout(finish, DISPLAY_MS);

    return () => {
      clearTimeout(displayTimerRef.current);
      clearTimeout(finishTimerRef.current);
    };
  }, [finish]);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 transition-opacity duration-500 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-[100px]" />

      {/* Sparkles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pointer-events-none absolute rounded-full bg-gold-300 splash-sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center splash-logo-in">
        <img
          src="/logo.png"
          alt={restaurantInfo.name}
          className="w-[220px] max-w-[70vw] object-contain drop-shadow-[0_10px_40px_rgba(234,172,31,0.35)] sm:w-[280px] md:w-[340px]"
        />

        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-gold-300 sm:text-base">
          {restaurantInfo.tagline}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gold-400 splash-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
