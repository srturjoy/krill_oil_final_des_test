import { useEffect, useState } from "react";
import { useOrder } from "@/components/order/OrderContext";
import { ownerConfig } from "@/config/ownerConfig";
import { copyConfig } from "@/config/copyConfig";
import { ContactActions, WhatsAppIcon } from "@/components/ui/ContactActions";
import { Phone } from "lucide-react";

const recentOrders = [
  { name: "করিম", loc: "ঢাকা", pkg: "২ বোতল কম্বো" },
  { name: "ফাতেমা", loc: "চট্টগ্রাম", pkg: "৩ বোতল সেভার" },
  { name: "জাহিদ", loc: "সিলেট", pkg: "১ বোতল প্যাকেজ" },
  { name: "শারমিন", loc: "রাজশাহী", pkg: "২ বোতল কম্বো" },
  { name: "মাহমুদ", loc: "খুলনা", pkg: "৩ বোতল সেভার" },
  { name: "নাজমা", loc: "বরিশাল", pkg: "২ বোতল কম্বো" },
];

export function StickyCTA() {
  const { openOrder, open } = useOrder();
  const [showRecent, setShowRecent] = useState(false);
  const [recentIdx, setRecentIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [exitShown, setExitShown] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setRecentIdx((p) => (p + 1) % recentOrders.length);
      setShowRecent(true);
      setTimeout(() => setShowRecent(false), 4500);
      i++;
    }, 9000);
    const initialT = setTimeout(() => {
      setShowRecent(true);
      setTimeout(() => setShowRecent(false), 4500);
    }, 3000);
    return () => {
      clearInterval(t);
      clearTimeout(initialT);
      void i;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitShown && !open) {
        setExitShown(true);
        setExitOpen(true);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [exitShown, open]);

  if (open) return null;

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
        <div className="h-full bg-gold transition-all" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* Recent order popup */}
      <div
        className={`fixed left-3 bottom-24 md:bottom-6 z-[70] max-w-xs glass rounded-xl p-3 shadow-elegant transition-all duration-500 ${
          showRecent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-[oklch(0.15_0.04_25)] font-bold">
            {recentOrders[recentIdx].name[0]}
          </div>
          <div className="text-xs">
            <div className="font-bold text-foreground">{recentOrders[recentIdx].name} ({recentOrders[recentIdx].loc})</div>
            <div className="text-muted-foreground">এইমাত্র অর্ডার করেছেন: {recentOrders[recentIdx].pkg}</div>
          </div>
        </div>
      </div>

      {/* Side floating CTAs */}
      <ContactActions
        variant="floating"
        className="fixed right-3 bottom-28 md:bottom-6 z-[70]"
      />

      {/* Sticky bottom CTA (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-[65] md:hidden">
        <div className="bg-[oklch(0.1_0.03_20/0.95)] backdrop-blur border-t border-gold px-2 py-2 flex items-center gap-1.5">
          <a
            href={`tel:${ownerConfig.phone}`}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gold text-[oklch(0.15_0.04_25)] active:scale-95 shadow-gold shrink-0"
            aria-label="কল করুন"
          >
            <Phone className="w-5 h-5" strokeWidth={2.5} />
          </a>
          <a
            href={`https://wa.me/${ownerConfig.whatsapp}`}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-[#25D366] text-white active:scale-95 shadow-elegant shrink-0"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
          <button
            onClick={() => openOrder()}
            className="flex-1 bg-cta text-primary-foreground font-bold px-3 py-3 rounded-xl shadow-glow animate-pulse-glow text-sm"
          >
            🛒 অর্ডার করুন — ৳১৪৯০
          </button>
        </div>
      </div>
      {/* Desktop floating buy */}
      <button
        onClick={() => openOrder()}
        className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[65] bg-cta text-primary-foreground font-bold px-8 py-4 rounded-full shadow-glow animate-pulse-glow items-center gap-2"
      >
        🛒 এখনই অর্ডার করুন — ৳১৪৯০
      </button>

      {/* Exit intent */}
      {exitOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[oklch(0.05_0.02_20/0.85)] backdrop-blur-sm">
          <div className="bg-card-luxe border-gold rounded-3xl p-6 md:p-8 max-w-md text-center shadow-elegant animate-fade-up">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="text-2xl font-bold mb-2 text-gold" style={{ fontFamily: "var(--font-display)" }}>
              দাঁড়ান!
            </h3>
            <p className="text-muted-foreground mb-5">
              আজকের অফার মিস করবেন না — মাত্র ৳১৪৯০ এ পাচ্ছেন ৬০টি প্রিমিয়াম সফটজেল ক্যাপসুল + ফ্রি ডেলিভারি।
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setExitOpen(false);
                  openOrder();
                }}
                className="bg-cta text-primary-foreground font-bold py-3 rounded-xl shadow-glow animate-pulse-glow"
              >
                হ্যাঁ, অর্ডার করব
              </button>
              <button
                onClick={() => setExitOpen(false)}
                className="text-muted-foreground text-sm py-2"
              >
                পরে দেখব
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground mt-3">{copyConfig.hero.urgency}</div>
          </div>
        </div>
      )}
    </>
  );
}