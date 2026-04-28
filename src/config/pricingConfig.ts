export type PricingPackage = {
  id: string;
  bottles: number;
  capsules: number;
  price: number;
  oldPrice?: number;
  title: string;
  subtitle: string;
  badge?: string;
  popular?: boolean;
  perks: string[];
};

export const pricingConfig: PricingPackage[] = [
  {
    id: "1-bottle",
    bottles: 1,
    capsules: 60,
    price: 1490,
    oldPrice: 1990,
    title: "১ বোতল প্যাকেজ",
    subtitle: "৬০ ক্যাপসুল • ২ মাসের সাপোর্ট",
    perks: ["ফ্রি ডেলিভারি", "ক্যাশ অন ডেলিভারি", "অরিজিনাল প্রোডাক্ট"],
  },
  {
    id: "2-bottle",
    bottles: 2,
    capsules: 120,
    price: 2490,
    oldPrice: 2980,
    title: "২ বোতল কম্বো",
    subtitle: "১২০ ক্যাপসুল • ৪ মাসের সাপোর্ট",
    badge: "সবচেয়ে জনপ্রিয়",
    popular: true,
    perks: ["সাশ্রয় ৪৯০৳", "ফ্রি ডেলিভারি", "ক্যাশ অন ডেলিভারি", "প্রিমিয়াম প্যাকেজিং"],
  },
  {
    id: "3-bottle",
    bottles: 3,
    capsules: 180,
    price: 3290,
    oldPrice: 4470,
    title: "৩ বোতল সেভার",
    subtitle: "১৮০ ক্যাপসুল • ৬ মাসের সাপোর্ট",
    badge: "বেস্ট ভ্যালু",
    perks: ["সাশ্রয় ১১৮০৳", "ফ্রি ডেলিভারি", "ক্যাশ অন ডেলিভারি", "VIP প্রায়োরিটি"],
  },
];