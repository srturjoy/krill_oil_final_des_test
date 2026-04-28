import { useState, useEffect, useRef } from "react";
import { pricingConfig } from "@/config/pricingConfig";
import { trackingConfig } from "@/config/trackingConfig";
import {
  trackViewContent,
  trackAddToCart,
  trackPurchase,
  newEventId,
  trackOrderFormOpen,
  trackProductSelected,
  trackQuantityChange,
  trackCustomerInfoFilled,
  trackDeliveryInfoFilled,
  trackFormSubmitAttempt,
  trackOrderValidationError,
  setUserIdentity,
  trackLead,
  trackInitiateCheckout,
} from "@/lib/tracking/events";
import { useOrder } from "@/components/order/OrderContext";
import { productConfig } from "@/config/productConfig";
import { useNavigate } from "@tanstack/react-router";
import { X, ArrowLeft } from "lucide-react";
import { ContactActions } from "@/components/ui/ContactActions";

/* ---------------- helpers: UTM + 10-min phone lock + device lock ---------------- */

const PHONE_LOCK_MIN = 10;
const DEVICE_ID_KEY = "_device_id";

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = "dev_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const stored = JSON.parse(sessionStorage.getItem("_utm") || "{}");
    const url = new URL(window.location.href);
    const live: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = url.searchParams.get(k);
      if (v) live[k] = v;
    });
    return { ...stored, ...live };
  } catch {
    return {};
  }
}

function phoneLocked(kind: "lead" | "order", phone: string): boolean {
  if (typeof window === "undefined" || !phone) return false;
  try {
    const key = `_lock_${kind}_${phone}`;
    const ts = Number(localStorage.getItem(key) || 0);
    return ts > 0 && Date.now() - ts < PHONE_LOCK_MIN * 60 * 1000;
  } catch {
    return false;
  }
}

