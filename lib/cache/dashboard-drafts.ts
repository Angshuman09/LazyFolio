"use client";

export type DashboardDraftSection = "links" | "blogs" | "experience" | "profile" | "skills" | "projects";

export function getDashboardDraftKey(
  section: DashboardDraftSection,
  profileId?: string,
) {
  return profileId ? `lazyfolio.dashboard.${profileId}.${section}.draft` : null;
}

export function readDashboardDraft<T>(
  section: DashboardDraftSection,
  profileId?: string,
) {
  const key = getDashboardDraftKey(section, profileId);

  if (!key || typeof window === "undefined") {
    return null;
  }

  try {
    const rawDraft = window.sessionStorage.getItem(key);
    return rawDraft ? (JSON.parse(rawDraft) as T) : null;
  } catch {
    return null;
  }
}

export function writeDashboardDraft(
  section: DashboardDraftSection,
  profileId: string | undefined,
  value: unknown,
) {
  const key = getDashboardDraftKey(section, profileId);

  if (!key || typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function clearDashboardDraft(
  section: DashboardDraftSection,
  profileId?: string,
) {
  const key = getDashboardDraftKey(section, profileId);

  if (!key || typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(key);
}
