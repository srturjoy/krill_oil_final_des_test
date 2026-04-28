/**
 * Central tracking config — set IDs here, do NOT hardcode in components.
 * Leave the placeholder values to disable a given platform (init checks for them).
 */
export const trackingConfig = {
  // Google Tag Manager container ID (preferred — loads GA4 + Pixel via GTM if configured)
  gtmId: "GTM-XXXXXXX",
  // Direct GA4 (used if GTM is not configured or as a fallback)
  ga4MeasurementId: "G-XXXXXXX",
  // Meta (Facebook) Pixel ID — used for browser-side Pixel events
  metaPixelId: "YOUR_META_PIXEL_ID",
  // Optional CAPI proxy endpoint (server-side). Same event_id is sent here for dedup.
  // Leave empty "" to disable CAPI dispatch.
  capiEndpoint: "/api/capi",
  // Google Sheets order log endpoint
  googleSheetsEndpoint: "https://script.google.com/macros/s/AKfycbz41sWSo6NY1s5FQfu4I7DnZHOnNGS043mKGJtbBxK5_DPpEOrBIIFP8OZgpZ_M1oSPRA/exec",
  // Default currency for ecommerce events
  currency: "BDT",
  // Enable Meta Pixel Advanced Matching (auto-hashes em/ph by Pixel) — boosts EMQ
  enableAdvancedMatching: true,
  // Scroll depth thresholds in percent
  scrollDepths: [25, 50, 75, 90] as const,
  // Console-log all events for QA when true
  debug: false,
} as const;

/** True when an ID is properly set (i.e. not a placeholder). */
export const isConfigured = (id: string | undefined | null) =>
  !!id && !id.includes("XXXX") && !id.includes("YOUR_");
