/**
 * Modular ecommerce + engagement tracking.
 * - GTM dataLayer push
 * - GA4 (gtag) event
 * - Meta Pixel (fbq) with shared event_id
 * - CAPI proxy (sendBeacon, non-blocking) with the same event_id for dedup
 *
 * Every event payload is enriched with UTM, fbp/fbc cookies, page_url,
 * referrer, user_agent, session_id and external_id for max EMQ.
 */
import { trackingConfig, isConfigured } from "@/config/trackingConfig";

type Params = Record<string, unknown>;

type EcomItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _trackingSession?: TrackingSession;
  }
}

type TrackingSession = {
  session_id: string;
  external_id: string;
  fbp?: string;
  fbc?: string;
  utm: Record<string, string>;
  user_agent: string;
  page_url: string;
  referrer: string;
  user_data: { em?: string; ph?: string }; // SHA-256 hashed
};

/* -------------------------- Cookie / storage utils -------------------------- */

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function captureUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = url.searchParams.get(k);
    if (v) out[k] = v;
  }
  // Persist first-touch UTMs in sessionStorage so later events still get them
  try {
    const stored = JSON.parse(sessionStorage.getItem("_utm") || "{}");
    const merged = { ...stored, ...out };
    if (Object.keys(out).length) sessionStorage.setItem("_utm", JSON.stringify(merged));
    return Object.keys(merged).length ? merged : stored;
  } catch {
    return out;
  }
}

function getOrCreate(key: string, factory: () => string): string {
  if (typeof window === "undefined") return factory();
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const v = factory();
    localStorage.setItem(key, v);
    return v;
  } catch {
    return factory();
  }
}

/** Generate a short unique id used for browser↔server event dedup. */
export function newEventId(prefix = "evt") {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

/** SHA-256 hex (used for hashed em/ph in advanced matching + CAPI). */
export async function sha256Hex(input: string): Promise<string> {
  const text = input.trim().toLowerCase();
  if (!text) return "";
  if (typeof crypto === "undefined" || !crypto.subtle) return "";
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Normalize BD phone → +880XXXXXXXXXX before hashing. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return "+" + digits;
  if (digits.startsWith("0")) return "+88" + digits;
  return "+" + digits;
}

/* ----------------------------- Session bootstrap ---------------------------- */

export function getSession(): TrackingSession {
  if (typeof window === "undefined") {
    return {
      session_id: "",
      external_id: "",
      utm: {},
      user_agent: "",
      page_url: "",
      referrer: "",
      user_data: {},
    };
  }
  if (window._trackingSession) {
    // refresh url + utm in case of SPA navigation
    window._trackingSession.page_url = window.location.href;
    window._trackingSession.utm = captureUtm();
    window._trackingSession.fbp = getCookie("_fbp") || window._trackingSession.fbp;
    window._trackingSession.fbc = getCookie("_fbc") || window._trackingSession.fbc;
    return window._trackingSession;
  }
  const session_id = getOrCreate("_sid", () => newEventId("sid"));
  const external_id = getOrCreate("_eid", () => newEventId("uid"));
  let userData: { em?: string; ph?: string } = {};
  try {
    userData = JSON.parse(localStorage.getItem("_um") || "{}");
  } catch {
    /* ignore */
  }
  const s: TrackingSession = {
    session_id,
    external_id,
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    utm: captureUtm(),
    user_agent: navigator.userAgent,
    page_url: window.location.href,
    referrer: document.referrer,
    user_data: userData,
  };
  window._trackingSession = s;
  return s;
}

/**
 * Persist hashed user identifiers (em/ph) for advanced matching + CAPI.
 * Call this from the order form once user provides phone (and optionally email).
 */
export async function setUserIdentity(opts: { phone?: string; email?: string }) {
  const out: { em?: string; ph?: string } = {};
  if (opts.email) out.em = await sha256Hex(opts.email);
  if (opts.phone) out.ph = await sha256Hex(normalizePhone(opts.phone));
  try {
    const merged = { ...JSON.parse(localStorage.getItem("_um") || "{}"), ...out };
    localStorage.setItem("_um", JSON.stringify(merged));
    if (typeof window !== "undefined" && window._trackingSession) {
      window._trackingSession.user_data = merged;
    }
    // Re-init Pixel with advanced matching so future events carry hashed ids
    if (
      trackingConfig.enableAdvancedMatching &&
      isConfigured(trackingConfig.metaPixelId) &&
      typeof window !== "undefined" &&
      window.fbq
    ) {
      window.fbq("init", trackingConfig.metaPixelId, merged);
    }
  } catch {
    /* ignore */
  }
}

/* -------------------------------- Dispatchers ------------------------------- */

function pushDataLayer(payload: Params) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function sendCapi(eventName: string, eventId: string, params: Params) {
  if (typeof window === "undefined") return;
  if (!isConfigured(trackingConfig.metaPixelId)) return;
  if (!trackingConfig.capiEndpoint) return;
  try {
    const s = getSession();
    const body = JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: s.page_url,
      action_source: "website",
      custom_data: params,
      user_data: {
        ...s.user_data,
        fbp: s.fbp,
        fbc: s.fbc,
        external_id: s.external_id,
        client_user_agent: s.user_agent,
      },
      timestamp: Math.floor(Date.now() / 1000),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        trackingConfig.capiEndpoint,
        new Blob([body], { type: "application/json" }),
      );
    } else {
      fetch(trackingConfig.capiEndpoint, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body,
      }).catch(() => {});
    }
  } catch {
    /* never break UX */
  }
}

