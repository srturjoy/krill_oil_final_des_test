import { copyConfig } from "@/config/copyConfig";

const icons = ["🚚", "💵", "✅", "🔒", "⚡"];

export function TrustBar() {
  return (
    <section className="relative py-5 border-y border-gold bg-[oklch(0.16_0.05_22)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {copyConfig.trust.map((t, i) => (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <div className="text-2xl">{icons[i]}</div>
              <div className="text-xs md:text-sm font-medium text-foreground/90">{t}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Ticker */}
      <div className="overflow-hidden mt-4 border-t border-gold pt-3">
        <div className="whitespace-nowrap animate-ticker text-sm text-gold/80">
          ✦ সারা বাংলাদেশে ফ্রি ডেলিভারি ✦ ক্যাশ অন ডেলিভারি ✦ ১০,০০০+ সন্তুষ্ট গ্রাহক ✦ অরিজিনাল প্রোডাক্ট গ্যারান্টি ✦ আজকের অর্ডারে স্পেশাল অফার ✦
        </div>
      </div>
    </section>
  );
}