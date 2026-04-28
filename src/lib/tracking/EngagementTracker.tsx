/**
 * Auto-fires PageView (with full enrichment) once per route, plus
 * ScrollDepth events at configured thresholds (default 25/50/75/90).
 * Mount once at the root, after TrackingScripts.
 */
import { useEffect } from "react";
import { trackingConfig } from "@/config/trackingConfig";
import { getSession, trackPageView, trackScrollDepth } from "@/lib/tracking/events";

export function EngagementTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Bootstrap session (captures UTMs, fbp/fbc, UA, etc.)
    getSession();

    // Defer PageView one tick so GTM/Pixel scripts have time to load
    const pvTimer = window.setTimeout(() => {
      trackPageView({ path: window.location.pathname });
    }, 250);

    // Scroll depth tracking
    const fired = new Set<number>();
    const thresholds = [...trackingConfig.scrollDepths].sort((a, b) => a - b);
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) {
          ticking = false;
          return;
        }
        const pct = Math.min(100, Math.round((scrollTop / max) * 100));
        for (const t of thresholds) {
          if (pct >= t && !fired.has(t)) {
            fired.add(t);
            trackScrollDepth(t);
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(pvTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
