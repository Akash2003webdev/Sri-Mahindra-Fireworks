import { ShieldAlert } from "lucide-react";
import { legalNotice } from "../lib/data";

export default function LegalNotice() {
  return (
    <div className="flex gap-3 rounded-2xl border border-gold-200/70 bg-gold-50 p-4 md:p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
        <ShieldAlert size={18} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-primary-900 md:text-base">
          {legalNotice.heading}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-gray-600 md:text-sm">
          {legalNotice.text}
        </p>
      </div>
    </div>
  );
}
