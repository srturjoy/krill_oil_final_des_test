import { useState } from "react";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { trackProductDetailExpand } from "@/lib/tracking/events";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-20 bg-hero">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-gold">{copyConfig.faq.title}</span>
          </h2>
        </div>
        <div className="space-y-3">
          {copyConfig.faq.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="bg-card-luxe border-gold rounded-2xl overflow-hidden shadow-elegant">
                <button
                  onClick={() => {
                    const next = isOpen ? null : i;
                    setOpen(next);
                    if (next !== null) {
                      trackProductDetailExpand({ source: "faq", index: i, question: it.q });
                    }
                  }}
                  className="w-full text-left p-5 flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-base md:text-lg">{it.q}</span>
                  <span className={`text-gold text-2xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div
                  className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <CTAButton size="lg">এখনই অর্ডার করুন</CTAButton>
        </div>
      </div>
    </section>
  );
}