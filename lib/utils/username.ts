// Canonical username rules. The pattern MUST stay in sync with subdomain
// routing in proxy.ts: a username becomes a public subdomain
// (`<username>.lazyfolio.in`), so it has to be a valid DNS hostname label.
// Lowercase letters, digits, and interior hyphens only; 3-30 chars.
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

// Path segments and subdomains the app reserves for itself. A username can
// never claim one of these, or it would shadow a first-party route.
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "pricing",
  "privacy",
  "stats",
  "templates",
  "terms",
  "www",
]);

export function isValidUsername(username?: string | null): boolean {
  return USERNAME_PATTERN.test((username || "").trim());
}

export function isReservedUsername(username?: string | null): boolean {
  return RESERVED_USERNAMES.has((username || "").trim().toLowerCase());
}