function enrich(params: Params): Params {
  const s = getSession();
  return {
    ...params,
    session_id: s.session_id,
    external_id: s.external_id,
    page_url: s.page_url,
    referrer: s.referrer,
    user_agent: s.user_agent,
    fbp: s.fbp,
    fbc: s.fbc,
    ...s.utm,
  };
}

function debugLog(name: string, payload: Params) {
  if (trackingConfig.debug && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.log(`[track] ${name}`, payload);
  }
}

/* ---------------------------------- API ----------------------------------- */

/**
 * Generic event — fires GTM dataLayer, gtag, fbq, and CAPI in one call.
 * Returns the event_id used.
 */
export function trackEvent(eventName: string, params: Params = {}): string {
  const eventId = (params.event_id as string) || newEventId(eventName.toLowerCase());
  const enriched = enrich({ event_id: eventId, ...params });

  if (typeof window === "undefined") return eventId;
  try {
    pushDataLayer({ event: eventName, ...enriched });
    window.gtag?.("event", eventName, enriched);
    window.fbq?.("trackCustom", eventName, enriched, { eventID: eventId });
    sendCapi(eventName, eventId, enriched);
    debugLog(eventName, enriched);
  } catch (e) {
    if (trackingConfig.debug) console.warn("trackEvent failed", eventName, e);
  }
  return eventId;
}

/**
 * Ecommerce event with GA4-shape items + Meta Pixel mapping.
 * gaName: GA4/dataLayer name (e.g. "view_item")
 * fbName: Meta Pixel STANDARD name (e.g. "ViewContent")
 */
