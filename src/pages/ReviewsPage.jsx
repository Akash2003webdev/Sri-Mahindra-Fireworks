import { useEffect, useState } from "react";
import { User, MessageSquare, Star, Sparkles, PenLine } from "lucide-react";
import Stars from "../components/Stars";
import { getOverallReviews, submitReview } from "../lib/api";
import { useSEO } from "../lib/seo";

export default function ReviewsPage({ onToast }) {
  useSEO({
    title: "Customer Reviews | Mahendra Fancy Crackers",
    description:
      "Read customer reviews for Mahendra Fancy Crackers, Sattur. Share your own experience with our crackers and service.",
    path: "/reviews",
  });

  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    getOverallReviews().then(setReviews);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    const review = await submitReview(form);
    setReviews((prev) => [review, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitting(false);
    onToast?.("Thanks for your review!");
  }

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-24 md:pb-16 min-h-screen bg-gray-50/40">
      
      {/* Premium Header & Summary Dashboard */}
      <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.02)] p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
            <Sparkles size={14} className="animate-spin-slow" /> In Their Words
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
            Customer Stories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hear from customers who shopped with us.
          </p>
        </div>

        {/* Glassmorphic Aggregate Rating Card */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-gold-50 via-primary-50/50 to-white border border-gold-100 p-4 md:p-6 rounded-2xl min-w-[240px]">
          <div className="font-display font-black text-4xl md:text-5xl text-gold-600 tracking-tight">
            {avg}
          </div>
          <div className="h-10 w-[1px] bg-gold-200/60" />
          <div>
            <Stars rating={Number(avg)} size={16} />
            <span className="text-xs font-semibold text-gray-600 mt-1 block tracking-wide">
              Based on {reviews.length} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Review Feed List */}
        <div className="space-y-4 order-2 lg:order-1">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            reviews.map((r) => (
              <div 
                key={r.id} 
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-5 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:scale-[1.005]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold text-xs uppercase border border-gold-100">
                      {r.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{r.name}</span>
                  </div>
                  <Stars rating={r.rating} size={12} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-10">{r.comment}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-3 pl-10 font-medium">
                  <span>•</span>
                  <span>{r.date || "Just now"}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Premium Write a Review Sticky Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 space-y-5 order-1 lg:order-2 lg:sticky lg:top-28 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <PenLine size={18} className="text-primary-500" />
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Write a Review</h4>
          </div>

          {/* Name Input */}
          <div className="relative group">
            <User size={16} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10"
              required
            />
          </div>

          {/* Premium Interactive Star Picker */}
          <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-3.5 flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">Your Rating</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoveredStar ? star <= hoveredStar : star <= form.rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform duration-150 hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`transition-colors duration-200 ${
                        isFilled 
                          ? "text-amber-400 fill-amber-400" 
                          : "text-gray-300 fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Input */}
          <div className="relative group">
            <MessageSquare size={16} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
            <textarea
              placeholder="Share your shopping experience with us..."
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              rows={4}
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.comment.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold tracking-wide shadow-md shadow-primary-500/10 disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 hover:scale-[1.01]"
          >
            {submitting ? "Publishing..." : "Publish Review"}
          </button>
        </form>

      </div>
    </div>
  );
}