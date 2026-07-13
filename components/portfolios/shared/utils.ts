// ─── Shared Portfolio Utilities ───────────────────────────────────────────────
// Pure helper functions shared across all portfolio templates.

import type { DateLike, KnownLinkMetadata, NormalizedLink, ProfileData } from "./types";

// ─── Known social / platform link registry ────────────────────────────────────

const KNOWN_LINKS: readonly KnownLinkMetadata[] = [
  {
    type: "GITHUB",
    label: "GitHub",
    domains: ["github.com", "github.io"],
    labels: ["github"],
  },
  {
    type: "X",
    label: "X",
    domains: ["x.com", "twitter.com"],
    labels: ["x", "twitter"],
  },
  {
    type: "LINKEDIN",
    label: "LinkedIn",
    domains: ["linkedin.com", "lnkd.in"],
    labels: ["linkedin"],
  },
  {
    type: "INSTAGRAM",
    label: "Instagram",
    domains: ["instagram.com"],
    labels: ["instagram"],
  },
  {
    label: "YouTube",
    domains: ["youtube.com", "youtu.be"],
    labels: ["youtube"],
  },
  {
    label: "Medium",
    domains: ["medium.com"],
    labels: ["medium"],
  },
  {
    label: "Dev.to",
    domains: ["dev.to"],
    labels: ["dev.to", "dev"],
  },
  {
    label: "LeetCode",
    domains: ["leetcode.com"],
    labels: ["leetcode"],
  },
  {
    label: "Dribbble",
    domains: ["dribbble.com"],
    labels: ["dribbble"],
  },
  {
    label: "Behance",
    domains: ["behance.net"],
    labels: ["behance"],
  },
];

// ─── String / URL helpers ─────────────────────────────────────────────────────

/** Returns a trimmed string or empty string for non-string values. */
export function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalises a raw URL string: adds https://, mailto:, etc. as needed. */
export function cleanUrl(value?: string | null): string {
  const url = textValue(value);
  if (!url) return "";

  if (
    url.startsWith("#") ||
    url.startsWith("/") ||
    /^(https?:|mailto:|tel:)/i.test(url)
  ) {
    return url;
  }

  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url)) {
    return `mailto:${url}`;
  }

  return `https://${url}`;
}

/** Returns true if the href should open in a new browser tab. */
export function shouldOpenInNewTab(href?: string): boolean {
  return !!href && /^https?:\/\//i.test(href);
}

/** Extracts the domain from a URL string. */
export function getDomain(href?: string): string {
  if (!href) return "";
  if (href.startsWith("mailto:")) return "email";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Converts a domain string into a human-readable label (e.g. "github.com" → "Github"). */
export function domainToLabel(domain: string): string {
  const firstPart = domain.replace(/^www\./, "").split(".")[0] || "Link";
  return firstPart
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// ─── Known-link lookup ────────────────────────────────────────────────────────

/** Finds a known link entry by type, label, or domain. */
export function findKnownLink(
  type?: string,
  label?: string,
  href?: string,
): KnownLinkMetadata | undefined {
  const normalizedType = textValue(type).toUpperCase();
  const normalizedLabel = textValue(label).toLowerCase();
  const domain = getDomain(href);

  return KNOWN_LINKS.find((item) => {
    const typeMatches = item.type === normalizedType;
    const labelMatches = item.labels.some((itemLabel) =>
      normalizedLabel.includes(itemLabel),
    );
    const domainMatches = item.domains.some(
      (itemDomain) =>
        domain === itemDomain || domain.endsWith(`.${itemDomain}`),
    );
    return typeMatches || labelMatches || domainMatches;
  });
}

// ─── Contact links ────────────────────────────────────────────────────────────

/**
 * Prepends an email link and appends a resume link to the given links array
 * if those values exist on the profile and are not already present.
 */
export function addProfileContactLinks(
  links: NormalizedLink[],
  profile?: ProfileData | null,
): NormalizedLink[] {
  const contactLinks = [...links];
  const email = textValue(profile?.email);
  const resume = cleanUrl(profile?.resume);

  if (
    email &&
    !contactLinks.some(
      (link) => link.href.startsWith("mailto:") || link.label === "Email",
    )
  ) {
    contactLinks.unshift({
      id: "profile-email",
      label: "Email",
      href: `mailto:${email}`,
    });
  }

  if (resume && !contactLinks.some((link) => link.href === resume)) {
    contactLinks.push({ id: "profile-resume", label: "Resume", href: resume });
  }

  return contactLinks;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Formats a date-like value to a short "Mon YYYY" string. */
export function formatDate(value: DateLike): string {
  if (!value) return "";

  if (value instanceof Date || typeof value === "string") {
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return textValue(value);
}

/** Returns a "Start - End" date range string (end defaults to "Present"). */
export function formatDateRange(
  startdate: DateLike,
  enddate: DateLike,
): string {
  const start = formatDate(startdate);
  if (!start && !enddate) return "";
  const end = enddate ? formatDate(enddate) : "Present";
  if (start && end) return `${start} - ${end}`;
  return start || end;
}

/** Splits a description string into individual bullet strings. */
export function splitDescription(description?: string | null): string[] {
  return textValue(description)
    .split(/\n|•/)
    .map((item) => item.replace(/^[-–]\s*/, "").trim())
    .filter(Boolean);
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/** Returns the clean URL for a "book a call" link. */
export function getBookCallLink(profile?: ProfileData): string {
  return cleanUrl(profile?.bookAcall);
}
