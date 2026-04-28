import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";

export function Benefits() {
  return (
    <section className="relative py-20 bg-[oklch(0.1_0.03_20)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-gold">{copyConfig.benefits.title}</span>
          </h2>
          <p className="text-muted-foreground">{copyConfig.benefits.sub}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {copyConfig.benefits.items.map((b, i) => (
            <div
              key={b.title}
              className="group relative bg-card-luxe border-gold rounded-2xl p-6 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[oklch(0.55_0.22_25/0.1)] to-transparent" />
              <div className="relative">
                <div className="text-5xl mb-4">{b.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gold">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <CTAButton size="xl">🛒 এই বেনিফিট আজই নিন</CTAButton>
        </div>
      </div>
    </section>
  );
}