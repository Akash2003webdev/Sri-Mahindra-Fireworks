import { useState, lazy, Suspense, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useNavigationType,
  useParams,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Toast from "./components/Toast";
import PageLoader from "./components/PageLoader";
import SplashScreen from "./components/SplashScreen";
import LegalNoticeModal, {
  hasSeenLegalNotice,
} from "./components/LegalNoticeModal";
import MoreSheet from "./components/MoreSheet";
import { getCategoryById, getMenuItemById } from "./lib/api";
import { useEffect } from "react";

// Lazy-loaded routes: each page (and its dependencies, e.g. PriceListPage's
// jsPDF bundle) is fetched only when the user actually navigates there,
// instead of bloating the very first page load.
const HomePage = lazy(() => import("./pages/HomePage"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ItemDetailPage = lazy(() => import("./pages/ItemDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const EnquiryPage = lazy(() => import("./pages/EnquiryPage"));
const OffersPage = lazy(() => import("./pages/OffersPage"));
const OfferPage = lazy(() => import("./pages/OfferPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SafetyTipsPage = lazy(() => import("./pages/SafetyTipsPage"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

// Maps bottom-nav / header nav keys to real URLs, and back again — kept so
// Header.jsx / BottomNav.jsx don't need to change their onNavigate(key) API.
const KEY_TO_PATH = {
  home: "/",
  menu: "/menu",
  cart: "/cart",
  reviews: "/reviews",
  enquiry: "/enquiry",
  offers: "/offers",
  offer: "/offer",
  about: "/about",
  "safety-tips": "/safety-tips",
  "price-list": "/price-list",
  "track-order": "/track-order",
};

function activeKeyFromPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/menu") || pathname.startsWith("/category") || pathname.startsWith("/item")) return "menu";
  if (pathname.startsWith("/cart")) return "cart";
  if (pathname.startsWith("/reviews")) return "reviews";
  if (pathname.startsWith("/enquiry")) return "enquiry";
  if (pathname.startsWith("/offers")) return "offers";
  if (pathname.startsWith("/offer")) return "offer";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/safety-tips")) return "safety-tips";
  if (pathname.startsWith("/price-list")) return "price-list";
  if (pathname.startsWith("/track-order")) return "track-order";
  return "home";
}

// Remembers scroll position per history entry (location.key) so going back
// (e.g. from an item detail page to the menu) restores exactly where the
// user was, instead of always jumping to the top. Forward navigation
// (clicking into a new page) still starts at the top as usual.
//
// The position for the CURRENT page is tracked continuously via a scroll
// listener while the user is on it — not read once when leaving, because
// by the time a route change effect runs, the new (often shorter) page has
// already replaced the old one in the DOM and window.scrollY no longer
// reflects the page being left. This is what made earlier attempts save
// the wrong number.
//
// The destination page (e.g. Menu) also fetches its categories/items/images
// async, so right after mount the page is short (loading skeleton) and a
// one-shot scrollTo gets silently clamped back to 0 — there's nowhere to
// scroll to yet. We watch the page's height with a ResizeObserver and keep
// re-applying the saved scroll position every time it grows, until it
// actually sticks (or a generous timeout passes).
function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const positions = useRef(new Map());

  // Continuously record the current page's scroll position as the user
  // scrolls, so whatever value we have saved when they navigate away is
  // always accurate. We deliberately do NOT write an initial value here —
  // that would immediately clobber a saved position with this page's
  // just-landed (often 0) scrollY before the restore effect below gets to
  // read it.
  useEffect(() => {
    const key = location.key;
    const onScroll = () => positions.current.set(key, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.key]);

  // Apply (or restore) the scroll position for the page we just landed on.
  useEffect(() => {
    const savedY = positions.current.get(location.key);
    const targetY = navigationType === "POP" && savedY != null ? savedY : 0;

    window.scrollTo(0, targetY);
    if (targetY === 0) return;

    let settled = false;
    const reapply = () => {
      if (settled) return;
      window.scrollTo(0, targetY);
      if (Math.abs(window.scrollY - targetY) < 2) settled = true;
    };

    // Reacts the moment new content (categories, images, etc.) changes the
    // page height — the main way this actually needs to fire.
    const observer = new ResizeObserver(reapply);
    observer.observe(document.body);

    // Fallback poll in case something resizes without triggering the
    // observer (e.g. late image decode on some browsers).
    const poll = setInterval(reapply, 100);
    const stopTimer = setTimeout(() => {
      settled = true;
      observer.disconnect();
      clearInterval(poll);
    }, 6000);

    return () => {
      observer.disconnect();
      clearInterval(poll);
      clearTimeout(stopTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
}


// Fetches the category by :id from the URL so a direct link / crawler hit
// works even without the in-app click state.
function CategoryRoute({ onToast }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(location.state?.category || null);

  useEffect(() => {
    if (!category || category.id !== id) {
      getCategoryById(id).then(setCategory).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <CategoryPage
      category={category}
      onBack={() => navigate("/menu")}
      onSelectItem={(item) => navigate(`/item/${item.id}`, { state: { item } })}
      onToast={onToast}
    />
  );
}

// Fetches the menu item by :id from the URL, same reasoning as above.
function ItemRoute({ onToast }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state?.item || null);

  useEffect(() => {
    if (!item || item.id !== id) {
      getMenuItemById(id).then(setItem).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ItemDetailPage
      item={item}
      onBack={() => navigate(-1)}
      onToast={onToast}
      onGoToCart={() => navigate("/cart")}
    />
  );
}

// Reads the order id/phone handed off right after checkout (via router
// state) so Track Order can auto-load that order; works fine with neither
// present too (plain /track-order visit shows the manual lookup form).
function TrackOrderRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <TrackOrderPage
      onBack={() => navigate(-1)}
      prefillPhone={location.state?.phone}
    />
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  useScrollRestoration();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Same signature Header/BottomNav already call: onNavigate("menu") etc.
  function goTo(key) {
    navigate(KEY_TO_PATH[key] || "/");
  }

  const activePage = activeKeyFromPath(location.pathname);
  const isItemPage = location.pathname.startsWith("/item");

  return (
    <div className="min-h-screen bg-cream">
      <Header onAdminTrigger={() => setShowAdmin(true)} activePage={activePage} onNavigate={goTo} />

      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onNavigate={goTo}
              onSelectCategory={(cat) => navigate(`/category/${cat.id}`, { state: { category: cat } })}
              onSelectItem={(item) => navigate(`/item/${item.id}`, { state: { item } })}
              onToast={showToast}
            />
          }
        />
        <Route
          path="/menu"
          element={
            <MenuPage
              onSelectCategory={(cat) => navigate(`/category/${cat.id}`, { state: { category: cat } })}
              onSelectItem={(item) => navigate(`/item/${item.id}`, { state: { item } })}
              onToast={showToast}
            />
          }
        />
        <Route path="/category/:id" element={<CategoryRoute onToast={showToast} />} />
        <Route path="/item/:id" element={<ItemRoute onToast={showToast} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              onToast={showToast}
              onOrderSent={(order) =>
                navigate("/track-order", {
                  state: { orderId: order?.id, phone: order?.customer_phone },
                })
              }
            />
          }
        />
        <Route path="/reviews" element={<ReviewsPage onToast={showToast} />} />
        <Route path="/enquiry" element={<EnquiryPage onToast={showToast} />} />
        <Route path="/offers" element={<OffersPage onToast={showToast} />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="/about" element={<AboutPage onBack={() => navigate(-1)} />} />
        <Route path="/safety-tips" element={<SafetyTipsPage onBack={() => navigate(-1)} />} />
        <Route path="/price-list" element={<PriceListPage onBack={() => navigate(-1)} />} />
        <Route path="/track-order" element={<TrackOrderRoute />} />
        </Routes>
      </Suspense>

      {!isItemPage && <FloatingWhatsApp onNavigate={goTo} />}

      <BottomNav activePage={activePage} onNavigate={goTo} onMoreClick={() => setShowMore(true)} />

      <MoreSheet open={showMore} onClose={() => setShowMore(false)} onNavigate={goTo} />

      {showAdmin && (
        <Suspense fallback={<PageLoader />}>
          <AdminPage onClose={() => setShowAdmin(false)} />
        </Suspense>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLegalNotice, setShowLegalNotice] = useState(false);

  function handleSplashFinish() {
    setShowSplash(false);
    // Show the mandatory firecracker-sale disclosure the moment the home
    // page (the "second page", right after the splash) opens — once per
    // browser session so returning visitors aren't nagged on every visit.
    if (!hasSeenLegalNotice()) {
      setShowLegalNotice(true);
    }
  }

  return (
    <BrowserRouter>
      <StoreSettingsProvider>
        <CartProvider>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          <AppShell />
          <LegalNoticeModal
            open={showLegalNotice}
            onClose={() => setShowLegalNotice(false)}
          />
        </CartProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  );
}
