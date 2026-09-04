import { useState, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Toast from "./components/Toast";
import PageLoader from "./components/PageLoader";
import SplashScreen from "./components/SplashScreen";
import MoreSheet from "./components/MoreSheet";
import FireworksCanvas from "./components/FireworksCanvas";
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
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SafetyTipsPage = lazy(() => import("./pages/SafetyTipsPage"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));
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
  about: "/about",
  "safety-tips": "/safety-tips",
  "price-list": "/price-list",
};

function activeKeyFromPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/menu") || pathname.startsWith("/category") || pathname.startsWith("/item")) return "menu";
  if (pathname.startsWith("/cart")) return "cart";
  if (pathname.startsWith("/reviews")) return "reviews";
  if (pathname.startsWith("/enquiry")) return "enquiry";
  if (pathname.startsWith("/offers")) return "offers";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/safety-tips")) return "safety-tips";
  if (pathname.startsWith("/price-list")) return "price-list";
  return "home";
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
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Same signature Header/BottomNav already call: onNavigate("menu") etc.
  function goTo(key) {
    navigate(KEY_TO_PATH[key] || "/");
    window.scrollTo(0, 0);
  }

  const activePage = activeKeyFromPath(location.pathname);
  const isItemPage = location.pathname.startsWith("/item");

  return (
    <div className="min-h-screen bg-cream">
      {/* Ambient fireworks — subtle, fixed over the whole site */}
      <div className="pointer-events-none fixed inset-0 z-[60]">
        <FireworksCanvas density={2600} opacity={0.5} maxRockets={1} />
      </div>

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
          element={<CartPage onToast={showToast} onOrderSent={() => navigate("/")} />}
        />
        <Route path="/reviews" element={<ReviewsPage onToast={showToast} />} />
        <Route path="/enquiry" element={<EnquiryPage onToast={showToast} />} />
        <Route path="/offers" element={<OffersPage onToast={showToast} />} />
        <Route path="/about" element={<AboutPage onBack={() => navigate(-1)} />} />
        <Route path="/safety-tips" element={<SafetyTipsPage onBack={() => navigate(-1)} />} />
        <Route path="/price-list" element={<PriceListPage onBack={() => navigate(-1)} />} />
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

  return (
    <BrowserRouter>
      <CartProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  );
}
