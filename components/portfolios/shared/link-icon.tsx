"use client";

// ─── Link Icon Resolver ───────────────────────────────────────────────────────
// Returns the correct React icon element for a given link label + href.
// Shared by all portfolio templates.

import type { ReactNode } from "react";
import {
  BookOpen,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import { getDomain } from "./utils";

/**
 * Returns a React icon node for a link based on its label and href.
 *
 * @param label       - The display label of the link
 * @param href        - The full URL / mailto / tel href
 * @param iconSize    - Size in px (default 14)
 * @param strokeWidth - Lucide stroke width (default 1.8)
 */
export function getLinkIcon(
  label: string,
  href: string,
  iconSize = 14,
  strokeWidth = 1.8,
): ReactNode {
  const domain = getDomain(href);
  const lowerLabel = label.toLowerCase();
  const lowerDomain = domain.toLowerCase();
  const iconProps = { size: iconSize, strokeWidth };

  if (lowerDomain.includes("github") || lowerLabel === "github") {
    return <Github {...iconProps} />;
  }

  if (
    lowerDomain.includes("x.com") ||
    lowerDomain.includes("twitter") ||
    lowerLabel === "x" ||
    lowerLabel === "twitter"
  ) {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (lowerDomain.includes("linkedin") || lowerLabel === "linkedin") {
    return <Linkedin {...iconProps} />;
  }

  if (lowerDomain.includes("instagram") || lowerLabel === "instagram") {
    return <Instagram {...iconProps} />;
  }

  if (
    lowerDomain.includes("youtube") ||
    lowerDomain.includes("youtu.be") ||
    lowerLabel === "youtube"
  ) {
    return <Youtube {...iconProps} />;
  }

  if (lowerDomain.includes("medium") || lowerLabel === "medium") {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  }

  if (lowerDomain.includes("leetcode") || lowerLabel === "leetcode") {
    return <Code2 {...iconProps} />;
  }

  if (
    lowerDomain.includes("dev.to") ||
    lowerLabel === "dev.to" ||
    lowerLabel === "dev"
  ) {
    return <BookOpen {...iconProps} />;
  }

  if (
    href.startsWith("mailto:") ||
    lowerLabel === "mail" ||
    lowerLabel === "email"
  ) {
    return <Mail {...iconProps} />;
  }

  if (href.startsWith("tel:") || lowerLabel === "phone") {
    return <Phone {...iconProps} />;
  }

  if (lowerLabel === "resume" || lowerLabel === "cv") {
    return <FileText {...iconProps} />;
  }

  return <Globe {...iconProps} />;
}
