import { ShieldCheck, BadgeIndianRupee, Truck, Heart } from "lucide-react";
import { whyChooseUs } from "../lib/data";

const ICONS = {
  ShieldCheck,
  BadgeIndianRupee,
  Truck,
  Heart,
};

export default function WhyChooseUs() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {whyChooseUs.map((item) => {
          const Icon = ICONS[item.icon] || ShieldCheck;
          return (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-3xl border border-gray-100/80 bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-gray-900 md:text-lg">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 md:text-sm">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
