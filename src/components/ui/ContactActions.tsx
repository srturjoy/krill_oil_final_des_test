import { Phone } from "lucide-react";
import { ownerConfig } from "@/config/ownerConfig";
import { cn } from "@/lib/utils";
import { trackContact } from "@/lib/tracking/events";

/** Official-style WhatsApp glyph (inline SVG, no external dep). */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-5 h-5", className)}
    >
      <path
        fill="currentColor"
        d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.198-.488.198-.946.114-1.06-.1-.16-.687-.23-1.404-.604zM16.515 2.5C8.985 2.5 2.875 8.61 2.875 16.14c0 2.578.732 5.07 2.106 7.232L2.5 30l6.79-2.434a13.539 13.539 0 0 0 7.225 2.072c7.53 0 13.64-6.11 13.64-13.64S24.045 2.5 16.515 2.5zm0 24.96a11.282 11.282 0 0 1-6.4-1.974l-.46-.298-4.026 1.443 1.46-3.926-.298-.475a11.288 11.288 0 0 1-1.91-6.29c0-6.273 5.36-11.32 11.634-11.32S27.85 9.667 27.85 15.94c0 6.275-5.06 11.52-11.335 11.52z"
      />
    </svg>
  );
}

type Props = {
  variant?: "solid" | "compact" | "floating";
  className?: string;
  showLabels?: boolean;
};

/** Branded WhatsApp + Call quick-action buttons. */
export function ContactActions({
  variant = "solid",
  className,
  showLabels = true,
}: Props) {
  const wa = `https://wa.me/${ownerConfig.whatsapp}?text=${encodeURIComponent(
    "আসসালামু আলাইকুম, আমি Antarctic Krill সম্পর্কে জানতে চাই।",
  )}`;
  const tel = `tel:${ownerConfig.phone}`;
  const onWa = () => trackContact("whatsapp", { variant });
  const onCall = () => trackContact("call", { variant });

  if (variant === "floating") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          onClick={onWa}
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-elegant hover:scale-110 active:scale-95 transition"
          aria-label="WhatsApp এ মেসেজ করুন"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
        <a
          href={tel}
          onClick={onCall}
          className="w-12 h-12 rounded-full bg-gold text-[oklch(0.15_0.04_25)] flex items-center justify-center shadow-gold hover:scale-110 active:scale-95 transition"
          aria-label="ফোন করুন"
        >
          <Phone className="w-5 h-5" strokeWidth={2.5} />
        </a>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          onClick={onWa}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold shadow hover:scale-[1.03] active:scale-95 transition"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4" />
          {showLabels && <span>WhatsApp</span>}
        </a>
        <a
          href={tel}
          onClick={onCall}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold text-[oklch(0.15_0.04_25)] text-xs font-semibold shadow hover:scale-[1.03] active:scale-95 transition"
          aria-label="Call"
        >
          <Phone className="w-4 h-4" strokeWidth={2.5} />
          {showLabels && <span>কল করুন</span>}
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        onClick={onWa}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold shadow-elegant hover:scale-[1.03] active:scale-95 transition"
      >
        <WhatsAppIcon className="w-5 h-5" />
        <span>WhatsApp</span>
      </a>
      <a
        href={tel}
        onClick={onCall}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-[oklch(0.15_0.04_25)] font-semibold shadow-gold hover:scale-[1.03] active:scale-95 transition"
      >
        <Phone className="w-5 h-5" strokeWidth={2.5} />
        <span>কল করুন</span>
      </a>
    </div>
  );
}