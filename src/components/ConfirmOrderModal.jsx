import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ConfirmOrderModal({ open, title, children, onConfirm, onCancel }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fadeIn" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl p-5 shadow-card animate-fadeUp max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg text-primary-700">{title}</h3>
          <button onClick={onCancel} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="mb-5">{children}</div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 font-semibold text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-primary-500 font-semibold text-sm text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
