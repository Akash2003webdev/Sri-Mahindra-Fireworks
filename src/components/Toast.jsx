import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-fadeUp">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-card text-white text-sm font-medium ${
          type === "success" ? "bg-primary-500" : "bg-red-600"
        }`}
      >
        {type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {message}
      </div>
    </div>
  );
}
