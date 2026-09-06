import { useState } from "react";
import { MessageCircleQuestion, User, Phone, MessageSquare, ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";
import ConfirmOrderModal from "../components/ConfirmOrderModal";
import { submitEnquiry } from "../lib/api";
import { buildEnquiryMessage, sendWhatsAppMessage } from "../lib/whatsapp";
import { useSEO } from "../lib/seo";
import { restaurantInfo } from "../lib/data";

const ENQUIRY_TYPES = ["General", "Bulk Order", "Wholesale", "Feedback", "Other"];

export default function EnquiryPage({ onToast }) {
  useSEO({
    title: "Enquiry | Mahendra Fancy Crackers - Bulk & Wholesale Orders",
    description:
      "Get in touch with Mahendra Fancy Crackers, Sattur for bulk orders, wholesale rates, or general enquiries.",
    path: "/enquiry",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    enquiryType: "General",
    message: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = form.name.trim() && form.phone.trim().length >= 10 && form.message.trim();

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await submitEnquiry(form);
    } catch (err) {
      console.error("Failed to save enquiry to backend:", err);
    }
    const message = buildEnquiryMessage(form);
    sendWhatsAppMessage(message);
    setSubmitting(false);
    setShowConfirm(false);
    onToast?.("Enquiry sent successfully!");
    setForm({ name: "", phone: "", enquiryType: "General", message: "" });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-24 md:pb-16 min-h-screen bg-gray-50/50">
      
      {/* Desktop Grid Layout: Left Info Panel, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Info Panel (4 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary-700 via-primary-900 to-gray-950 p-8 text-white shadow-xl border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,224,71,0.15),transparent_50%)]" />
            <div className="relative z-10">
              <div className="mb-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <MessageCircleQuestion size={26} className="text-yellow-400 animate-pulse" />
              </div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                Have an Enquiry?
              </h1>
              <p className="text-sm text-gray-300 mt-2.5 leading-relaxed font-medium">
                Bulk orders, wholesale pricing, or custom requests — submit your details and we'll instantly connect with you on WhatsApp.
              </p>
            </div>
          </div>

          {/* Quick Support Cards */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Best Wholesale Rates</h4>
                <p className="text-xs text-gray-500">Direct factory pricing for bulk buyers.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 border-t border-gray-50">
              <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Quick Response</h4>
                <p className="text-xs text-gray-500">We reply via WhatsApp within minutes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-3 border-t border-gray-50">
              <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Location</h4>
                <p className="text-xs text-gray-500">{restaurantInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Modern Form Wrapper (7 cols on lg) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-6 md:p-8 space-y-6 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          >
            <div className="space-y-4">
              <div className="relative group">
                <User size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-gray-400"
                />
              </div>

              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Modern Selectable Pill Badges */}
            <div>
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase mb-2.5 block px-1">
                Enquiry Type
              </label>
              <div className="flex gap-2 flex-wrap">
                {ENQUIRY_TYPES.map((type) => {
                  const active = form.enquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, enquiryType: type }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-primary-600 to-primary-500 border-primary-600 text-white shadow-md shadow-primary-500/20 scale-105"
                          : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Area */}
            <div className="relative group">
              <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <textarea
                placeholder="Tell us what you need in detail..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Modern CTA Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="group w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-primary-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? "Processing..." : "Send Enquiry"}
              {!submitting && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </div>

      {/* Premium Styled Confirmation Modal Content */}
      <ConfirmOrderModal
        open={showConfirm}
        title="Verify Enquiry Details"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      >
        <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Type</span>
            <span className="font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-lg text-xs">{form.enquiryType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Name</span>
            <span className="font-semibold text-gray-800">{form.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Phone</span>
            <span className="font-semibold text-gray-800">{form.phone}</span>
          </div>
          <div className="pt-2 border-t border-gray-200/60">
            <span className="text-gray-500 font-medium block mb-1">Message</span>
            <p className="text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200/50 text-xs leading-relaxed max-h-24 overflow-y-auto">
              {form.message}
            </p>
          </div>
        </div>
      </ConfirmOrderModal>
    </div>
  );
}