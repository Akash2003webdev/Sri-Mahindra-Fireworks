import { MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { restaurantInfo } from "../lib/data";
import { buildOrderMessage, sendWhatsAppMessage } from "../lib/whatsapp";

export default function FloatingWhatsApp({ onNavigate }) {
  const { items } = useCart();

  function handleClick() {
    if (items.length > 0) {
      onNavigate("cart");
      return;
    }
    sendWhatsAppMessage(
      `Hi ${restaurantInfo.name}! I'd like to know more about your crackers.`
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-30 group">
      {/* Tooltip - desktop only */}
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg">
        {items.length > 0 ? "View your order" : "Chat with us"}
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
      </span>

      {/* Ping ring animation */}
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />

      <button
        onClick={handleClick}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl ring-4 ring-white/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="text-white drop-shadow-sm" strokeWidth={2.2} />

        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
            {items.length}
          </span>
        )}
      </button>
    </div>
  );
}