import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";

export function LifestyleSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute inset-0 opacity-30">
        <img src="/images/lifestyle-1.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_20)] via-transparent to-[oklch(0.08_0.03_20)]" />
      </div>
      <div className="relative container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="grid grid-cols-2 gap-3">
            <img src="/images/lifestyle-1.jpg" alt="" loading="lazy" className="rounded-2xl shadow-elegant aspect-square object-cover hover:scale-105 transition-transform" />
            <img src="/images/lifestyle-4.jpg" alt="" loading="lazy" className="rounded-2xl shadow-elegant aspect-square object-cover translate-y-8 hover:scale-105 transition-transform" />
            <img src="/images/lifestyle-2.jpg" alt="" loading="lazy" className="rounded-2xl shadow-elegant aspect-square object-cover hover:scale-105 transition-transform" />
            <img src="/images/lifestyle-3.jpg" alt="" loading="lazy" className="rounded-2xl shadow-elegant aspect-square object-cover translate-y-8 hover:scale-105 transition-transform" />
          </div>
          <div className="space-y-5">
            <div className="text-xs text-gold tracking-widest uppercase">EMOTIONAL STORY</div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {copyConfig.lifestyle.headline.map((l, i) => (
                <span key={i} className="block">
                  {i === 2 ? <span className="text-gold">{l}</span> : l}
                </span>
              ))}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {copyConfig.lifestyle.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <CTAButton size="lg">{copyConfig.lifestyle.cta}</CTAButton>
              <CTAButton size="lg" variant="ghost" glow={false}>
                💬 জানতে চাই
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}