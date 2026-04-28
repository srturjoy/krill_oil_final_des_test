import { useEffect, useState } from "react";
import { copyConfig } from "@/config/copyConfig";
import { CTAButton } from "@/components/ui/CTAButton";
import { CheckCircle2, ShieldCheck, BadgeCheck, Truck, Package, Star } from "lucide-react";

export function Reviews() {
  const items = copyConfig.reviews.items;
  const chats = copyConfig.reviews.chats;
  const orders = copyConfig.reviews.orders;
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <section className="relative py-20 bg-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-gold">{copyConfig.reviews.title}</span>
          </h2>
          <p className="text-muted-foreground">{copyConfig.reviews.sub}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {copyConfig.reviews.counters.map((c) => (
            <div key={c.label} className="bg-card-luxe border-gold rounded-2xl p-5 text-center shadow-elegant">
              <div className="text-2xl md:text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-display)" }}>{c.num}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Featured testimonial slider — no photos */}
        <div className="max-w-3xl mx-auto bg-card-luxe border-gold rounded-3xl p-6 md:p-10 shadow-elegant mb-12 relative overflow-hidden">
          <div className="absolute -top-6 -left-2 text-[120px] leading-none text-gold opacity-20 font-serif select-none">"</div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-gold text-xl tracking-wider">{"★".repeat(items[active].rating)}</div>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[oklch(0.25_0.08_140)] text-[oklch(0.9_0.15_140)] border border-[oklch(0.5_0.18_140/0.4)]">
                <BadgeCheck className="w-3 h-3" /> ভেরিফাইড পারচেজ
              </span>
            </div>
            <p className="text-base md:text-xl leading-relaxed mb-5 italic">"{items[active].text}"</p>
            <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-gold">
              <div>
                <div className="font-bold">{items[active].name}</div>
                <div className="text-sm text-muted-foreground">{items[active].loc} • {items[active].days}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[oklch(0.85_0.15_140)]">
                <CheckCircle2 className="w-4 h-4" /> অর্ডার কনফার্মড
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-2 bg-muted"}`}
                aria-label={`review ${i}`}
              />
            ))}
          </div>
        </div>

        {/* Continuous marquee testimonial carousel — no faces */}
        <div className="relative max-w-6xl mx-auto mb-12 overflow-hidden review-marquee-mask">
          <div className="flex gap-4 w-max animate-scroll-x-slow hover:[animation-play-state:paused]">
            {[...items, ...items, ...items].map((r, idx) => (
              <div
                key={`${r.name}-${idx}`}
                className="shrink-0 w-[300px] md:w-[340px] bg-card-luxe border-gold rounded-2xl p-5 shadow-elegant flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gold text-sm">{"★".repeat(r.rating)}</div>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[oklch(0.85_0.15_140)]">
                      <BadgeCheck className="w-3 h-3" /> ভেরিফাইড
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-3">"{r.text}"</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-gold">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-muted-foreground">{r.loc}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{r.days}</div>
              </div>
            ))}
          </div>
          <style>{`.review-marquee-mask{mask-image:linear-gradient(to right,transparent,black 6%,black 94%,transparent);}`}</style>
        </div>

        {/* Reverse direction marquee — second row */}
        <div className="relative max-w-6xl mx-auto mb-12 overflow-hidden review-marquee-mask">
          <div className="flex gap-4 w-max animate-scroll-x-slow [animation-direction:reverse] hover:[animation-play-state:paused]">
            {[...items, ...items, ...items].slice().reverse().map((r, idx) => (
              <div
                key={`rev-${r.name}-${idx}`}
                className="shrink-0 w-[300px] md:w-[340px] bg-card-luxe border-gold rounded-2xl p-5 shadow-elegant flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gold text-sm">{"★".repeat(r.rating)}</div>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[oklch(0.85_0.15_140)]">
                      <BadgeCheck className="w-3 h-3" /> ভেরিফাইড
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-3">"{r.text}"</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-gold">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-muted-foreground">{r.loc}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{r.days}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat-style screenshot + Order proof */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {/* Chat mockup */}
          <div className="bg-card-luxe border-gold rounded-2xl shadow-elegant overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.18_0.05_22)] border-b border-gold">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-[oklch(0.15_0.04_25)] font-bold text-xs">AK</div>
                <div>
                  <div className="text-xs font-bold">Antarctic Krill BD</div>
                  <div className="text-[10px] text-[oklch(0.85_0.15_140)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.2_140)]" /> অনলাইন
                  </div>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <div className="p-4 space-y-3 bg-[oklch(0.1_0.03_22)]">
              {chats.map((c, i) => (
                <div key={i} className={`flex ${c.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    c.from === "user"
                      ? "bg-[oklch(0.4_0.18_25)] text-white rounded-br-sm"
                      : "bg-[oklch(0.22_0.05_25)] text-foreground rounded-bl-sm border border-gold"
                  }`}>
                    <p>{c.text}</p>
                    <div className="text-[9px] opacity-60 mt-1 text-right">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 text-center text-[10px] text-muted-foreground border-t border-gold">
              💬 প্রতিদিন ২০০+ অর্ডার কনফার্মেশন কথোপকথন
            </div>
          </div>

          {/* Order proof card */}
          <div className="bg-card-luxe border-gold rounded-2xl shadow-elegant overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.18_0.05_22)] border-b border-gold">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gold" />
                <div className="text-xs font-bold">সাম্প্রতিক অর্ডার প্রুফ</div>
              </div>
              <span className="text-[10px] text-[oklch(0.85_0.15_140)]">লাইভ আপডেট</span>
            </div>
            <div className="divide-y divide-[oklch(0.78_0.15_80/0.2)]">
              {orders.map((o) => (
                <div key={o.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">{o.id}</div>
                    <div className="text-[10px] text-muted-foreground">{o.pkg}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gold">{o.price}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-[oklch(0.85_0.15_140)]">
                      <Truck className="w-3 h-3" /> {o.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-[oklch(0.1_0.03_22)] flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t border-gold">
              <ShieldCheck className="w-3 h-3 text-gold" /> COD নিরাপদ • সিল ইন্ট্যাক্ট ডেলিভারি
            </div>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {[
            { icon: BadgeCheck, label: "১০০% ভেরিফাইড রিভিউ" },
            { icon: ShieldCheck, label: "অরিজিনাল প্রোডাক্ট" },
            { icon: Star, label: "৪.৯/৫ গড় রেটিং" },
            { icon: Truck, label: "সিল ইন্ট্যাক্ট ডেলিভারি" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 bg-card-luxe border-gold rounded-xl px-3 py-3 shadow-elegant">
              <b.icon className="w-5 h-5 text-gold shrink-0" />
              <span className="text-[11px] md:text-xs font-medium">{b.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <CTAButton size="xl">আপনিও আজই অর্ডার করুন</CTAButton>
        </div>
      </div>
    </section>
  );
}