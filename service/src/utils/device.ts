export function getDeviceType(userAgent: string | undefined | null): "mobile" | "tablet" | "desktop" {
    if (!userAgent) return "desktop";
    const ua = userAgent.toLowerCase();
    if (/ipad|tablet|playbook|silk/.test(ua) && !ua.includes("mobile")) return "tablet";
    if (/mobile|iphone|ipod|blackberry|windows phone|android/.test(ua)) return "mobile";
    return "desktop";
  }