import { createPortal } from "react-dom";
import { restaurantInfo } from "../lib/data";

const SESSION_KEY = "npk_legal_notice_seen_v1";

export function hasSeenLegalNotice() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLegalNoticeSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sessionStorage unavailable — the modal will simply reappear next load.
  }
}

// Full-screen legal/compliance popup shown once per browser session, right
// after the splash screen finishes. Mirrors the mandatory "online sale of
// firecrackers" disclosure most Sivakasi cracker shops show before letting
// customers add items to an enquiry/cart.
export default function LegalNoticeModal({ open, onClose }) {
  if (!open) return null;

  function handleOk() {
    markLegalNoticeSeen();
    onClose?.();
  }

  return createPortal(
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 animate-fadeIn" />

      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-card animate-fadeUp">
        {/* Decorative top strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-gold-400 to-primary-500" />

        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-sm sm:text-base leading-relaxed text-gray-100">
            As per 2018 Supreme Court order, online sale of firecrackers is
            not permitted. We value our customers and, at the same time,
            respect the jurisdiction. We request you to add your products to
            the cart and submit the required crackers through the enquiry
            button. We will contact you within 24 hrs and confirm the order
            through WhatsApp or a phone call. Please add and submit your
            enquiries and enjoy your celebrations with {restaurantInfo.name}.{" "}
            {restaurantInfo.name} is a company following 100% legal &amp;
            statutory compliances, and all our shops and go-downs are
            maintained as per the explosive acts. We send parcels only
            through registered and legal transport service providers, just
            like every other major company in Sivakasi is doing.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleOk}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#730ca8] to-[#8b3a9e] hover:from-[#620992] hover:to-[#730ca8] text-white text-sm font-bold tracking-wide shadow-lg transition-all duration-300 active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
