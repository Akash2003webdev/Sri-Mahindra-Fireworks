import { useRef, useState } from "react";
import {
  Sparkles,
  Home,
  Gift,
  X,
  Menu,
  ChevronDown,
  User,
  BadgePercent,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { MORE_LINKS } from "./MoreSheet";
import logo from "../assets/logo.png";
import { restaurantInfo } from "../lib/data";

const DESKTOP_NAV = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "Products", icon: Sparkles, isButton: true },
  { key: "offer", label: "Offers", icon: BadgePercent },
];

const ALL_DRAWER_LINKS = [...DESKTOP_NAV, ...MORE_LINKS];

export default function Header({ onAdminTrigger, activePage, onNavigate }) {
  const timerRef = useRef(null);
  const [pressing, setPressing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { itemCount } = useCart();

  function startPress() {
    setPressing(true);

    timerRef.current = setTimeout(() => {
      onAdminTrigger?.();
      setPressing(false);
    }, 600);
  }

  function cancelPress() {
    setPressing(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function go(key) {
    setDrawerOpen(false);
    setMoreOpen(false);
    onNavigate?.(key);
  }

  return (
    <>
      <style>{`
        @keyframes headerMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Top Purple Marquee */}
      <div className="overflow-hidden bg-[#730ca8] py-2">
        <div className="flex w-max animate-[headerMarquee_28s_linear_infinite] gap-10 whitespace-nowrap px-4 text-[11px] font-medium tracking-wide text-white sm:text-xs">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              🎆 {restaurantInfo.name.toUpperCase()} — DIWALI 2026 BOOKING OPEN!
              &nbsp;•&nbsp; In compliance with Supreme Court orders, this site
              only provides price estimates for reference — no instant online
              sale of firecrackers. &nbsp;•&nbsp; Call {restaurantInfo.phone}{" "}
              for orders.
            </span>
          ))}
        </div>
      </div>

      {/* Main Header Navbar */}
      <header className="sticky top-0 z-50 flex flex-col bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-10">
          {/* Left: Brand / Logo + Shop Name */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 lg:hidden hover:bg-purple-50"
            >
              <Menu size={26} />
            </button>

            <button
              type="button"
              onMouseDown={startPress}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
              onClick={() => go("home")}
              className={`
                flex shrink-0 items-center gap-2.5 text-left transition-all duration-300
                hover:scale-105 ${pressing ? "scale-95" : ""}
              `}
            >
              <img
                src={logo}
                alt={restaurantInfo.name}
                className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-16"
              />

              {/* Shop Name visible on both Mobile & Desktop */}
              <div className="flex min-w-0 flex-col justify-center">
                <h1 className="truncate font-display text-[14px] sm:text-[16px] font-black tracking-tight leading-tight">
                  <span className="text-gray-900">Mahendra Fancy </span>
                  <span className="text-[#730ca8]">Crackers</span>
                </h1>
                <p className="mt-0.5 truncate text-[7.5px] font-bold uppercase tracking-[0.2em] text-gray-500 sm:text-[9px]">
                  Fireworks & Crackers
                </p>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {DESKTOP_NAV.map(({ key, label, isButton }) => {
              const active = activePage === key;

              if (isButton) {
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => go(key)}
                    className="rounded-lg bg-[#730ca8] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#5a0984] active:scale-95"
                  >
                    {label}
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => go(key)}
                  className={`
                    text-sm font-medium transition-colors
                    ${active ? "text-[#730ca8] font-bold" : "text-gray-700 hover:text-[#730ca8]"}
                  `}
                >
                  {label}
                </button>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={`
                  flex items-center gap-1.5 text-sm font-medium transition-colors
                  ${
                    moreOpen || MORE_LINKS.some((l) => l.key === activePage)
                      ? "text-[#730ca8] font-bold"
                      : "text-gray-700 hover:text-[#730ca8]"
                  }
                `}
              >
                More
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {moreOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreOpen(false)}
                  />
                  <div className="absolute left-1/2 top-[calc(100%+15px)] z-50 w-56 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    {MORE_LINKS.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => go(key)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                          activePage === key
                            ? "bg-purple-50 text-[#730ca8]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#730ca8]"
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right: Action Icons */}
          <div className="flex shrink-0 items-center gap-3 lg:gap-4">
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#fdf3eb] text-[#730ca8] transition-colors hover:bg-orange-100 lg:flex"
              aria-label="User profile"
            >
              <User size={18} />
            </button>

            <button
              type="button"
              onClick={() => go("cart")}
              aria-label="Open cart"
              className="
                relative flex h-11 w-11 items-center justify-center
                rounded-full bg-[#fdf3eb] text-[#730ca8]
                transition-transform hover:scale-105 active:scale-95 lg:h-12 lg:w-12
              "
            >
              <ShoppingBag size={20} className="lg:h-5 lg:w-5" />

              {itemCount > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex h-5 w-5 items-center justify-center
                    rounded-full bg-[#ef233c] text-[10px] font-bold text-white shadow-sm
                  "
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Red Marquee */}
      <div className="overflow-hidden bg-[#ef4444] py-2 lg:py-2.5">
        <div className="flex w-max animate-[headerMarquee_25s_linear_infinite] gap-8 whitespace-nowrap px-4 text-[10px] font-bold tracking-widest text-white sm:text-xs md:text-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>DIWALI 2026 BOOKINGS OPEN! ORDER NOW!</span>
              <span className="text-yellow-300">✦</span>
              <span>100% SIVAKASI DIRECT FACTORY PRICE</span>
              <span className="text-yellow-300">✦</span>
              <span>ALL INDIA DOORSTEP DELIVERY AVAILABLE</span>
              <span className="text-yellow-300">✦</span>
              <span>PREMIUM QUALITY VERIFIED FIREWORKS</span>
              <span className="text-yellow-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/45 backdrop-blur-[2px]"
          />

          <aside
            className="
              absolute bottom-0 left-0 top-0
              flex w-[290px] max-w-[84%] flex-col
              bg-white
              shadow-2xl
              animate-slide-in-left
            "
          >
            <div className="border-b border-gray-100 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => go("home")}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <img
                    src={logo}
                    alt={restaurantInfo.name}
                    className="h-11 w-auto object-contain"
                  />
                  <div className="flex min-w-0 flex-col justify-center">
                    <h1 className="truncate font-display text-[15px] font-black tracking-tight">
                      <span className="text-gray-900">Mahendra Fancy </span>
                      <span className="text-[#730ca8]">Crackers</span>
                    </h1>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-full bg-gray-50 text-gray-500
                    transition-colors hover:bg-purple-100 hover:text-[#730ca8]
                  "
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {ALL_DRAWER_LINKS.map(({ key, label, icon: Icon, isButton }) => {
                const active = activePage === key;

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => go(key)}
                    className={`
                      flex w-full items-center gap-3
                      rounded-xl px-4 py-3.5
                      text-sm font-semibold
                      transition-all duration-300
                      ${
                        active || isButton
                          ? "bg-[#730ca8] text-white shadow-md"
                          : "text-gray-700 hover:bg-purple-50 hover:text-[#730ca8]"
                      }
                    `}
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        className={
                          active || isButton ? "text-white" : "text-gray-400"
                        }
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-gray-100 bg-gray-50 p-4">
              <button
                type="button"
                onClick={() => go("cart")}
                className="
                  relative flex w-full items-center justify-center gap-2
                  rounded-xl bg-[#730ca8] px-5 py-4
                  text-sm font-bold text-white
                  shadow-md shadow-purple-200
                  transition-transform active:scale-[0.98]
                "
              >
                <ShoppingBag size={18} />
                View Cart & Order
                {itemCount > 0 && (
                  <span className="absolute right-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#730ca8]">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
