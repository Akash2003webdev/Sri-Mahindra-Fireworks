import { createPortal } from "react-dom";
import {
  X,
  Info,
  ShieldAlert,
  Receipt,
  MessageCircleQuestion,
  MessageSquareText,
} from "lucide-react";

export const MORE_LINKS = [
  { key: "price-list", label: "Price List", icon: Receipt },
  { key: "about", label: "About Us", icon: Info },
  { key: "safety-tips", label: "Safety Tips", icon: ShieldAlert },
  { key: "enquiry", label: "Enquiry", icon: MessageCircleQuestion },
  { key: "reviews", label: "Reviews", icon: MessageSquareText },
];

// Mobile-only bottom sheet, opened from the "More" tab in BottomNav.
export default function MoreSheet({ open, onClose, onNavigate }) {
  if (!open) return null;

  function go(key) {
    onClose();
    onNavigate(key);
  }

  return createPortal(
    <div className="fixed inset-0 z-[9998] md:hidden">
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 pb-8 shadow-card animate-fadeUp">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-primary-700">More</h3>
          <button onClick={onClose} className="text-gray-400" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {MORE_LINKS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => go(key)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold bg-gray-50 text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gold-600 shadow-sm">
                <Icon size={18} />
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
