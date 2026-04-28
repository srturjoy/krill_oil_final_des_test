import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { copyConfig } from "@/config/copyConfig";
import { productConfig } from "@/config/productConfig";
import { pricingConfig } from "@/config/pricingConfig";
import { trackPurchase, newEventId } from "@/lib/tracking/events";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "ধন্যবাদ — আপনার অর্ডার গ্রহণ করা হয়েছে" },
      { name: "description", content: "আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("lastPurchase");
      const data = raw ? JSON.parse(raw) : null;
      // Purchase MUST only fire once per transaction (browser+CAPI dedup via event_id)
      if (data?.fired) return;
      const fallbackPkg = pricingConfig[0];
      const pkg =
        pricingConfig.find((p) => p.id === data?.packageId) || fallbackPkg;
      const txn = data?.transaction_id || newEventId("order");
      trackPurchase(
        txn,
        {
          item_id: pkg.id,
          item_name: `${productConfig.name} — ${pkg.title}`,
          price: data?.value || pkg.price,
          quantity: pkg.bottles ?? 1,
        },
        { packageId: pkg.id },
      );
      sessionStorage.setItem(
        "lastPurchase",
        JSON.stringify({ ...(data || {}), transaction_id: txn, fired: true }),
      );
    } catch {
      /* never break thank-you UX */
    }
  }, []);

  return (
    <main className="min-h-screen bg-hero text-foreground py-16 px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-up">
        <div className="text-7xl mb-4">🎉</div>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold mb-5 animate-pulse-glow">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
          <span className="text-gold">{copyConfig.thankYou.title}</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">{copyConfig.thankYou.sub}</p>

        <div className="bg-card-luxe border-gold rounded-3xl p-6 shadow-elegant text-left mb-8">
          <div className="text-xs text-gold uppercase tracking-widest mb-3">পরবর্তী ধাপ</div>
          <ul className="space-y-2 text-sm">
            <li>📞 ১-২ ঘণ্টার মধ্যে আমাদের প্রতিনিধি ফোনে কল করবে</li>
            <li>🚚 কনফার্মেশনের পর ১-৪ দিনে ডেলিভারি</li>
            <li>💵 প্রোডাক্ট হাতে পেয়ে টাকা পরিশোধ করবেন (COD)</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gold">আরও সাশ্রয়ী প্যাকেজ দেখুন</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {pricingConfig.map((p) => (
            <div key={p.id} className="bg-card-luxe border-gold rounded-2xl p-4">
              <img src={productConfig.heroImages[0]} alt="" className="w-20 h-20 mx-auto object-contain mb-2" />
              <div className="font-bold text-sm">{p.title}</div>
              <div className="text-gold font-bold">৳{p.price}</div>
            </div>
          ))}
        </div>

        <Link to="/" className="inline-block bg-cta text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-glow">
          হোমে ফিরুন
        </Link>
      </div>
    </main>
  );
}