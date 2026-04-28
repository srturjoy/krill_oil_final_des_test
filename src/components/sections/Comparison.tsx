import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";

export function Comparison() {
  return (
    <section className="relative py-20 bg-[oklch(0.1_0.03_20)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            {copyConfig.comparison.headline.split(",")[0]},<br />
            <span className="text-gold">{copyConfig.comparison.headline.split(",")[1]}</span>
          </h2>
          <p className="text-muted-foreground">{copyConfig.comparison.sub}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-card-luxe border-gold rounded-3xl overflow-hidden shadow-elegant">
          <div className="grid grid-cols-3 bg-[oklch(0.18_0.05_22)] border-b border-gold">
            <div className="p-4 font-bold text-sm md:text-base">বৈশিষ্ট্য</div>
            <div className="p-4 text-center font-bold text-sm md:text-base text-muted-foreground border-x border-gold">
              সাধারণ ফিশ অয়েল
            </div>
            <div className="p-4 text-center font-bold text-sm md:text-base text-gold">
              👑 প্রিমিয়াম ক্রিল অয়েল
            </div>
          </div>
          {copyConfig.comparison.rows.map((r, i) => (
            <div
              key={r.feature}
              className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-[oklch(0.14_0.04_22)]" : ""}`}
            >
              <div className="p-4 text-sm md:text-base font-medium">{r.feature}</div>
              <div className="p-4 text-sm md:text-base text-center text-muted-foreground border-x border-gold">
                ✗ {r.normal}
              </div>
              <div className="p-4 text-sm md:text-base text-center text-gold font-semibold">
                ✔ {r.premium}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <CTAButton size="xl">প্রিমিয়ামটাই বেছে নিন</CTAButton>
        </div>
      </div>
    </section>
  );
}