function setPhoneLock(kind: "lead" | "order", phone: string) {
  if (typeof window === "undefined" || !phone) return;
  try {
    localStorage.setItem(`_lock_${kind}_${phone}`, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function deviceLocked(kind: "order"): boolean {
  if (typeof window === "undefined") return false;
  try {
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return false;
    const key = `_lock_${kind}_device_${deviceId}`;
    const ts = Number(localStorage.getItem(key) || 0);
    return ts > 0 && Date.now() - ts < PHONE_LOCK_MIN * 60 * 1000;
  } catch {
    return false;
  }
}

function setDeviceLock(kind: "order") {
  if (typeof window === "undefined") return;
  try {
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return;
    localStorage.setItem(`_lock_${kind}_device_${deviceId}`, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/**
 * Send a row to the Google Apps Script /exec endpoint that fans out
 * to the "Leads" or "Orders" tab based on `data_type`.
 *
 * IMPORTANT:
 * - Use `mode: "no-cors"` and DO NOT set a Content-Type header.
 *   Setting Content-Type triggers a CORS preflight which Apps Script
 *   /exec rejects, causing rows to silently never appear.
 * - Apps Script will receive the JSON body as `e.postData.contents`.
 */
function postToSheets(payload: Record<string, unknown>) {
  const endpoint = trackingConfig.googleSheetsEndpoint;
  const kind = payload.data_type === "order" ? "order" : "lead";
  // eslint-disable-next-line no-console
  console.log("[CRM] endpoint:", endpoint);
  // eslint-disable-next-line no-console
  console.log("[CRM] payload:", payload);
  if (!endpoint || endpoint.includes("YOUR_DEPLOYMENT_ID")) {
    // eslint-disable-next-line no-console
    console.warn(`[CRM] ${kind} submit SKIPPED — endpoint not configured`);
    return;
  }
  try {
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`[CRM] ${kind} submit OK (opaque response — no-cors)`);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`[CRM] ${kind} submit FAILED:`, err);
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[CRM] ${kind} submit threw:`, err);
  }
}

/** Read fbp/fbc cookies set by Meta Pixel (used for CAPI EMQ). */
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}

export function OrderPopup() {
  const { open, closeOrder, selected, setSelected } = useOrder();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Track only the FIRST time each field gets meaningful input
  const filled = useRef({ name: false, phone: false, address: false });
  // Once a Lead has been fired for a (name, phone) pair this session, don't refire
  const leadFiredFor = useRef<string>("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Reset first-fill tracking each time the popup opens
      filled.current = { name: false, phone: false, address: false };
      trackOrderFormOpen({ packageId: selected.id, value: selected.price });
      trackViewContent({
        item_id: selected.id,
        item_name: `${productConfig.name} — ${selected.title}`,
        price: selected.price,
        quantity: selected.bottles,
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, selected]);

  // ESC key closes popup
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOrder();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOrder]);

  if (!open) return null;

  const validatePhone = (p: string) => /^01[3-9]\d{8}$/.test(p);

  /**
   * Fire a Lead event + push abandoned-lead row to the Leads tab.
   * Triggered as soon as we have name + valid BD phone.
   * Deduped by (name|phone) within session AND a 10-min phone lock.
   */
  const maybeFireLead = async (n: string, p: string) => {
    if (!n || n.trim().length < 2 || !validatePhone(p)) return;
    const key = `${n.trim()}|${p}`;
    if (leadFiredFor.current === key) return;
    if (phoneLocked("lead", p) || phoneLocked("order", p)) {
      leadFiredFor.current = key;
      return;
    }
    leadFiredFor.current = key;

    // Hashed identity for Pixel Advanced Matching + CAPI EMQ
    await setUserIdentity({ phone: p });

    const item = {
      item_id: selected.id,
      item_name: `${productConfig.name} — ${selected.title}`,
      price: selected.price,
      quantity: selected.bottles,
    };
    const leadEventId = trackLead(item, { packageId: selected.id });

    const utm = readUtm();
    postToSheets({
      data_type: "lead",
      name: n.trim(),
      phone: p,
      alternative_phone: "",
      address: address.trim(),
      district: "",
      area: "",
      product: productConfig.name,
      variant: selected.title,
      quantity: selected.bottles,
      price: selected.price,
      unit_price: selected.bottles ? Math.round(selected.price / selected.bottles) : selected.price,
      delivery_charge: 0,
      discount: 0,
      total_amount: selected.price,
      payment_method: "Cash on Delivery",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_content: utm.utm_content || "",
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      event_id: leadEventId,
      timestamp: new Date().toISOString(),
    });
    setPhoneLock("lead", p);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    trackFormSubmitAttempt({ packageId: selected.id, value: selected.price });
    if (!name.trim() || name.trim().length < 2) {
      const msg = "সঠিক নাম লিখুন";
      trackOrderValidationError("name", msg);
      return setError(msg);
    }
    if (!validatePhone(phone)) {
      const msg = "সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (01XXXXXXXXX)";
      trackOrderValidationError("phone", msg);
      return setError(msg);
    }
    if (!address.trim() || address.trim().length < 8) {
      const msg = "সম্পূর্ণ ঠিকানা লিখুন";
      trackOrderValidationError("address", msg);
      return setError(msg);
    }

    // 10-min duplicate-order phone lock or device lock — don't double-charge attribution
    if (phoneLocked("order", phone) || deviceLocked("order")) {
      const msg = "আপনি ইতিমধ্যে অর্ডার করেছেন। ১০ মিনিট পর আবার চেষ্টা করুন।";
      trackOrderValidationError("lock", msg);
      return setError(msg);
    }

    // Push hashed identity to enable Pixel Advanced Matching + CAPI EMQ boost
    await setUserIdentity({ phone });

    setSubmitting(true);
    const item = {
      item_id: selected.id,
      item_name: `${productConfig.name} — ${selected.title}`,
      price: selected.price,
      quantity: selected.bottles,
    };
    // Treat package selection at submit-time as AddToCart (last confirmed intent)
    trackAddToCart(item);
    // Funnel: ViewContent → AddToCart → Lead → InitiateCheckout → Purchase
    await maybeFireLead(name, phone);
    trackInitiateCheckout(item);

    const transactionId = newEventId("order");
    const utm = readUtm();
    const orderPayload = {
      data_type: "order",
      name: name.trim(),
      phone: phone.trim(),
      alternative_phone: "",
      address: address.trim(),
      district: "",
      area: "",
      product: productConfig.name,
      variant: selected.title,
      quantity: selected.bottles,
      price: selected.price,
      unit_price: selected.bottles ? Math.round(selected.price / selected.bottles) : selected.price,
      delivery_charge: 0,
      discount: 0,
      total_amount: selected.price,
      payment_method: "Cash on Delivery",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_content: utm.utm_content || "",
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      event_id: transactionId,
      timestamp: new Date().toISOString(),
    };
    // Push the order row to Sheets (Orders tab) — fire-and-forget
    postToSheets(orderPayload);
    setPhoneLock("order", phone);
    setDeviceLock("order");

    // Persist transaction context for thank-you page. Purchase fires THERE
    // (per spec: "Purchase fires only on thank-you/order_success").
    const purchaseEventId = newEventId("purchase");
    try {
      sessionStorage.setItem(
        "lastPurchase",
        JSON.stringify({
          transaction_id: transactionId,
          event_id: purchaseEventId,
          packageId: selected.id,
          value: selected.price,
          fired: false,
          ...utm,
        }),
      );
    } catch {
      /* ignore */
    }
    setSubmitting(false);
    closeOrder();
    navigate({ to: "/thank-you" });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-3 md:p-6 bg-[oklch(0.05_0.02_20/0.85)] backdrop-blur-sm overflow-y-auto"
      onClick={closeOrder}
      role="dialog"
      aria-modal="true"
      aria-label="অর্ডার ফর্ম"
    >
      <div
        className="relative w-full max-w-4xl bg-card-luxe border-gold rounded-3xl shadow-elegant overflow-hidden my-4 md:my-8 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header with Back + Close — always visible */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 md:px-4 md:py-3 bg-[oklch(0.1_0.03_22/0.95)] backdrop-blur border-b border-gold">
          <button
            type="button"
            onClick={closeOrder}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[oklch(0.18_0.05_22)] border border-[oklch(0.78_0.15_80/0.4)] text-xs md:text-sm text-foreground hover:bg-[oklch(0.28_0.09_25)] active:scale-95 transition"
            aria-label="back"
          >
            <ArrowLeft className="w-4 h-4" /> পিছনে
          </button>
          <div className="text-xs md:text-sm font-bold text-gold truncate px-2">
            অর্ডার কনফার্মেশন
          </div>
          <button
            type="button"
            onClick={closeOrder}
            className="inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[oklch(0.55_0.22_25)] text-white hover:bg-[oklch(0.45_0.2_22)] active:scale-95 shadow-glow transition"
            aria-label="close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-2">
          {/* Left */}
          <div className="bg-hero p-6 md:p-8 space-y-4">
            <div className="text-xs text-gold uppercase tracking-widest">YOUR ORDER</div>
            <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {productConfig.banglaName}
            </h3>
            <img
              src={productConfig.heroImages[0]}
              alt=""
              className="w-full max-w-[220px] mx-auto"
            />
            <div className="bg-[oklch(0.16_0.05_22)] rounded-2xl p-4 border-gold">
              <div className="text-xs text-muted-foreground mb-1">নির্বাচিত প্যাকেজ</div>
              <div className="font-bold text-lg">{selected.title}</div>
              <div className="text-sm text-muted-foreground">{selected.subtitle}</div>
              <div className="text-2xl text-gold font-bold mt-2">৳{selected.price}</div>
            </div>
            <div className="space-y-2 text-xs">
              {productConfig.badges.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span>{b.icon}</span> <span className="text-gold">{b.label}</span>
                  <span className="text-muted-foreground">— {b.sub}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <form onSubmit={submit} className="p-6 md:p-8 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">অর্ডার তথ্য পূরণ করুন</h3>
              <p className="text-xs text-muted-foreground">অর্ডারের পর প্রতিনিধি ফোনে কনফার্ম করবে।</p>
            </div>

            <div>
              <label className="text-xs text-gold mb-1 block">প্যাকেজ নির্বাচন</label>
              <div className="space-y-2">
                {pricingConfig.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      selected.id === p.id
                        ? "border-[oklch(0.78_0.15_80)] bg-[oklch(0.55_0.22_25/0.15)]"
                        : "border-[oklch(0.78_0.15_80/0.2)] bg-[oklch(0.16_0.05_22)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pkg"
                      checked={selected.id === p.id}
                      onChange={() => {
                        const prevQty = selected.bottles;
                        setSelected(p);
                        trackProductSelected({
                          item_id: p.id,
                          item_name: `${productConfig.name} — ${p.title}`,
                          price: p.price,
                          quantity: p.bottles,
                        });
                        if (prevQty !== p.bottles) {
                          trackQuantityChange(
                            {
                              item_id: p.id,
                              item_name: `${productConfig.name} — ${p.title}`,
                              price: p.price,
                              quantity: p.bottles,
                            },
                            prevQty,
                          );
                        }
                      }}
                      className="accent-[oklch(0.78_0.15_80)]"
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-bold">{p.title} {p.popular && <span className="text-gold text-xs">★ জনপ্রিয়</span>}</div>
                      <div className="text-xs text-muted-foreground">{p.subtitle}</div>
                    </div>
                    <div className="text-gold font-bold">৳{p.price}</div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gold mb-1 block">আপনার নাম *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => {
                  if (!filled.current.name && e.target.value.trim().length >= 2) {
                    filled.current.name = true;
                    trackCustomerInfoFilled({ field: "name" });
                  }
                  // Try to qualify a Lead as soon as we have name + valid phone
                  maybeFireLead(e.target.value, phone);
                }}
                maxLength={80}
                className="w-full p-3 rounded-xl bg-[oklch(0.16_0.05_22)] border border-[oklch(0.78_0.15_80/0.3)] focus:border-[oklch(0.78_0.15_80)] outline-none"
                placeholder="যেমন: রফিকুল ইসলাম"
              />
            </div>
            <div>
              <label className="text-xs text-gold mb-1 block">মোবাইল নম্বর * (১১ ডিজিট)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                onBlur={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (!filled.current.phone && /^01[3-9]\d{8}$/.test(digits)) {
                    filled.current.phone = true;
                    trackCustomerInfoFilled({ field: "phone" });
                    // Sync hashed identity early for Advanced Matching on later events
                    setUserIdentity({ phone: digits });
                  }
                  // Auto-qualify Lead the moment name + valid phone are present
                  maybeFireLead(name, digits);
                }}
                inputMode="numeric"
                className="w-full p-3 rounded-xl bg-[oklch(0.16_0.05_22)] border border-[oklch(0.78_0.15_80/0.3)] focus:border-[oklch(0.78_0.15_80)] outline-none"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="text-xs text-gold mb-1 block">সম্পূর্ণ ঠিকানা *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={(e) => {
                  if (!filled.current.address && e.target.value.trim().length >= 8) {
                    filled.current.address = true;
                    trackDeliveryInfoFilled({ field: "address" });
                  }
                }}
                maxLength={300}
                rows={3}
                className="w-full p-3 rounded-xl bg-[oklch(0.16_0.05_22)] border border-[oklch(0.78_0.15_80/0.3)] focus:border-[oklch(0.78_0.15_80)] outline-none"
                placeholder="বাসা, রাস্তা, এলাকা, থানা, জেলা"
              />
            </div>

            {error && (
              <div className="text-sm text-[oklch(0.85_0.18_25)] bg-[oklch(0.55_0.22_25/0.15)] border border-[oklch(0.55_0.22_25/0.4)] rounded-lg p-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cta text-primary-foreground font-bold py-4 rounded-xl text-lg shadow-glow animate-pulse-glow disabled:opacity-60 hover:scale-[1.02] transition"
            >
              {submitting ? "প্রসেসিং..." : `🛒 অর্ডার কনফার্ম করুন (৳${selected.price})`}
            </button>

            <div className="text-center text-xs text-muted-foreground">
              💵 ক্যাশ অন ডেলিভারি • 🚚 ফ্রি ডেলিভারি • ✅ ১০০% নিরাপদ
            </div>

            <div className="pt-3 border-t border-[oklch(0.78_0.15_80/0.2)]">
              <p className="text-xs text-center text-muted-foreground mb-2">
                ফর্ম পূরণে সমস্যা? সরাসরি যোগাযোগ করুন
              </p>
              <ContactActions variant="compact" className="justify-center" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}