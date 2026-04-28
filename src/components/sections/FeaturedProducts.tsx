import { productConfig } from "@/config/productConfig";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { AutoScrollGallery } from "@/components/ui/AutoScrollGallery";

const galleries = [
  productConfig.bottleImages,
  productConfig.capsuleImages,
  productConfig.lifestyleImages,
];

export function FeaturedProducts() {
  const blocks = copyConfig.featured.blocks;
  return (
    <section className="relative py-20 bg-[oklch(0.1_0.03_20)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="text-xs text-gold tracking-widest uppercase mb-3">VIEW HERE</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-gold">{copyConfig.featured.title}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{copyConfig.featured.sub}</p>
        </div>

        <div className="space-y-16">
          {blocks.map((block, idx) => (
            <div
              key={block.title}
              className={`grid md:grid-cols-5 gap-8 items-center ${idx % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="md:col-span-2 space-y-4">
                <div className="text-xs text-gold tracking-widest uppercase">BLOCK {idx + 1}</div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {block.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{block.desc}</p>
                <div className="text-sm text-gold/80">✦ {productConfig.capsulesLabel}</div>
                <CTAButton>{copyConfig.featured.cta}</CTAButton>
              </div>
              <div className="md:col-span-3">
                <AutoScrollGallery images={galleries[idx]} height="h-72" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}