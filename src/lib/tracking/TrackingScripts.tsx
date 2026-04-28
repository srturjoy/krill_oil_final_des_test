/**
 * Injects GTM, GA4, and Meta Pixel scripts on the client.
 * Mount once in __root.tsx. Scripts only inject when the matching ID is configured.
 * Uses lightweight inline script tags for fastest load + no external deps.
 */
import { useEffect } from "react";
import { trackingConfig, isConfigured } from "@/config/trackingConfig";

declare global {
  interface Window {
    __trackingScriptsLoaded?: boolean;
  }
}

function injectInline(id: string, code: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.text = code;
  document.head.appendChild(s);
}

function injectExternal(id: string, src: string, async = true) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = async;
  document.head.appendChild(s);
}

export function TrackingScripts() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__trackingScriptsLoaded) return;
    window.__trackingScriptsLoaded = true;

    // Always init dataLayer so events queued early aren't lost
    window.dataLayer = window.dataLayer || [];

    // ---- Google Tag Manager ----
    if (isConfigured(trackingConfig.gtmId)) {
      injectInline(
        "gtm-init",
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${trackingConfig.gtmId}');`,
      );
    }

    // ---- GA4 (gtag) ----
    if (isConfigured(trackingConfig.ga4MeasurementId)) {
      injectExternal(
        "ga4-src",
        `https://www.googletagmanager.com/gtag/js?id=${trackingConfig.ga4MeasurementId}`,
      );
      injectInline(
        "ga4-init",
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;gtag('js',new Date());gtag('config','${trackingConfig.ga4MeasurementId}',{send_page_view:true});`,
      );
    }

    // ---- Meta Pixel ----
    if (isConfigured(trackingConfig.metaPixelId)) {
      // If we already have hashed identifiers from a previous session, pass them
      // into fbq init so advanced matching is enabled from the very first event.
      let am = "";
      try {
        const stored = JSON.parse(localStorage.getItem("_um") || "{}");
        if (trackingConfig.enableAdvancedMatching && (stored.em || stored.ph)) {
          am = `,${JSON.stringify(stored)}`;
        }
      } catch {
        /* ignore */
      }
      injectInline(
        "fb-pixel-init",
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${trackingConfig.metaPixelId}'${am});fbq('track','PageView');`,
      );
    }
  }, []);

  // Noscript fallback for GTM (helps when JS is disabled)
  if (!isConfigured(trackingConfig.gtmId)) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm"
      />
    </noscript>
  );
}
