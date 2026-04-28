import { useEffect, useRef } from "react";
import { productConfig } from "@/config/productConfig";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { AutoScrollGallery } from "@/components/ui/AutoScrollGallery";
import {
  trackProductDetailExpand,
  trackProductImageView,
} from "@/lib/tracking/events";

const galleries = [
  productConfig.showcaseImages1,
  productConfig.showcaseImages2,
  productConfig.showcaseImages3,
];

export function ProductDetailShowcase() {
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const fired = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (Number.isNaN(idx) || fired.has(idx)) continue;
          fired.add(idx);
          const block = copyConfig.showcase.blocks[idx];
          trackProductDetailExpand({
            source: "showcase",
            index: idx,
            title: block?.title,
          });
          trackProductImageView({ source: "showcase", index: idx });
        }
      },
      { threshold: 0.4 },
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative py-20 bg-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            ভেতর থেকে দেখুন <span className="text-gold">প্রিমিয়াম যত্ন</span>
          </h2>
          <p className="text-muted-foreground">{productConfig.capsulesLabel}</p>
        </div>

        <div className="space-y-20">
          {copyConfig.showcase.blocks.map((block, idx) => (
            <div
              key={block.title}
              ref={(el) => { blockRefs.current[idx] = el; }}
              data-idx={idx}
              className="space-y-6"
            >
              <AutoScrollGallery
                images={galleries[idx]}
                height="h-80"
                speed={idx % 2 === 0 ? "normal" : "slow"}
              />
              <div className="grid md:grid-cols-3 gap-6 items-start mt-8">
                <div className="md:col-span-2 space-y-3">
                  <div className="text-xs text-gold uppercase tracking-widest">BLOCK {idx + 1}</div>
                  <h3
                    className="text-2xl md:text-4xl font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {block.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {block.desc}
                  </p>
                  <CTAButton>{copyConfig.featured.cta}</CTAButton>
                </div>
                <div className="bg-card-luxe border-gold rounded-2xl p-5 shadow-elegant">
                  <div className="text-xs text-gold uppercase tracking-widest mb-3">প্রোডাক্ট স্পেক</div>
                  <ul className="space-y-2 text-sm">
                    {productConfig.spec.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">●</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}