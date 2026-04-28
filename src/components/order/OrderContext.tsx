import { createContext, useContext, useState, type ReactNode } from "react";
import { pricingConfig, type PricingPackage } from "@/config/pricingConfig";

type OrderContextValue = {
  open: boolean;
  selected: PricingPackage;
  openOrder: (packageId?: string) => void;
  closeOrder: () => void;
  setSelected: (p: PricingPackage) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PricingPackage>(
    pricingConfig.find((p) => p.popular) ?? pricingConfig[0],
  );

  const openOrder = (packageId?: string) => {
    if (packageId) {
      const found = pricingConfig.find((p) => p.id === packageId);
      if (found) setSelected(found);
    }
    setOpen(true);
  };

  return (
    <OrderContext.Provider
      value={{ open, selected, openOrder, closeOrder: () => setOpen(false), setSelected }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}