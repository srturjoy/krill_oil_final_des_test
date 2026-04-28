import { cn } from "@/lib/utils";
import { useOrder } from "@/components/order/OrderContext";
import { trackBeginCheckout, trackEvent } from "@/lib/tracking/events";
import { pricingConfig } from "@/config/pricingConfig";
import { productConfig } from "@/config/productConfig";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "gold" | "ghost";
  packageId?: string;
  glow?: boolean;
};

export function CTAButton({
  children,
  size = "lg",
  variant = "primary",
  className,
  packageId,
  glow = true,
  onClick,
  ...rest
}: Props) {
  const { openOrder } = useOrder();
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  const variants = {
    primary:
      "bg-cta text-primary-foreground border border-[oklch(0.78_0.15_80/0.4)] hover:scale-[1.03]",
    gold: "bg-gold text-[oklch(0.15_0.04_25)] hover:scale-[1.03] font-bold",
    ghost: "border border-gold text-gold hover:bg-[oklch(0.78_0.15_80/0.1)]",
  };
  return (
    <button
      onClick={(e) => {
        const pkg = pricingConfig.find((p) => p.id === packageId) ?? pricingConfig[0];
        // CTA click event (generic — for funnel/CTR analysis)
        trackEvent("CTAClick", {
          cta: "order_now",
          packageId: pkg.id,
          value: pkg.price,
        });
        // Ecommerce begin_checkout / Pixel InitiateCheckout
        trackBeginCheckout({
          item_id: pkg.id,
          item_name: `${productConfig.name} — ${pkg.title}`,
          price: pkg.price,
          quantity: pkg.bottles,
        });
        onClick?.(e);
        openOrder(packageId);
      }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-300 cursor-pointer",
        sizes[size],
        variants[variant],
        glow && variant === "primary" && "animate-pulse-glow",
        className,
      )}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}