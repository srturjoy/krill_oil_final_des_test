import { useEffect, useState } from "react";
import { productConfig } from "@/config/productConfig";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { ContactActions } from "@/components/ui/ContactActions";
import { trackProductImageView } from "@/lib/tracking/events";

const floatingCapsules = [
  { top: "12%", left: "18%", delay: "0s" },
  { top: "28%", left: "74%", delay: "0.7s" },
  { top: "44%", left: "10%", delay: "1.4s" },
  { top: "18%", left: "56%", delay: "2.1s" },
  { top: "70%", left: "82%", delay: "2.8s" },
  { top: "76%", left: "24%", delay: "3.5s" },
  { top: "58%", left: "48%", delay: "4.2s" },
  { top: "8%", left: "88%", delay: "4.9s" },
];

export function HeroSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % productConfig.heroImages.length), 3500);
    return () => clearInterval(t);
  }, []);

  // Track manual gallery interactions (auto-rotate is not counted)
  const onPickImage = (i: number) => {
    setActive(i);
    trackProductImageView({ source: "hero", index: i, total: productConfig.heroImages.length });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-hero pt-6 pb-16">
      {/* Floating capsules */}
      <div className="pointer-events-none absolute inset-0">
        {floatingCapsules.map((capsule, i) => (
          <div
            key={i}
            className="absolute w-3 h-6 rounded-full bg-gold opacity-30 animate-float"
            style={{
              top: capsule.top,
              left: capsule.left,
              animationDelay: capsule.delay,
              filter: "blur(1px)",
            }}
          />
        ))}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[oklch(0.55_0.22_25/0.25)] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Copy */}
          <div className="text-center md:text-left order-2 md:order-1 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5 text-xs text-gold tracking-widest uppercase">
              ✦ {copyConfig.hero.eyebrow} ✦
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {copyConfig.hero.headline.map((l, i) => (
                <span key={i} className="block">
                  {i === 2 ? <span className="text-gold">{l}</span> : l}
                </span>
              ))}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">
              {copyConfig.hero.sub}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              {productConfig.badges.map((b) => (
                <div key={b.label} className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2">
                  <span className="text-lg">{b.icon}</span>
                  <div className="text-left">
                    <div className="text-gold font-bold leading-tight">{b.label}</div>
                    <div className="text-muted-foreground leading-tight">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bullets */}
            <ul className="grid grid-cols-2 gap-2 mb-7 max-w-md mx-auto md:mx-0">
              {productConfig.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span className="text-gold">✔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Urgency */}
            <div className="inline-block px-4 py-2 rounded-lg bg-[oklch(0.55_0.22_25/0.15)] border border-[oklch(0.55_0.22_25/0.4)] text-sm font-medium text-[oklch(0.85_0.15_25)] mb-6 animate-pulse">
              ⚡ {copyConfig.hero.urgency}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <CTAButton size="xl">🛒 {copyConfig.hero.cta}</CTAButton>
                <div className="text-xs text-muted-foreground">
                  <div className="text-gold font-bold text-lg">৳ ১৪৯০</div>
                  <div>প্রতি বোতল ৬০ ক্যাপসুল</div>
                </div>
              </div>
              <ContactActions className="justify-center md:justify-start" />
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 md:order-2">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-[oklch(0.55_0.22_25/0.4)] blur-3xl animate-pulse-glow" />
              {productConfig.heroImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={productConfig.name}
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ${
                    i === active ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  width={1024}
                  height={1024}
                />
              ))}
              {/* Image dots */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {productConfig.heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPickImage(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-2 bg-muted"}`}
                    aria-label={`image ${i}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}