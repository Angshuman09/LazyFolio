export function trackClick(profileId: string | undefined, label: string) {
    if (!profileId) return;
    try {
      const insightsUrl = process.env.NEXT_PUBLIC_INSIGHTS_SERVICE_URL || "/api/track-click";
      // If calling worker directly from browser (or fallback to local proxy)
      const targetUrl = insightsUrl.startsWith("http")
        ? `${insightsUrl}/api/v1/track`
        : "/api/track-click";
      navigator.sendBeacon(
        targetUrl,
        new Blob(
          [JSON.stringify({ profileId, eventType: "click", label })],
          { type: "application/json" }
        )
      );
    } catch {
      // tracking failures shouldn't block navigation
    }
  }