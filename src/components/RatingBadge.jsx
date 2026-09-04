import { Star } from "lucide-react";
import { restaurantInfo } from "../lib/data";

// Small "Google rating" style trust badge — shows the shop's star rating and
// (if set) links out to the Google review page. Edit rating/reviewCount/
// googleReviewUrl in src/lib/data.js.
export default function RatingBadge({ className = "" }) {
  const { rating, reviewCount, googleReviewUrl } = restaurantInfo;
  if (!rating) return null;

  const Wrapper = googleReviewUrl ? "a" : "div";
  const wrapperProps = googleReviewUrl
    ? { href: googleReviewUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`inline-flex items-center gap-2 rounded-2xl border border-gold-200/70 bg-white px-3.5 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        googleReviewUrl ? "hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.7 35.5 27 36.5 24 36.5c-5.2 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.6 16.1 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.6 5.4C41.8 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-3.5z"/>
      </svg>

      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-gray-900">{rating}</span>
        <Star size={13} className="fill-amber-400 text-amber-400" />
      </div>

      {reviewCount > 0 && (
        <span className="text-xs font-semibold text-gray-500">
          ({reviewCount} reviews)
        </span>
      )}
    </Wrapper>
  );
}
