import { useEffect, useState } from "react";
import { pricingConfig } from "@/config/pricingConfig";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { ContactActions } from "@/components/ui/ContactActions";

function useCountdown(seconds: number) {
  const [remain, setRemain] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemain((r) => (r > 0 ? r - 1 : seconds)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const h = String(Math.floor(remain / 3600)).padStart(2, "0");
  const m = String(Math.floor((remain % 3600) / 60)).padStart(2, "0");
  const s = String(remain % 60).padStart(2, "0");
  return { h, m, s };
}

export function OfferSection() {
  const { h, m, s } = useCountdown(3 * 3600 + 27 * 60);
  return (
    <section id="offer" className="relative py-20 bg-[oklch(0.1_0.03_20)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[oklch(0.55_0.22_25/0.2)] border border-[oklch(0.55_0.22_25/0.4)] text-xs text-[oklch(0.85_0.15_25)] mb-4 animate-pulse">
            ⚡ সীমিত সময়ের জন্য
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-gold">{copyConfig.offer.title}</span>
          </h2>
          <p className="text-muted-foreground mb-6">{copyConfig.offer.sub}</p>

          {/* Countdown */}
          <div className="inline-flex gap-2 md:gap-3">
            {[
              { v: h, l: "ঘণ্টা" },
              { v: m, l: "মিনিট" },
              { v: s, l: "সেকেন্ড" },
            ].map((u) => (
              <div key={u.l} className="bg-card-luxe border-gold rounded-xl px-4 py-3 min-w-[70px] shadow-elegant">
                <div className="text-2xl md:text-3xl font-bold text-gold tabular-nums">{u.v}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{u.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {pricingConfig.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 ${
                p.popular
                  ? "bg-gradient-to-b from-[oklch(0.25_0.1_25)] to-[oklch(0.16_0.05_22)] border-2 border-[oklch(0.78_0.15_80)] shadow-glow scale-[1.03]"
                  : "bg-card-luxe border-gold shadow-elegant"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-[oklch(0.15_0.04_25)] text-xs font-bold whitespace-nowrap">
                  ⭐ {p.badge}
                </div>
              )}
              <div className="text-center pt-2">
                <div className="text-xs text-gold uppercase tracking-widest mb-2">{p.bottles} BOTTLE{p.bottles>1?'S':''}</div>
                <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                <div className="text-xs text-muted-foreground mb-4">{p.subtitle}</div>

                <div className="flex items-center justify-center gap-2 mb-1">
                  {p.oldPrice && (
                    <span className="text-base text-muted-foreground line-through">৳{p.oldPrice}</span>
                  )}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  ৳{p.price}
                </div>
                <div className="text-xs text-muted-foreground mb-5">{p.capsules} ক্যাপসুল</div>

                <ul className="space-y-2 text-left mb-6">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5">✔</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <CTAButton
                  packageId={p.id}
                  variant={p.popular ? "gold" : "primary"}
                  className="w-full"
                  glow={!p.popular}
                >
                  {copyConfig.offer.cta}
                </CTAButton>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-10 text-sm">
          {copyConfig.offer.perks.map((p) => (
            <div key={p} className="glass rounded-full px-4 py-2">{p}</div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            অর্ডার বা প্রশ্ন? সরাসরি যোগাযোগ করুন —
          </p>
          <ContactActions />
        </div>
      </div>
    </section>
  );
}