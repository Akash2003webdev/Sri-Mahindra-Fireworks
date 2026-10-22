import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const COLORS = [
  "#730ca8",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#38bdf8",
  "#f43f5e",
  "#facc15",
  "#8b3a9e",
];

// Small seeded-ish random helper (called once via useMemo)
const rand = (min, max) => Math.random() * (max - min) + min;

function useBurst(count, { minDist, maxDist, gravity }) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
        const dist = rand(minDist, maxDist);
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          fall: gravity + rand(0, gravity * 0.6),
          rotate: rand(-540, 540),
          size: rand(6, 12),
          round: Math.random() > 0.6,
          color: COLORS[i % COLORS.length],
          delay: rand(0, 0.08),
          duration: rand(1.6, 2.4),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}

function useRain(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        drift: rand(-60, 60),
        size: rand(6, 11),
        round: Math.random() > 0.5,
        color: COLORS[i % COLORS.length],
        delay: rand(0.6, 3.2),
        duration: rand(2.8, 4.8),
        rotate: rand(360, 1080),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}

const SPARKS = [
  { x: -78, y: -70, s: 16, d: 0.55 },
  { x: 82, y: -52, s: 12, d: 0.7 },
  { x: -90, y: 22, s: 10, d: 0.8 },
  { x: 88, y: 48, s: 15, d: 0.62 },
  { x: -34, y: 92, s: 11, d: 0.9 },
  { x: 40, y: -96, s: 13, d: 0.75 },
];

export default function OrderSuccessOverlay({
  open,
  onDone,
  autoCloseMs = 6000,
}) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onDone?.(), autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, onDone, autoCloseMs]);

  const burst = useBurst(46, { minDist: 140, maxDist: 320, gravity: 220 });
  const burst2 = useBurst(30, { minDist: 90, maxDist: 220, gravity: 180 });
  const rain = useRain(34);

  if (!open) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-gradient-to-br from-purple-900/50 via-white/95 to-emerald-900/30 backdrop-blur-xl px-6 overflow-hidden"
    >
      {/* Slow rotating sunburst behind the card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
        className="absolute w-[900px] h-[900px] max-w-none rounded-full pointer-events-none opacity-60"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(16,185,129,0.10) 0deg 10deg, transparent 10deg 20deg)",
          maskImage:
            "radial-gradient(circle, black 0%, black 30%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 0%, black 30%, transparent 68%)",
        }}
      />

      {/* Confetti rain from the top */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {rain.map((c) => (
          <motion.span
            key={c.id}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: "105vh",
              x: c.drift,
              opacity: [0, 1, 1, 0.9],
              rotate: c.rotate,
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
            className="absolute top-0 block"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.round ? c.size : c.size * 1.6,
              borderRadius: c.round ? "9999px" : 2,
              backgroundColor: c.color,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 16, stiffness: 220 }}
        className="relative flex flex-col items-center text-center max-w-sm w-full bg-white/85 border border-white/80 shadow-[0_30px_80px_rgba(115,12,168,0.22)] p-8 rounded-[2.5rem] overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-200/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-200/60 rounded-full blur-2xl pointer-events-none" />

        {/* Tick + effects */}
        <div className="relative mb-6 w-28 h-28 flex items-center justify-center">
          {/* Expanding ripple rings */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.8, opacity: 0.55 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{
                duration: 2,
                delay: 0.35 + i * 0.55,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400 pointer-events-none"
            />
          ))}

          {/* Confetti burst (origin = tick circle) */}
          <div className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none z-30">
            {[...burst.map((p) => ({ ...p, wave: 0.35 })), ...burst2.map((p) => ({ ...p, wave: 1.1 }))].map(
              (p, idx) => (
                <motion.span
                  key={`${p.wave}-${idx}`}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    x: [0, p.x, p.x * 1.1],
                    y: [0, p.y, p.y + p.fall],
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.8],
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.wave + p.delay,
                    ease: "easeOut",
                    times: [0, 0.45, 1],
                  }}
                  className="absolute block"
                  style={{
                    width: p.size,
                    height: p.round ? p.size : p.size * 0.55,
                    borderRadius: p.round ? "9999px" : 2,
                    backgroundColor: p.color,
                  }}
                />
              ),
            )}
          </div>

          {/* Main green circle */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: [0, 1.25, 0.94, 1], rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center relative z-10"
            style={{ boxShadow: "0 15px 40px rgba(16,185,129,0.5)" }}
          >
            {/* Gentle breathing glow after the pop */}
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(16,185,129,0.45)",
                  "0 0 0 18px rgba(16,185,129,0)",
                ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 1 }}
              className="absolute inset-0 rounded-full"
            />
            <svg viewBox="0 0 52 52" className="w-14 h-14 relative">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                fill="none"
                stroke="#fff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-18"
              />
            </svg>

            {/* Shine sweep */}
            <motion.span
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 0.9, delay: 1.0, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 rounded-full"
            />
          </motion.div>

          {/* Twinkling sparkles around the circle */}
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.6, 1.1, 0], opacity: [0, 1, 0.7, 1, 0] }}
              transition={{
                duration: 1.8,
                delay: s.d + 0.4,
                repeat: Infinity,
                repeatDelay: 0.8,
              }}
              className="absolute z-20 text-amber-400 pointer-events-none"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
                marginLeft: -s.s / 2,
                marginTop: -s.s / 2,
              }}
            >
              <Sparkles size={s.s} fill="currentColor" />
            </motion.span>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.75, type: "spring", stiffness: 260, damping: 18 }}
          className="font-display font-black text-3xl text-gray-900 tracking-tight"
        >
          Order Placed!{" "}
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, -18, 18, -12, 12, 0], scale: [1, 1.25, 1] }}
            transition={{ duration: 1, delay: 1.1, repeat: Infinity, repeatDelay: 2 }}
          >
            🎉
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-500 mt-2.5 leading-relaxed"
        >
          We've received your order successfully. Our team will contact you
          within the next 24 hours to confirm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          className="w-full mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onDone?.()}
            className="relative overflow-hidden w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            <motion.span
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 1.2, delay: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 pointer-events-none"
            />
            <span className="relative">Track Your Order</span>
            <motion.span
              className="relative"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Auto-close progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-100/70">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-purple-500"
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
