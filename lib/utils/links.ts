import { LinksSchema } from "@/lib/schemas/links";
import { readDashboardDraft } from "../cache/dashboard-drafts";
import { RefObject } from "react";
import { LinkType } from "@/db/enums";

export type ProfileLink = {
  id?: string | null;
  label?: string | null;
  url?: string | null;
};

export type LinksProfile = {
  id?: string;
  links?: ProfileLink[];
};

export type Props = {
  profile?: LinksProfile;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit: (data: LinksSchema) => void | Promise<void>;
};

export function linksFromProfile(links: ProfileLink[] = []): LinksSchema {
  return {
    links: links.map((link) => ({
      id: link.id || undefined,
      label: link.label || "",
      url: link.url || "",
    })),
  };
}

export function getInitialLinks(profile?: LinksProfile): LinksSchema {
  return (
    readDashboardDraft<LinksSchema>("links", profile?.id) ||
    linksFromProfile(profile?.links || [])
  );
}

export function isValidUrl(value?: string) {
  if (!value?.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function detectType(url: string): LinkType {
  if (url.includes("github.com")) return "GITHUB";
  if (url.includes("instagram.com")) return "INSTAGRAM";
  if (url.includes("x.com") || url.includes("twitter.com")) return "X";
  if (url.includes("linkedin.com")) return "LINKEDIN";
  return "CUSTOM";
}