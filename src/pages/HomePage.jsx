import { useEffect, useState, useRef } from "react";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ClipboardList,
  ShoppingBag,
  Sparkles,
  PenLine,
  Quote,
  Tag,
} from "lucide-react";

import MenuItemCard from "../components/MenuItemCard";
import Footer from "../components/Footer";
import FireworksCanvas from "../components/FireworksCanvas";
import Stars from "../components/Stars";
import { VideoGallery, BlogGrid } from "../components/NpkHome";

import {
  getCategories,
  getPopularItems,
  getMenuItems,
  getOverallReviews,
  getBanners,
  getBrands,
  getOffers,
  getCoupons,
} from "../lib/api";
import CouponCard from "../components/CouponCard";

import { useSEO } from "../lib/seo";
import { restaurantInfo, getCategoryDisplayName } from "../lib/data";
import categoryPlaceholder from "../assets/placeholder.png";

// Used only until an admin uploads real banners/brands in the DB — once
// Admin → Banners / Admin → Brands has rows, those replace these.
const FALLBACK_MAIN_SLIDES = [
  "/images/hero/hero-main-1.png",
  "/images/hero/hero-main-2.png",
  "/images/hero/hero-main-3.png",
];

const FALLBACK_SIDE_SLIDES = [
  "/images/hero/hero-side-1.png",
  "/images/hero/hero-side-2.png",
  "/images/hero/hero-side-3.png",
];

