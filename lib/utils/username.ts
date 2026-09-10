export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "privacy",
  "stats",
  "templates",
  "terms",
  "www",
]);

export function isReservedUsername(username?: string | null) {
  return RESERVED_USERNAMES.has((username || "").trim().toLowerCase());
}
