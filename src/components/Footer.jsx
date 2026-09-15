import {
  Instagram,
  Facebook,
  Youtube,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import logo from "../assets/logo.png";
import { restaurantInfo } from "../lib/data";

const IMPORTANT_LINKS = [
  { label: "Offers", key: "offer" },
  { label: "Safety Tips", key: "safety-tips" },
  { label: "Price List", key: "price-list" },
  { label: "Track Order", key: "track-order" },
  { label: "Our Reviews", key: "reviews" },
  { label: "About Us", key: "about" },
];

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-primary-950 text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-14 sm:px-6 md:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo / cert column */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <img
              src={logo}
              alt={restaurantInfo.name}
              className="mb-3 h-14 w-auto object-contain"
            />
            <h4 className="font-display text-lg font-black">
              {restaurantInfo.name}
            </h4>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold-300">
              <ShieldCheck size={14} />
              Licensed &amp; Verified Fireworks Dealer
            </p>
          </div>

          {/* Contact / social */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gold-300">
              Let Us Help You
            </h4>
            <p className="text-sm leading-relaxed text-white/70">
              For any questions, call or WhatsApp us at
              <br />
              <a
                href={`tel:${restaurantInfo.phone}`}
                className="font-bold text-white hover:text-orange-400"
              >
                {restaurantInfo.phone}
              </a>
              {restaurantInfo.altPhone && (
                <>
                  {", "}
                  <a
                    href={`tel:${restaurantInfo.altPhone}`}
                    className="font-bold text-white hover:text-orange-400"
                  >
                    {restaurantInfo.altPhone}
                  </a>
                </>
              )}
              {restaurantInfo.email && (
                <>
                  <br />
                  <a
                    href={`mailto:${restaurantInfo.email}`}
                    className="font-bold text-white hover:text-orange-400"
                  >
                    {restaurantInfo.email}
                  </a>
                </>
              )}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-orange-500"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-orange-500"
              >
                <Facebook size={16} />
              </a>
              <a
                href={restaurantInfo.youtubeUrl || "#"}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-orange-500"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Store info */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gold-300">
              Visit Our Store
            </h4>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-white/70">
              <MapPin size={16} className="mt-0.5 shrink-0 text-orange-400" />
              {restaurantInfo.address}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Clock size={16} className="shrink-0 text-orange-400" />
              {restaurantInfo.hours || "9:00 AM – 9:00 PM, all days"}
            </p>
          </div>

          {/* Important links */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gold-300">
              Important Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.key)}
                    className="transition-colors hover:text-orange-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          Copyright © {year} {restaurantInfo.name}. All rights reserved.
          <br></br>
          <br></br>
          Disclaimer: AI-generated visuals are for advertising purposes only.
          Actual product may vary.
        </div>
      </div>
    </footer>
  );
}
