import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import MenuItemCard from "../components/MenuItemCard";
import { getMenuItems } from "../lib/api";
import { useSEO } from "../lib/seo";

export default function CategoryPage({ category, onBack, onSelectItem, onToast }) {
  useSEO({
    title: category
      ? `${category.name} | Sri Mahindra Fireworks`
      : "Product Category | Sri Mahindra Fireworks",
    description: category
      ? `${category.name} at Sri Mahindra Fireworks, Sattur. Order online for home delivery or store pickup.`
      : "Browse this crackers category at Sri Mahindra Fireworks, Sattur.",
    path: category ? `/category/${category.id}` : undefined,
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      setLoading(true);
      getMenuItems({ categoryId: category.id })
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-12 pb-28 md:pb-20 min-h-screen bg-[#fffaf3]">
      
      {/* Premium Header Bar */}
      <div className="flex items-center gap-4 mb-8 md:mb-12 animate-fade-in">
        {/* Back Button with Premium Glass Effect */}
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-700 hover:text-gold-500 hover:border-gold-200 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div>
          <span className="flex items-center gap-1.5 text-gold-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5">
            <Sparkles size={11} /> Category
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-gray-950 tracking-tight">
            {category?.name}
          </h1>
        </div>
      </div>

      {/* Grid Content / Loading States */}
      {loading ? (
        /* Premium Skeleton Loading Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-gray-100/80 rounded-2xl p-3 space-y-3 animate-pulse">
              <div className="bg-gray-100 rounded-xl h-28 md:h-36 w-full" />
              <div className="h-4 bg-gray-100 rounded-md w-3/4" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Modern Empty State Container */
        <div className="max-w-sm mx-auto text-center py-16 px-6 bg-white border border-gray-100 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 mb-4">
            <Sparkles size={20} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Nothing Here Yet</h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            We are restocking this category — check back soon!
          </p>
        </div>
      ) : (
        /* Premium Items Grid Layout */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          {items.map((item) => (
            <div key={item.id} className="transition-all duration-300 hover:-translate-y-1">
              <MenuItemCard
                item={item}
                onClick={() => onSelectItem(item)}
                onToast={onToast}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}