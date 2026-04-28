import { createFileRoute } from "@tanstack/react-router";
import { OrderProvider } from "@/components/order/OrderContext";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ProductDetailShowcase } from "@/components/sections/ProductDetailShowcase";
import { Benefits } from "@/components/sections/Benefits";
import { LifestyleSection } from "@/components/sections/LifestyleSection";
import { Comparison } from "@/components/sections/Comparison";
import { OfferSection } from "@/components/sections/OfferSection";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { OrderPopup } from "@/components/sections/OrderPopup";
import { StickyCTA } from "@/components/sections/StickyCTA";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antarctic Fish Krill Oil — প্রতি বোতলে ৬০টি প্রিমিয়াম সফটজেল ক্যাপসুল" },
      { name: "description", content: "প্রিমিয়াম অ্যান্টার্কটিক ফিশ ক্রিল অয়েল — দৈনন্দিন প্রাণশক্তি, হার্ট, ব্রেইন ও জয়েন্ট সাপোর্ট। ফ্রি ডেলিভারি ও ক্যাশ অন ডেলিভারি।" },
      { property: "og:title", content: "Antarctic Fish Krill Oil — ৬০ ক্যাপসুল প্রিমিয়াম" },
      { property: "og:description", content: "৬০টি প্রিমিয়াম সফটজেল ক্যাপসুল। ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।" },
      { property: "og:image", content: "/images/hero-bottle-1.jpg" },
      { name: "twitter:image", content: "/images/hero-bottle-1.jpg" },
    ],
  }),
  component: Index,
});
// ... other code ... 

function Index() {
  return (
    <OrderProvider>
      <main className="bg-background text-foreground overflow-x-hidden">
        <HeroSection />
        <TrustBar />
        <FeaturedProducts />
        <ProductDetailShowcase />
        <Benefits />
        <LifestyleSection />
        <Comparison />
        <OfferSection />
        <Reviews />
        <Faq />
        <Footer />
        <StickyCTA />
        <OrderPopup />
      </main>
    </OrderProvider>
  );
}

// ... other code ... 
