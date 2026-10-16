"use client";

import { useEffect } from "react";

export function PortfolioTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    if (!profileId) return;

    // Fire and forget pageview tracking in the background
    try {
      fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [profileId]);

  return null;
}
