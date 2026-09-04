import { useEffect, useState, useRef } from "react";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ClipboardList,
  ShoppingBag,
  Sparkles
} from "lucide-react";

import MenuItemCard from "../components/MenuItemCard";
import Footer from "../components/Footer";
import FireworksCanvas from "../components/FireworksCanvas";
import {
  VideoGallery,
  BlogGrid,
} from "../components/NpkHome";

import {
  getCategories,
  getPopularItems,
  getOverallReviews,
} from "../lib/api";

import { useSEO } from "../lib/seo";
import { restaurantInfo } from "../lib/data";

const MOCK_BRANDS = [
  { name: "VANITHA", count: 35, image: "/logo.png" },
  { name: "BLUE STAR", count: 18, image: "/logo.png" },
  { name: "INF", count: 71, image: "/logo.png" },
  { name: "STANDARD", count: 9, image: "/logo.png" },
  { name: "SONNY", count: 4, image: "/logo.png" },
  { name: "AYYAN", count: 7, image: "/logo.png" },
  { name: "WOW STAR", count: 13, image: "/logo.png" },
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
    title: `${restaurantInfo.name} | Sivakasi Crackers Shop | Wholesale Crackers`,
    description: `Shop ${restaurantInfo.name} for premium pyrotech in Sivakasi. As a leading Sivakasi Crackers Shop, we offer a wide range of crackers and fireworks.`,
    path: "/",
  });

  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  
  const [currentMainSlide, setCurrentMainSlide] = useState(0);
  
  const categoryScrollRef = useRef(null);
  const brandScrollRef = useRef(null);
  const videoScrollRef = useRef(null);
  const sideBannerScrollRef = useRef(null);

  const mainSlides = [
    "/images/hero/hero-main-1.png",
    "/images/hero/hero-main-2.png",
    "/images/hero/hero-main-3.png"
  ];

  const sideSlides = [
    "/images/hero/hero-side-1.png",
    "/images/hero/hero-side-2.png",
    "/images/hero/hero-side-3.png" // Duplicated for scroll effect
  ];

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
    getPopularItems(8).then(setPopular);
    getOverallReviews();

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
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }, 1000);

    // Main Left Banner Fade-in/out
    const mainSliderInterval = setInterval(() => {
      setCurrentMainSlide((prev) => (prev + 1) % mainSlides.length);
    }, 3500); 

    // Auto-scroll for the right-side banners
    const sideSliderAutoScroll = setInterval(() => {
      if (sideBannerScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sideBannerScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sideBannerScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sideBannerScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(mainSliderInterval);
      clearInterval(sideSliderAutoScroll);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f4f6f9] pb-10">
      
      {/* Top Scrolling Banner */}
      <div className=" py-2 mb-4 md:mb-6">
        {/* <div className="flex w-max animate-[headerMarquee_25s_linear_infinite] gap-8 whitespace-nowrap px-4 text-[10px] md:text-[11px] font-bold tracking-widest text-white">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span><Flame size={14} className="inline mr-1 text-yellow-300"/> DIWALI 2026 BOOKINGS OPEN! ORDER NOW!</span>
              <span className="text-yellow-300">✦</span>
              <span>100% SIVAKASI DIRECT FACTORY PRICE</span>
              <span className="text-yellow-300">✦</span>
              <span>ALL INDIA DOORSTEP DELIVERY AVAILABLE</span>
              <span className="text-yellow-300">✦</span>
              <span>PREMIUM QUALITY VERIFIED FIREWORKS</span>
              <span className="text-yellow-300">✦</span>
            </span>
          ))}
        </div> */}
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-28 sm:px-6 md:px-8 lg:px-10 space-y-12 md:space-y-16">
        
        {/* Mobile & Desktop Optimized Hero Section */}
        <section className="relative">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:h-[550px]">
            
            {/* Main Horizontal Banner (Super Combo) */}
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
                    idx === currentMainSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none"></div>
            </div>

            {/* Side Vertical Banners (Sonny, Ananda's) - Taller for Mobile View */}
<div className="lg:col-span-5 relative w-full h-[670px] sm:h-[580px] lg:h-full rounded-[20px] md:rounded-[24px] overflow-hidden">              <div 
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
          <div className="p-8 md:p-12 text-center text-white rounded-[24px] shadow-lg" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #311042 100%)' }}>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-yellow-400 block mb-2">Limited Time Offer</span>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white mb-3 leading-tight">Diwali 2026 Special Booking Open!</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6 text-xs md:text-base leading-relaxed">
              Order your premium quality Sivakasi firecrackers online. Get 100% direct factory pricing, secure checkout, and reliable doorstep delivery.
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

        {/* Custom YouTube Gallery */}
        <section className="py-6 md:py-8">
          <SectionTitle 
            subtitle="Visual Experience" 
            title={<>Watch Our Fireworks <br className="hidden md:block" /> in Action</>} 
            description="Experience the mesmerizing aerial patterns and crackling sound effects of our premium fireworks gallery."
          />
          
          <div className="relative mt-8 md:mt-12 group">
             <button
              onClick={() => scrollContainer(videoScrollRef, "left")}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-orange-50 hover:text-[#ff6d00] opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>

            <div 
              ref={videoScrollRef}
              className="flex overflow-x-auto gap-4 md:gap-6 pb-8 px-4 md:px-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {[
                { url: "#", thumb: "/images/yt/hqdefault.953fd.jpg", title: "Combo Pack Demo" },
                { url: "#", thumb: "/images/yt/hqdefault.9117d.jpg", title: "Sky Shots" },
                { url: "#", thumb: "/images/yt/hqdefault.eb72b.jpg", title: "Shop Tour" },
                { url: "#", thumb: "/images/yt/hqdefault.60ca5.jpg", title: "Family Pack" },
              ].map((video, idx) => (
                <div 
                  key={idx}
                  className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[400px] snap-center shrink-0 relative rounded-[20px] md:rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer group/video border border-gray-100/50"
                >
                  <img 
                    src={video.thumb} 
                    alt={video.title} 
                    className="w-full h-[200px] md:h-[260px] object-cover transition-transform duration-700 group-hover/video:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover/video:bg-black/5"></div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-[#ff6d00] rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(255,109,0,0.6)] transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-[#ff8a00]">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1 md:ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollContainer(videoScrollRef, "right")}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-gray-700 transition-all hover:bg-orange-50 hover:text-[#ff6d00] opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
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
                      src={cat.image || "/logo.png"} 
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain drop-shadow-sm rounded-lg"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h5 className="font-black text-[#0f172a] text-[12px] md:text-[14px] uppercase tracking-wide leading-snug mb-3 line-clamp-2">
                      {cat.name}
                    </h5>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full inline-block border border-slate-200">
                      {cat.count || Math.floor(Math.random() * 20) + 1} items
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
          <div className="p-8 md:p-12 text-center text-white rounded-[24px] shadow-lg" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #db2777 100%)' }}>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-yellow-400 block mb-2">Safe & Sound Celebrations</span>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white mb-3 leading-tight">Kids' Favourite Fireworks Collection 🎇</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6 text-xs md:text-base leading-relaxed">
              Bring smiles and bright lights safely with our custom sparklers, flower pots, and ground chakkars formulated specially for kids.
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

        {/* Shop By Brand */}
        <section className="relative">
          <SectionTitle 
            subtitle="Trusted Manufacturers" 
            title="Shop by Brand" 
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
              {MOCK_BRANDS.map((brand, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onNavigate("menu")}
                  className="group/card w-[170px] min-w-[170px] md:w-[220px] md:min-w-[220px] shrink-0 snap-start flex flex-col items-center justify-between p-5 md:p-6 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 border border-gray-100/80"
                >
                  <div className="h-[80px] w-[80px] md:h-[110px] md:w-[110px] flex items-center justify-center mb-5 transition-transform duration-500 group-hover/card:scale-110 bg-gray-50 rounded-full border border-gray-200 p-3">
                    <img 
                      src={brand.image} 
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h5 className="font-black text-[#0f172a] text-[12px] md:text-[14px] uppercase tracking-wide leading-snug mb-3 line-clamp-2">
                      {brand.name}
                    </h5>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full inline-block border border-slate-200">
                      {brand.count} items
                    </span>
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

        {/* Combo Packs (Grid format) */}
        <section>
          <SectionTitle 
            subtitle="Family Packs" 
            title="COMBO PACK" 
            description="Pre Defined Packs for our Valuable customers"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {popular.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => onSelectItem(item)}
                onToast={onToast}
              />
            ))}
          </div>
        </section>

        {/* Premium Experience Promo Banner */}
        <section>
          <div className="rounded-[24px] shadow-lg p-8 md:p-12 text-center relative overflow-hidden" style={{ background: 'linear-gradient(to right, #2e1065, #701a75, #be185d)' }}>
            <div className="relative z-10">
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.15em] text-yellow-400 block mb-2 md:mb-3">Premium Sivakasi Quality</span>
              <h2 className="font-display text-2xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">Experience the Sky-Show Magic</h2>
              <p className="text-white/80 max-w-3xl mx-auto mb-6 md:mb-8 text-xs md:text-base leading-relaxed">
                Looking for something grand? Explore our premium multi-shot aerial series and sparklers for an unforgettable celebration.
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
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">Premium Quality</span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">Best Quality from Verified Manufacturers</h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img src="/logo.png" alt="Icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="bg-[#8b3a9e] rounded-[24px] p-5 md:p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="relative z-10 w-2/3 pr-2">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">Trusted Partners</span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">We are collab with Top Partners from Sivakasi</h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img src="/logo.png" alt="Icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="bg-[#a3a847] rounded-[24px] p-5 md:p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
              <div className="relative z-10 w-2/3 pr-2">
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5 block">Authentic Brands</span>
                <h3 className="text-white font-black text-[15px] md:text-xl leading-snug">We are Selling Crackers from Authentic Brands</h3>
              </div>
              <div className="relative z-10 w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                <div className="w-full h-full rounded-full overflow-hidden border border-dashed border-purple-300 p-1">
                  <img src="/logo.png" alt="Icon" className="w-full h-full object-contain" />
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
                <div key={idx} className="flex flex-col items-center justify-center w-[70px] h-[75px] md:w-[100px] md:h-[105px] bg-[#1e293b]/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-inner">
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
              Make this Diwali spectacular with verified quality Sivakasi crackers directly from the factory.
            </p>
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
              }
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
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-gradient-to-r from-[#ff6d00] to-[#ff1744] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                    {post.badge}
                  </div>
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                    {post.date}
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1 text-left">
                  <h4 className="font-bold text-gray-900 text-base md:text-lg mb-2 md:mb-3 leading-snug">{post.title}</h4>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">{post.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer onNavigate={onNavigate} />

      {/* Floating Action Buttons */}
      {/* <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[90] flex flex-col gap-3">
        <button
          onClick={() => onNavigate("menu")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-[#730ca8] text-white shadow-[0_10px_20px_rgba(115,12,168,0.3)] hover:scale-110 transition-transform cursor-pointer"
          title="Quick Enquiry"
        >
          <ClipboardList size={20} />
        </button>
        
        <a
          href={`https://wa.me/${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform cursor-pointer"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      </div> */}
    </div>
  );
}