export function trackEcommerce(
  gaName: string,
  fbName: string,
  opts: { value: number; items: EcomItem[]; extra?: Params } = {
    value: 0,
    items: [],
  },
): string {
  const { value, items, extra = {} } = opts;
  const currency = trackingConfig.currency;
  const eventId = newEventId(fbName.toLowerCase());
  const firstItem = items[0];

  const ga4Payload = enrich({
    currency,
    value,
    items: items.map((i) => ({ ...i, quantity: i.quantity ?? 1 })),
    event_id: eventId,
    product_id: firstItem?.item_id,
    product_name: firstItem?.item_name,
    quantity: firstItem?.quantity ?? 1,
    ...extra,
  });

  if (typeof window === "undefined") return eventId;

  try {
    pushDataLayer({ ecommerce: null });
    pushDataLayer({ event: gaName, ecommerce: ga4Payload });
    window.gtag?.("event", gaName, ga4Payload);

    const fbPayload = enrich({
      currency,
      value,
      content_type: "product",
      content_ids: items.map((i) => i.item_id),
      content_name: firstItem?.item_name,
      contents: items.map((i) => ({
        id: i.item_id,
        quantity: i.quantity ?? 1,
        item_price: i.price,
      })),
      ...extra,
    });
    window.fbq?.("track", fbName, fbPayload, { eventID: eventId });
    sendCapi(fbName, eventId, fbPayload);
    debugLog(fbName, fbPayload);
  } catch (e) {
    if (trackingConfig.debug) console.warn("trackEcommerce failed", fbName, e);
  }
  return eventId;
}

/* ------------------------- Convenience wrappers --------------------------- */

export const trackPageView = (extra: Params = {}) =>
  trackEvent("PageView", { source: "spa", ...extra });

export const trackViewContent = (item: EcomItem) =>
  trackEcommerce("view_item", "ViewContent", { value: item.price, items: [item] });

export const trackAddToCart = (item: EcomItem) =>
  trackEcommerce("add_to_cart", "AddToCart", { value: item.price, items: [item] });

export const trackBeginCheckout = (item: EcomItem) =>
  trackEcommerce("begin_checkout", "InitiateCheckout", {
    value: item.price,
    items: [item],
  });

/** Alias kept for symmetry with Meta naming (InitiateCheckout). */
export const trackInitiateCheckout = trackBeginCheckout;

/**
 * Meta "Lead" event — fire when the user has provided enough info to be
 * considered a qualified lead (e.g. name + valid BD phone). Sends full
 * commerce parameters so Meta can attribute lead → purchase later.
 */
export const trackLead = (item: EcomItem, extra: Params = {}) =>
  trackEcommerce("generate_lead", "Lead", {
    value: item.price,
    items: [item],
    extra,
  });

export const trackPurchase = (
  transactionId: string,
  item: EcomItem,
  extra: Params = {},
) =>
  trackEcommerce("purchase", "Purchase", {
    value: item.price,
    items: [item],
    extra: { transaction_id: transactionId, ...extra },
  });

/** CTA / contact click tracker (WhatsApp, Call, generic CTAs). */
export const trackContact = (channel: "whatsapp" | "call" | "cta", extra: Params = {}) =>
  trackEvent("Contact", { channel, ...extra });

/** Convenience helpers for the new event types. */
export const trackScrollDepth = (depth: number) =>
  trackEvent("ScrollDepth", { depth, percent: depth });

export const trackProductImageView = (extra: Params = {}) =>
  trackEvent("ProductImageView", extra);

export const trackProductDetailExpand = (extra: Params = {}) =>
  trackEvent("ProductDetailExpand", extra);

export const trackOrderFormOpen = (extra: Params = {}) =>
  trackEvent("OrderFormOpen", extra);

export const trackProductSelected = (item: EcomItem) =>
  trackEvent("ProductSelected", {
    product_id: item.item_id,
    product_name: item.item_name,
    value: item.price,
    quantity: item.quantity ?? 1,
    currency: trackingConfig.currency,
  });

export const trackQuantityChange = (item: EcomItem, prevQty: number) =>
  trackEvent("QuantityChange", {
    product_id: item.item_id,
    quantity: item.quantity ?? 1,
    previous_quantity: prevQty,
    value: item.price,
  });

export const trackCustomerInfoFilled = (extra: Params = {}) =>
  trackEvent("CustomerInfoFilled", extra);

export const trackDeliveryInfoFilled = (extra: Params = {}) =>
  trackEvent("DeliveryInfoFilled", extra);

export const trackFormSubmitAttempt = (extra: Params = {}) =>
  trackEvent("FormSubmitAttempt", extra);

export const trackOrderValidationError = (field: string, message: string) =>
  trackEvent("OrderValidationError", { field, message });
