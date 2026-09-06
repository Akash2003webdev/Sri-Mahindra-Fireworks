import { useEffect, useState } from "react";
import {
  ArrowLeft,
  PackageSearch,
  Phone,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";
import { useSEO } from "../lib/seo";
import { restaurantInfo } from "../lib/data";
import { trackOrder } from "../lib/api";
import { STATUS_STEPS, getStatusMeta } from "../lib/orderStatus";

const STORAGE_KEY = "mfc_my_orders"; // [{ id, phone }] — remembered on this device only

function loadSavedOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOrder(id, phone) {
  const existing = loadSavedOrders().filter((o) => o.id !== id);
  const next = [{ id, phone }, ...existing].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

const STEP_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  packed: PackageCheck,
  out_for_delivery: Truck,
  completed: CheckCircle2,
};

function OrderStatusCard({ order }) {
  if (!order) return null;
  const meta = getStatusMeta(order.status, order.order_type);
  const isCancelled = order.status === "cancelled";
  const currentIdx = STATUS_STEPS.indexOf(order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Order #{order.id.slice(0, 8)}
          </p>
          <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
            {order.order_type} &middot; ₹{order.total}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
            isCancelled
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-purple-50 text-[#730ca8] border-purple-200"
          }`}
        >
          {isCancelled ? <XCircle size={13} /> : <PackageSearch size={13} />}
          {meta.label}
        </span>
      </div>

      {isCancelled ? (
        <div className="rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3">
          This order was cancelled. Contact us on WhatsApp if this looks wrong.
        </div>
      ) : (
        <>
          {/* Mobile View: Vertical Timeline */}
          <div className="flex md:hidden flex-col space-y-3 my-2">
            {STATUS_STEPS.map((step, idx) => {
              const Icon = STEP_ICONS[step];
              const stepMeta = getStatusMeta(step, order.order_type);
              const done = idx <= currentIdx;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      done
                        ? "bg-[#730ca8] border-[#730ca8] text-white"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span className={`text-xs font-bold ${done ? "text-[#730ca8]" : "text-gray-400"}`}>
                    {stepMeta.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Horizontal Timeline */}
          <div className="hidden md:flex items-center justify-between my-2">
            {STATUS_STEPS.map((step, idx) => {
              const Icon = STEP_ICONS[step];
              const stepMeta = getStatusMeta(step, order.order_type);
              const done = idx <= currentIdx;
              return (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    {idx > 0 && (
                      <div className={`h-0.5 flex-1 ${idx <= currentIdx ? "bg-[#730ca8]" : "bg-gray-200"}`} />
                    )}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        done
                          ? "bg-[#730ca8] border-[#730ca8] text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 ${idx < currentIdx ? "bg-[#730ca8]" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <span className={`mt-1.5 text-[10px] font-bold ${done ? "text-[#730ca8]" : "text-gray-400"}`}>
                    {stepMeta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {items.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 divide-y divide-gray-100">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 py-2 text-xs md:text-sm">
              <span className="text-gray-700 font-medium">
                {it.name}
                {it.variantName ? <span className="text-gray-400"> — {it.variantName}</span> : null}
                <span className="text-gray-400"> × {it.quantity}</span>
              </span>
              <span className="font-bold text-gold-700 shrink-0">
                ₹{(it.price ?? 0) * (it.quantity ?? 1)}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[10px] text-gray-400">
        Last updated {new Date(order.updated_at || order.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default function TrackOrderPage({ onBack, prefillOrderId, prefillPhone }) {
  useSEO({
    title: `Track Order | ${restaurantInfo.name}`,
    description: "Check the live status of your crackers order.",
    path: "/track-order",
  });

  const [orderId, setOrderId] = useState(prefillOrderId || "");
  const [phone, setPhone] = useState(prefillPhone || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [savedResults, setSavedResults] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  async function runLookup(id, ph) {
    if (!id || !ph) return null;
    try {
      return await trackOrder({ orderId: id, phone: ph });
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = loadSavedOrders();
      const results = await Promise.all(saved.map((o) => runLookup(o.id, o.phone)));
      if (!cancelled) {
        setSavedResults(results.filter(Boolean));
        setSavedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (prefillOrderId && prefillPhone) {
      saveOrder(prefillOrderId, prefillPhone);
      handleSearch(prefillOrderId, prefillPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillOrderId, prefillPhone]);

  async function handleSearch(idArg, phoneArg) {
    const id = (idArg ?? orderId).trim();
    const ph = (phoneArg ?? phone).trim();
    if (!id || ph.length < 10) {
      setError("Enter the order ID and the phone number used to place it.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    const order = await runLookup(id, ph);
    setLoading(false);
    if (!order) {
      setError("No matching order found. Double-check the order ID and phone number.");
      return;
    }
    setResult(order);
    saveOrder(id, ph);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-16">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#730ca8] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      <span className="flex items-center gap-1.5 text-[#730ca8] text-xs font-bold tracking-[0.2em] uppercase mb-1">
        <PackageSearch size={14} /> Order Status
      </span>
      <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight mb-2">
        Track Your Order
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter your Order ID and the phone number you used at checkout.
      </p>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm mb-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <PackageSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID"
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#730ca8]/30"
            />
          </div>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              inputMode="tel"
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#730ca8]/30"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#730ca8] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#5c0a86] transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Track
          </button>
        </div>
        {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
      </div>

      {result && (
        <div className="mb-8">
          <OrderStatusCard order={result} />
        </div>
      )}

      {!result && savedResults.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Your recent orders on this device
          </p>
          {savedResults.map((o) => (
            <OrderStatusCard key={o.id} order={o} />
          ))}
        </div>
      )}

      {!result && !savedLoading && savedResults.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm">
          No orders tracked on this device yet. Place an order or enter your Order ID above.
        </div>
      )}
    </main>
  );
}