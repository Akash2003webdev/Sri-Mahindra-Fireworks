import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search crackers..." }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl shadow-soft px-4 py-3 border border-transparent focus-within:border-gold-300 transition-colors">
      <Search size={18} className="text-primary-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm placeholder:text-gray-400 bg-transparent"
      />
    </div>
  );
}
