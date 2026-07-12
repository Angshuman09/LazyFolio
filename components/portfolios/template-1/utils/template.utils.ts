import { DateLike, KnownLinkMetadata, NormalizedLink, ProfileData } from "../types/template.types";

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

  
export const statusStyle: Record<string, string> = {
    Live: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
    WIP: "text-amber-400 bg-amber-400/8 border-amber-400/20",
    "Open Source": "text-sky-400 bg-sky-400/8 border-sky-400/20",
  };
  
export const fallbackStatusStyle = "text-zinc-400 bg-zinc-400/8 border-zinc-400/20";
  
export function textValue(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
  }
  
export function cleanUrl(value?: string | null) {
    const url = textValue(value);
  
    if (!url) {
      return "";
    }
  
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
  
export function shouldOpenInNewTab(href?: string) {
    return !!href && /^https?:\/\//i.test(href);
  }
  
export function getDomain(href?: string) {
    if (!href) {
      return "";
    }
  
    if (href.startsWith("mailto:")) {
      return "email";
    }
  
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }
  
export function domainToLabel(domain: string) {
    const firstPart = domain.replace(/^www\./, "").split(".")[0] || "Link";
    return firstPart
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  
export function findKnownLink(type?: string, label?: string, href?: string) {
    const normalizedType = textValue(type).toUpperCase();
    const normalizedLabel = textValue(label).toLowerCase();
    const domain = getDomain(href);
  
    return KNOWN_LINKS.find((item) => {
      const typeMatches = item.type === normalizedType;
      const labelMatches = item.labels.some((itemLabel) =>
        normalizedLabel.includes(itemLabel),
      );
      const domainMatches = item.domains.some(
        (itemDomain) => domain === itemDomain || domain.endsWith(`.${itemDomain}`),
      );
  
      return typeMatches || labelMatches || domainMatches;
    });
  }
  
export function addProfileContactLinks(links: NormalizedLink[], profile?: ProfileData) {
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
      contactLinks.push({
        id: "profile-resume",
        label: "Resume",
        href: resume,
      });
    }
  
    return contactLinks;
  }
  
export function formatDate(value: DateLike) {
    if (!value) {
      return "";
    }
  
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
  
export function formatDateRange(startdate: DateLike, enddate: DateLike) {
    const start = formatDate(startdate);
  
    if (!start && !enddate) {
      return "";
    }
  
    const end = enddate ? formatDate(enddate) : "Present";
  
    if (start && end) {
      return `${start} - ${end}`;
    }
  
    return start || end;
  }
  
export function splitDescription(description?: string | null) {
    return textValue(description)
      .split(/\n|•/)
      .map((item) => item.replace(/^[-–]\s*/, "").trim())
      .filter(Boolean);
  }
  
  
export function getBookCallLink(profile?: ProfileData) {
    return cleanUrl(profile?.bookAcall);
  }
  