// Helper component for Section Titles with Underline (Mobile Optimized)
const SectionTitle = ({ subtitle, title, description }) => (
  <div className="text-center mb-8 md:mb-10">
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#ff6d00] mb-2 block">
      {subtitle}
    </span>
    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-[#0f172a] mb-3 leading-tight">
      {title}
    </h2>
    <div className="h-1 w-16 bg-gradient-to-r from-[#ff6d00] to-[#ff1744] mx-auto rounded-full mb-4"></div>
    {description && (
      <p className="text-slate-500 max-w-2xl mx-auto text-xs md:text-sm px-4 leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

export default function HomePage({
  onNavigate,
  onSelectCategory,
  onSelectItem,
  onToast,
}) {
  useSEO({
    title: `${restaurantInfo.name} | Crackers Shop in Sattur & Elayirampannai | Sivakasi Fireworks`,
    description: `Buy Diwali crackers online from ${restaurantInfo.name} — sparklers, flower pots, sound crackers, aerial shots & gift boxes, Sivakasi quality. Home delivery & pickup in Sattur, Elayirampannai, Virudhunagar. Wholesale & retail.`,
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where can I buy crackers online near Sattur?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `${restaurantInfo.name} sells sparklers, flower pots, sound crackers, aerial shots and gift boxes online with home delivery and store pickup in Sattur, Elayirampannai and nearby areas.`,
          },
        },
        {
          "@type": "Question",
          name: "Does Mahendra Fancy Crackers deliver to my area?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we deliver across Sattur, Elayirampannai, Virudhunagar, Kovilpatti and nearby towns, and also offer in-store pickup at our Elayirampannai outlet.",
          },
        },
        {
          "@type": "Question",
          name: "Do you sell wholesale crackers for Diwali?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we supply both retail and wholesale quantities of Sivakasi-made fireworks and crackers, including Bairava Brand products.",
          },
        },
      ],
    },
  });

  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [brands, setBrands] = useState([]);
  const [banners, setBanners] = useState([]);
  const [ownGifts, setOwnGifts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [currentMainSlide, setCurrentMainSlide] = useState(0);

  const categoryScrollRef = useRef(null);
  const brandScrollRef = useRef(null);
  const videoScrollRef = useRef(null);
  const sideBannerScrollRef = useRef(null);
  const couponScrollRef = useRef(null);
  const comboScrollRef = useRef(null);
  const reviewScrollRef = useRef(null);

  // The bundled placeholder images always show first. Whatever the admin
  // adds under Admin → Banners (tagged Main or Side) shows right after them,
  // instead of replacing them.
  const backendMainImages = banners
    .filter((b) => (b.placement || "main") === "main")
    .map((b) => b.image)
    .filter(Boolean);
  const backendSideImages = banners
    .filter((b) => b.placement === "side")
    .map((b) => b.image)
    .filter(Boolean);
  const mainSlides = [...FALLBACK_MAIN_SLIDES, ...backendMainImages];
  const sideSlides = [...FALLBACK_SIDE_SLIDES, ...backendSideImages];

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
    getOverallReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
    getBanners()
      .then(setBanners)
      .catch(() => setBanners([]));
    getBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
    getOffers()
      .then(setOwnGifts)
      .catch(() => setOwnGifts([]));
    getCoupons()
      .then(setCoupons)
      .catch(() => setCoupons([]));

    // Diwali 2026 Countdown Logic (Nov 8, 2026)
    const targetDate = new Date("November 8, 2026 00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    // Auto-scroll for the right-side banners
    const sideSliderAutoScroll = setInterval(() => {
      if (sideBannerScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          sideBannerScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sideBannerScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sideBannerScrollRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(sideSliderAutoScroll);
    };
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const giftBoxCategory = categories.find(
      (c) => c.name?.trim().toLowerCase() === "gift box",
    );
    if (giftBoxCategory) {
      getMenuItems({ categoryId: giftBoxCategory.id })
        .then(setPopular)
        .catch(() => setPopular([]));
    } else {
      getPopularItems(8)
        .then(setPopular)
        .catch(() => setPopular([]));
    }
  }, [categories]);

  useEffect(() => {
    setCurrentMainSlide(0);
    if (mainSlides.length <= 1) return;
    const mainSliderInterval = setInterval(() => {
      setCurrentMainSlide((prev) => (prev + 1) % mainSlides.length);
    }, 3500);
    return () => clearInterval(mainSliderInterval);
  }, [mainSlides.length]);

  const handleCategorySelect = (cat) => {
    if (onSelectCategory) onSelectCategory(cat);
  };

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 350;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const giftBoxCategory = categories.find(
    (c) => c.name?.trim().toLowerCase() === "gift box",
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] mt-3 pb-10">
      {/* Main Container */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-28 sm:px-6 md:px-8 lg:px-10 space-y-12 md:space-y-16">
        {/* Mobile & Desktop Optimized Hero Section */}
        <section className="relative">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:h-[550px]">
            <div
              className="lg:col-span-7 relative overflow-hidden rounded-[20px] md:rounded-[24px] shadow-lg cursor-pointer group bg-[#1a1040] h-[350px] sm:h-[450px] lg:h-full shrink-0"
              onClick={() => onNavigate("menu")}
            >
              {mainSlides.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Mega Sale Diwali Banner ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    idx === currentMainSlide
                      ? "opacity-100 z-10 scale-100"
                      : "opacity-0 z-0 scale-105"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none"></div>
            </div>

            <div className="lg:col-span-5 relative w-full h-[670px] sm:h-[580px] lg:h-full rounded-[20px] md:rounded-[24px] overflow-hidden">
              <div
                ref={sideBannerScrollRef}
                className="flex overflow-x-auto gap-4 h-full snap-x snap-mandatory no-scrollbar pb-2"
              >
                {sideSlides.map((src, idx) => (
                  <div
                    key={idx}
                    className="min-w-full lg:min-w-[calc(50%-8px)] snap-center relative h-full rounded-[20px] md:rounded-[24px] overflow-hidden shadow-md cursor-pointer group bg-[#0d2a45]"
                    onClick={() => onNavigate("menu")}
                  >
                    <img
                      src={src}
                      alt={`Premium Brands Banner ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-30">
            <FireworksCanvas density={1100} opacity={0.65} maxRockets={2} />
          </div>
        </section>

        {/* Promo Banner 1 */}
        <section>
          <div
            className="p-8 md:p-12 text-center text-white rounded-[24px] shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #311042 100%)",
            }}
          >
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-yellow-400 block mb-2">
              Limited Time Offer
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              Diwali 2026 Special Booking Open!
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6 text-xs md:text-base leading-relaxed">
              Order your premium quality Sivakasi firecrackers online. Get 100%
              direct factory pricing, secure checkout, and reliable doorstep
              delivery.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("menu")}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff4757] px-6 py-3 md:px-8 md:py-3.5 text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform"
            >
              <ShoppingBag size={16} /> Quick Enquiry / Order Now
            </button>
          </div>
        </section>

        {/* Shop By Category */}
        <section className="relative">
          <SectionTitle
            subtitle="Premium Categories"
            title="Shop by Category"
            description="Explore our curated collections of sparkling fireworks, sky shot aerials, kids sparklers, and festival crackers."
          />

          <div className="relative group">
            <button
              onClick={() => scrollContainer(categoryScrollRef, "left")}
              className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex overflow-x-auto gap-6 md:gap-8 pb-8 px-2 md:px-4 no-scrollbar scroll-smooth snap-x"
            >
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategorySelect(cat)}
                  className="group/card w-[170px] min-w-[170px] md:w-[220px] md:min-w-[220px] shrink-0 snap-start flex flex-col items-center justify-between p-5 md:p-6 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 border border-gray-100/80"
                >
                  <div className="h-[100px] md:h-[130px] w-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover/card:scale-110">
                    <img
                      src={cat.image || categoryPlaceholder}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain drop-shadow-sm rounded-lg"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h5 className="font-black text-[#0f172a] text-[12px] md:text-[14px] uppercase tracking-wide leading-snug mb-3 line-clamp-2">
                      {getCategoryDisplayName(cat.name)}
                    </h5>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full inline-block border border-slate-200">
                      {cat.count ?? 0} items
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollContainer(categoryScrollRef, "right")}
              className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Safe & Sound Celebrations Promo */}
        <section>
          <div
            className="p-8 md:p-12 text-center text-white rounded-[24px] shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #db2777 100%)",
            }}
          >
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-yellow-400 block mb-2">
              Safe & Sound Celebrations
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              Kids' Favourite Fireworks Collection 🎇
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6 text-xs md:text-base leading-relaxed">
              Bring smiles and bright lights safely with our custom sparklers,
              flower pots, and ground chakkars formulated specially for kids.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("menu")}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff4757] hover:bg-[#ff6b81] px-6 py-3 md:px-8 md:py-3.5 text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform"
            >
              <Sparkles size={16} /> Explore Kids Range
            </button>
          </div>
        </section>

        {/* Offers & Coupons Section */}
        {coupons.length > 0 && (
          <section className="relative">
            <SectionTitle
              subtitle="Extra Savings"
              title="Offers"
              description="Copy a coupon code and apply it at checkout on the Cart page."
            />

            <div className="relative group">
              <button
                onClick={() => scrollContainer(couponScrollRef, "left")}
                className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => scrollContainer(couponScrollRef, "right")}
                className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Added Offer Page Call-to-Action Banner Box */}
            <div className="mt-8">
              <div
                onClick={() => onNavigate("offer")}
                className="rounded-[24px] shadow-lg p-8 md:p-10 text-center relative overflow-hidden cursor-pointer group transition-transform hover:scale-[1.01]"
                style={{
                  background:
                    "linear-gradient(135deg, #064e3b 0%, #022c22 50%, #14532d 100%)",
                }}
              >
                <div className="relative z-10">
                  <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.15em] text-yellow-400 block mb-2">
                    Special Festival Deals
                  </span>
                  <h3 className="font-display text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
                    Want to Explore All Discounts & Special Combos?
                  </h3>
                  <p className="text-white/80 max-w-2xl mx-auto mb-6 text-xs md:text-base leading-relaxed">
                    Check out our dedicated offers page for exclusive festive
                    coupon codes, wholesale discount slabs, and gift hampers.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff4757] hover:bg-[#ff6b81] px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-bold text-white shadow-xl transition-transform group-hover:scale-105"
                  >
                    <Tag size={16} /> View All Offers & Deals
                  </button>
                </div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("offer")}
                className="text-xs font-bold text-[#730ca8] hover:text-[#8b3a9e] uppercase tracking-wider underline underline-offset-4"
              >
                View All Offers
              </button>
            </div>
          </section>
        )}

        {/* Gift Box Combos — ready-made combo gift boxes from Admin → Offers */}
        {ownGifts.length > 0 && (
          <section>
            <SectionTitle
              subtitle="Bundled & Ready"
              title="Combo Boxes"
              description="Hand-picked crackers bundled together at one special combo rate — order the whole box in one tap."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ownGifts.slice(0, 3).map((gift) => {
                const savings = gift.originalTotal - gift.rate;
                const coverImage = gift.image || gift.products?.[0]?.image;
                return (
                  <div
                    key={gift.id}
                    className="bg-white rounded-[24px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    <div className="relative h-[160px] w-full overflow-hidden bg-gray-100">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={gift.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#730ca8] to-[#8b3a9e]">
                          <Sparkles size={28} className="text-white/70" />
                        </div>
                      )}
                      {gift.isExpired && (
                        <div className="absolute inset-0 bg-white/55 flex items-center justify-center">
                          <span className="bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                            Expired
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 leading-snug">
                        {gift.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-display font-black text-xl text-[#730ca8]">
                          ₹{gift.rate}
                        </span>
                        {savings > 0 && (
                          <span className="text-xs text-gray-400 line-through font-semibold">
                            ₹{gift.originalTotal}
                          </span>
                        )}
                      </div>
                      {gift.isExpired ? (
                        <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs border border-rose-100">
                          Combo Expired
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate("offers")}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95"
                        >
                          <ShoppingBag size={14} /> View Gift Box
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("offers")}
                className="text-xs font-bold text-[#730ca8] hover:text-[#8b3a9e] uppercase tracking-wider underline underline-offset-4"
              >
                View All Gift Boxes
              </button>
            </div>
          </section>
        )}

        {/* Shop By Brand */}
        <section className="relative">
          <SectionTitle
            subtitle="Trusted Manufacturers"
            title="Our Brands"
            description="We collaborate directly with Sivakasi's top-rated authentic firecracker brands to ensure unmatched reliability."
          />

          <div className="relative group">
            <button
              onClick={() => scrollContainer(brandScrollRef, "left")}
              className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={brandScrollRef}
              className="flex overflow-x-auto gap-6 md:gap-8 pb-8 px-2 md:px-4 no-scrollbar scroll-smooth snap-x"
            >
              {brands.length === 0 && (
                <div className="w-full text-center py-8 text-slate-400 text-xs font-semibold">
                  Brands will appear here once added in Admin → Brands.
                </div>
              )}
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="group/card w-[170px] min-w-[170px] md:w-[220px] md:min-w-[220px] shrink-0 snap-start flex flex-col items-center justify-between p-5 md:p-6 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 border border-gray-100/80"
                >
                  <div className="h-[80px] w-[80px] md:h-[110px] md:w-[110px] flex items-center justify-center mb-5 transition-transform duration-500 group-hover/card:scale-110 bg-gray-50 rounded-full border border-gray-200 p-3">
                    <img
                      src={brand.image || "/logo.png"}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h5 className="font-black text-[#0f172a] text-[12px] md:text-[14px] uppercase tracking-wide leading-snug mb-3 line-clamp-2">
                      {brand.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollContainer(brandScrollRef, "right")}
              className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Combo Packs (Responsive: 2 Columns Grid on Mobile, Horizontal Scroll on Desktop) */}
        <section className="relative">
          <SectionTitle
            title="Gift Boxes"
            description="Ready-made Gift Box combos from our Gift Box category, pre-packed for our valuable customers"
          />

          {popular.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold bg-white rounded-[24px] border border-dashed border-gray-200">
              No Gift Box products yet — add items under the "Gift Box" category
              in Admin.
            </div>
          ) : (
            <>
              <div className="relative group">
                <button
                  onClick={() => scrollContainer(comboScrollRef, "left")}
                  className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  ref={comboScrollRef}
                  className="grid grid-cols-2 md:flex md:overflow-x-auto gap-3 md:gap-6 pb-2 px-2 md:px-4 no-scrollbar scroll-smooth snap-x"
                >
                  {popular.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="w-full md:w-[220px] md:min-w-[220px] shrink-0 snap-start"
                    >
                      <MenuItemCard
                        item={item}
                        onClick={() => onSelectItem(item)}
                        onToast={onToast}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollContainer(comboScrollRef, "right")}
                  className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() =>
                    giftBoxCategory
                      ? handleCategorySelect(giftBoxCategory)
                      : onNavigate("menu")
                  }
                  className="text-xs font-bold text-[#730ca8] hover:text-[#8b3a9e] uppercase tracking-wider underline underline-offset-4"
                >
                  View All Products
                </button>
              </div>
            </>
          )}
        </section>

        {/* Premium Experience Promo Banner */}
        <section>
          <div
            className="rounded-[24px] shadow-lg p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #2e1065, #701a75, #be185d)",
            }}
          >
            <div className="relative z-10">
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.15em] text-yellow-400 block mb-2 md:mb-3">
                Premium Sivakasi Quality
              </span>
              <h2 className="font-display text-2xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">
                Experience the Sky-Show Magic
              </h2>
              <p className="text-white/80 max-w-3xl mx-auto mb-6 md:mb-8 text-xs md:text-base leading-relaxed">
                Looking for something grand? Explore our premium multi-shot
                aerial series and sparklers for an unforgettable celebration.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("menu")}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff4757] hover:bg-[#ff6b81] px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-bold text-white shadow-xl hover:scale-105 transition-transform"
              >
                <Sparkles size={16} /> Book Premium Collection
              </button>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          </div>
        </section>

        {/* 3-Column Feature Banners */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#388e99] rounded-[24px] p-5 md:p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="relative z-10 w-2/3 pr-2">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">
                  Premium Quality
                </span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">
                  Best Quality from Verified Manufacturers
                </h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img
                    src="/logo.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#8b3a9e] rounded-[24px] p-5 md:p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="relative z-10 w-2/3 pr-2">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">
                  Trusted Partners
                </span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">
                  We are collab with Top Partners from Sivakasi
                </h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img
                    src="/logo.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#a3a847] rounded-[24px] p-5 md:p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="relative z-10 w-2/3 pr-2">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">
                  Authentic Brands
                </span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">
                  We are Selling Crackers from Authentic Brands
                </h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img
                    src="/logo.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Dark Theme Diwali Countdown */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#0f172a] shadow-2xl py-12 md:py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 to-[#0f172a]/95 z-0" />

          <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
            <FireworksCanvas density={800} opacity={0.6} maxRockets={1} />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#ff9100] mb-2 md:mb-3 block">
              Diwali Celebration 2026
            </span>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-black text-white mb-6 md:mb-12 leading-tight">
              Countdown to the Festival of Lights
            </h2>

            <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-6 md:mb-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center w-[70px] h-[75px] md:w-[100px] md:h-[105px] bg-[#1e293b]/85 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-inner"
                >
                  <span className="font-display text-2xl md:text-5xl font-black text-[#ff6d00] leading-none mb-1 md:mb-2">
                    {item.value}
                  </span>
                  <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 text-xs md:text-base max-w-xl mx-auto px-4 leading-relaxed">
              Make this Diwali spectacular with verified quality Sivakasi
              crackers directly from the factory.
            </p>
          </div>
        </section>

        {/* Customer Reviews — modern card layout + Write a Review CTA */}
        <section className="relative">
          <SectionTitle
            subtitle="In Their Words"
            title="Customer Reviews"
            description="Real feedback from customers who celebrated with our crackers."
          />

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold bg-white rounded-[24px] border border-dashed border-gray-200">
              No reviews yet — be the first to share your experience!
            </div>
          ) : (
            <div className="relative group">
              <button
                onClick={() => scrollContainer(reviewScrollRef, "left")}
                className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>

              <div
                ref={reviewScrollRef}
                className="flex overflow-x-auto gap-4 md:gap-6 pb-2 px-2 md:px-4 no-scrollbar scroll-smooth snap-x"
              >
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="relative bg-white rounded-[24px] p-5 md:p-6 shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100 flex flex-col w-[280px] min-w-[280px] md:w-[320px] md:min-w-[320px] shrink-0 snap-start"
                  >
                    <Quote
                      size={28}
                      className="text-[#ff6d00]/15 absolute top-4 right-5"
                    />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#730ca8] to-[#8b3a9e] flex items-center justify-center text-white font-black text-sm uppercase shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm truncate">
                          {r.name}
                        </h5>
                        <Stars rating={r.rating} size={12} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 flex-1">
                      {r.comment}
                    </p>
                    <span className="text-[11px] text-gray-400 mt-3 font-medium">
                      {r.date || "Just now"}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollContainer(reviewScrollRef, "right")}
                className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-purple-50 hover:text-[#730ca8] opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="text-center mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("reviews")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6d00] to-[#ff1744] px-6 py-3 text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform"
            >
              <PenLine size={16} /> Write a Review
            </button>
            {reviews.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigate("reviews")}
                className="text-xs font-bold text-[#730ca8] hover:text-[#8b3a9e] uppercase tracking-wider underline underline-offset-4"
              >
                View All Reviews
              </button>
            )}
          </div>
        </section>

        {/* Custom Blog / Safety Tips Section */}
        <section>
          <SectionTitle
            subtitle="Safety & Insights"
            title="Our Latest Posts & Tips"
            description="Stay informed with firework safety directions, booking announcements, and festival guides."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              {
                badge: "WHY?",
                date: "JAN 24",
                image: "/images/blog/blog4.jpg",
                title: `Why Choose NPK to Buy Fireworks?`,
                text: "Explore our wide range of products, from dazzling aerial displays to ground-based fountains that mesmerize and delight.",
              },
              {
                badge: "OFFER",
                date: "SEP 22",
                image: "/images/blog/blog1.jpg",
                title: "Flat 75% OFF for All Crackers",
                text: "NPK Crackers is a leading Fireworks & Crackers manufacturing company and online seller in Sivakasi. We are offering Flat 75% discount for all our customers.",
              },
              {
                badge: "SAFETY",
                date: "NOV 22",
                image: "/images/blog/blog2.jpg",
                title: "Do's and Don'ts Safety Guide",
                text: "At Firework Frenzy, safety is our top priority. Before lighting any fireworks, please remember to follow the instructions carefully.",
              },
              {
                badge: "LAW",
                date: "FEB 23",
                image: "/images/blog/blog3.jpg",
                title: "Directions Regulating Firecrackers",
                text: "As per the Supreme Court order, Online sales of firecrackers banned from 2018. We obey the order and we don't permit online purchase of crackers.",
              },
            ].map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col cursor-pointer"
              >
                <div className="relative h-[180px] md:h-[200px] w-full overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:last:left-4 bg-gradient-to-r from-[#ff6d00] to-[#ff1744] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                    {post.badge}
                  </div>
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                    {post.date}
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1 text-left">
                  <h4 className="font-bold text-gray-900 text-base md:text-lg mb-2 md:mb-3 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {post.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}