import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, ShoppingBag, LayoutGrid, List, ArrowRight } from "lucide-react";
import { getCategories, getMenuItems } from "../lib/api";
import { useSEO } from "../lib/seo";
import { useCart } from "../context/CartContext";
import { getCategoryDisplayName } from "../lib/data";
import logo from "../assets/placeholder.png";

const MENU_VIEW_KEY = "slc_menu_view_v1";

export default function MenuPage({ onSelectCategory, onSelectItem, onToast }) {
  const navigate = useNavigate();
  const { items: cartItems, addItem, updateQuantity, subtotal = 0 } = useCart();

  useSEO({
    title: "Products | Mahendra Fancy Crackers - Full Cracker Catalogue",
    description:
      "Explore the full range of crackers at Mahendra Fancy Crackers, Sattur — sparklers, flower pots, sound crackers, aerial shots, gift boxes and more.",
    path: "/menu",
  });

  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewMode, setViewModeState] = useState(
    () => sessionStorage.getItem(MENU_VIEW_KEY) || "list"
  );

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function setViewMode(mode) {
    setViewModeState(mode);
    sessionStorage.setItem(MENU_VIEW_KEY, mode);
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchMenuData() {
      try {
        setIsLoading(true);
        const cats = await getCategories();
        if (!isMounted) return;
        setCategories(cats);

        const entries = await Promise.all(
          cats.map(async (c) => {
            try {
              const items = await getMenuItems({ categoryId: c.id });
              return [c.id, items || []];
            } catch (err) {
              console.error(`Error fetching items for category ${c.id}:`, err);
              return [c.id, []];
            }
          })
        );

        if (isMounted) {
          setItemsByCategory(Object.fromEntries(entries));
          setCounts(
            Object.fromEntries(entries.map(([id, items]) => [id, items.length]))
          );
        }
      } catch (error) {
        console.error("Error fetching menu details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  function getCartEntries(item) {
    return cartItems.filter((i) => i.id === item.id);
  }

  function getCartQty(item) {
    return getCartEntries(item).reduce((sum, i) => sum + i.quantity, 0);
  }

  function getPrimaryCartEntry(item) {
    const entries = getCartEntries(item);
    return entries.length ? entries[0] : null;
  }

  function handleQuantityChange(item, newQty) {
    const defaultVariant = item.variants?.[0];
    const cartEntry = getPrimaryCartEntry(item);

    if (newQty <= 0) {
      if (cartEntry) {
        updateQuantity(cartEntry.id, cartEntry.variantId ?? null, 0);
      }
      return;
    }

    if (!cartEntry) {
      addItem({
        id: item.id,
        name: item.name,
        price: defaultVariant?.price ?? 0,
        variantId: defaultVariant?.id ?? null,
        variantName: defaultVariant?.name ?? null,
        image: item.images?.[0] || logo,
        categoryName: item.categoryName,
        quantity: newQty,
      });
      onToast?.(`${item.name} added to cart`);
    } else {
      updateQuantity(cartEntry.id, cartEntry.variantId ?? null, newQty);
    }
  }

  // Filter logic across categories and items
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        let items = itemsByCategory[cat.id] || [];

        if (selectedCategory && cat.id !== selectedCategory) {
          items = [];
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              (item.code && item.code.toLowerCase().includes(q))
          );
        }

        if (selectedBrand) {
          items = items.filter(
            (item) =>
              item.brand?.toLowerCase() === selectedBrand.toLowerCase() ||
              item.categoryName?.toLowerCase() === selectedBrand.toLowerCase()
          );
        }

        return { ...cat, filteredItems: items };
      })
      .filter((cat) => cat.filteredItems.length > 0);
  }, [categories, itemsByCategory, selectedCategory, selectedBrand, searchQuery]);

  const computedTotal = cartItems.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);
  const safeSubtotal = Number(subtotal || computedTotal);
  const totalCartQty = cartItems.reduce((sum, i) => sum + Number(i.quantity), 0);

  return (
    <div className="w-full min-h-screen bg-[#fffaf3] pb-24">
      
      {/* Sticky Filter Bar - Directly below navbar with seamless attachment */}
      <div className="sticky top-[75px] md:top-[85px] z-30 bg-white border-b border-stone-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-[42px] px-3.5 rounded-[10px] border border-stone-200 bg-stone-50 text-xs md:text-sm font-semibold text-stone-800 outline-none focus:border-[#730ca8]"
            >
              <option value="">All Brands</option>
              {Array.from(new Set(Object.values(itemsByCategory).flat().map(i => i.brand).filter(Boolean))).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[42px] px-3.5 rounded-[10px] border border-stone-200 bg-stone-50 text-xs md:text-sm font-semibold text-stone-800 outline-none focus:border-[#730ca8]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{getCategoryDisplayName(cat.name)}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-[42px] pl-9 pr-3 rounded-[10px] border border-stone-200 bg-stone-50 text-xs md:text-sm font-semibold text-stone-800 outline-none focus:border-[#730ca8]"
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            {/* View Mode Toggle Button */}
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  viewMode === "list" ? "bg-[#730ca8] text-white" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  viewMode === "grid" ? "bg-[#730ca8] text-white" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Cart Total & Direct Checkout Navigation */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] rounded-xl px-4 py-2 text-white shadow-md">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-purple-200 font-bold">Cart Total</div>
                <div className="text-sm md:text-base font-black">₹{safeSubtotal.toLocaleString()}</div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg px-3.5 py-2 transition-colors cursor-pointer"
              >
                <ShoppingBag size={14} /> Checkout
                {totalCartQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff5e14] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalCartQty}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-100 p-4 space-y-2 shadow-sm animate-pulse"
              >
                <div className="h-5 bg-stone-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          /* Large Card Grid Layout (Categories) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories
              .filter((cat) => {
                if (selectedCategory && cat.id !== selectedCategory)
                  return false;
                return true;
              })
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat)}
                  className="group relative bg-white rounded-xl border border-stone-200/60 hover:border-gold-300/80 shadow-sm hover:shadow-xl transition-all duration-500 text-left overflow-hidden flex flex-col justify-between focus:outline-none"
                >
                  <div className="h-36 md:h-48 w-full overflow-hidden relative bg-stone-100">
                    <img
                      src={cat.image || logo}
                      alt={cat.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="p-4 flex items-center justify-between gap-2 bg-white grow w-full">
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-sm md:text-base text-stone-800 tracking-tight group-hover:text-[#730ca8] transition-colors duration-300">
                        {getCategoryDisplayName(cat.name)}
                      </h3>
                      <p className="text-[11px] md:text-xs font-medium text-stone-400 tracking-wide">
                        {counts[cat.id] !== undefined
                          ? `${counts[cat.id]} items`
                          : "0 items"}
                      </p>
                    </div>

                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-stone-50 group-hover:bg-[#730ca8] flex items-center justify-center transition-all duration-300 shrink-0 border border-stone-100 group-hover:border-purple-400">
                      <ArrowRight
                        size={14}
                        className="text-stone-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300"
                      />
                    </div>
                  </div>
                </button>
              ))}
          </div>
        ) : (
          /* List View Mode (Matching NPK Quick Purchase Style) */
          <div className="space-y-6">
            {/* Desktop Table Header */}
            <div className="hidden md:flex items-center gap-4 bg-white border border-stone-200 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-wider text-stone-500 shadow-sm">
              <div className="w-12"></div>
              <div className="flex-1">Product Name</div>
              <div className="w-28">Content</div>
              <div className="w-28 text-right">Unit Price</div>
              <div className="w-36 text-center">Quantity</div>
              <div className="w-28 text-right">Total</div>
            </div>

            {filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                {/* Purple Category Header Bar */}
                <div className="bg-[#730ca8] text-white rounded-xl px-5 py-3 shadow-md flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                  <h2 className="font-display font-black text-xs md:text-sm uppercase tracking-wider">
                    {getCategoryDisplayName(cat.name)}
                  </h2>
                </div>

                {/* Products List Rows */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
                  {cat.filteredItems.map((item) => {
                    const defaultVariant = item.variants?.[0];
                    const price = Number(defaultVariant?.price ?? 0);
                    const actualRate = Number(defaultVariant?.actual_rate ?? 0);
                    const discountPercent = Number(defaultVariant?.discount_percent ?? 0);
                    // Real MRP from the backend when present; otherwise just
                    // show the selling price with no fake strike-through.
                    const hasDiscount = actualRate > price;
                    const qty = getCartQty(item);
                    const itemTotal = price * qty;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 md:px-5 md:py-3.5 hover:bg-stone-50/80 transition-colors"
                      >
                        {/* Left: Image & Name */}
                        <div className="flex items-center gap-3.5 w-full md:flex-1 min-w-0">
                          <img
                            src={item.images?.[0] || cat.image || logo}
                            alt={item.name}
                            onClick={() => onSelectItem?.(item)}
                            className="w-12 h-12 md:w-11 md:h-11 shrink-0 rounded-xl object-cover border border-stone-200 cursor-pointer bg-stone-100 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              onClick={() => onSelectItem?.(item)}
                              className="text-xs md:text-sm font-bold text-stone-900 truncate cursor-pointer hover:text-[#730ca8] transition-colors"
                            >
                              {item.name}
                            </h4>
                            {/* Mobile-only tags */}
                            <div className="flex md:hidden items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                {defaultVariant?.name || "1 Pack"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Content / Variant */}
                        <div className="hidden md:block w-28">
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-md">
                            {defaultVariant?.name || "1 Pack"}
                          </span>
                        </div>

                        {/* Price & Qty Row */}
                        <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                          {/* Price Block */}
                          <div className="w-28 text-left md:text-right">
                            <div className="text-xs md:text-sm font-black text-[#ff5e14]">
                              ₹{price.toLocaleString()}
                            </div>
                            {hasDiscount && (
                              <div className="flex items-center gap-1 md:justify-end">
                                <span className="text-[10px] text-stone-400 line-through">
                                  ₹{actualRate.toLocaleString()}
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-[9px] font-bold text-emerald-600">
                                    {discountPercent}% off
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quantity Stepper */}
                          <div className="w-36 flex justify-center">
                            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden h-9 shadow-inner">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, qty - 1)
                                }
                                className="w-9 h-full flex items-center justify-center text-stone-600 hover:bg-[#730ca8] hover:text-white transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <input
                                type="text"
                                value={qty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  handleQuantityChange(item, val);
                                }}
                                className="w-10 h-full text-center text-xs font-bold text-stone-800 bg-transparent outline-none"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, qty + 1)
                                }
                                className="w-9 h-full flex items-center justify-center text-stone-600 hover:bg-[#730ca8] hover:text-white transition-colors"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="w-28 text-right text-xs md:text-sm font-black text-[#730ca8]">
                            ₹{itemTotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}