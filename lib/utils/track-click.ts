export function trackClick(profileId: string | undefined, label: string) {
    if (!profileId) return;
    try {
      navigator.sendBeacon(
        "/api/track-click",
        new Blob([JSON.stringify({ profileId, label })], { type: "application/json" })
      );
    } catch {
      // tracking failures shouldn't block navigation
    }
  }