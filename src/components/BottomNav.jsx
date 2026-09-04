import { Home, Sparkles, Gift, MoreHorizontal, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "Products", icon: Sparkles },
  { key: "cart", label: "Cart", icon: ShoppingBag, raised: true },
  { key: "offers", label: "Gift Box", icon: Gift },
  { key: "more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav({ activePage, onNavigate, onMoreClick }) {
  const { itemCount } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(107,21,34,0.08)]">
      <div className="max-w-5xl mx-auto flex items-end justify-around px-2 pt-2 pb-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon, raised }) => {
          const active = activePage === key;

          if (raised) {
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className="relative flex flex-col items-center gap-0.5 px-3 -mt-7 min-w-[56px]"
              >
                <span
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg ring-4 ring-white transition-colors ${
                    active ? "bg-primary-700" : "bg-primary-600"
                  }`}
                >
                  <Icon size={22} className="text-white" strokeWidth={2.4} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 right-0 bg-gold-400 text-primary-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] font-bold ${active ? "text-primary-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={key}
              onClick={() => (key === "more" ? onMoreClick() : onNavigate(key))}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px]"
            >
              <Icon
                size={22}
                className={active ? "text-primary-500" : "text-gray-400"}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary-500" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
