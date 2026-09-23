import { createPortal } from "react-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

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

  if (!open) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-white/95 to-emerald-900/20 backdrop-blur-xl px-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="flex flex-col items-center text-center max-w-sm w-full bg-white/80 border border-white/80 shadow-[0_25px_60px_rgba(115,12,168,0.12)] p-8 rounded-[2.5rem] relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Success Animated Circle & Checkmark */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_15px_35px_rgba(16,185,129,0.4)] relative z-10"
          >
            <svg viewBox="0 0 52 52" className="w-14 h-14">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                fill="none"
                stroke="#fff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-18"
              />
            </svg>
          </motion.div>

          {/* Floating Sparkle Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-1 -right-1 w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#730ca8] to-[#8b3a9e] text-white flex items-center justify-center shadow-lg z-20"
          >
            <Sparkles size={18} />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display font-black text-3xl text-gray-900 tracking-tight"
        >
          Order Placed! 🎉
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-2.5 leading-relaxed"
        >
          We've received your order successfully. Our team will contact you
          within the next 24 hours to confirm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onDone?.()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
          >
            Track Your Order
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
