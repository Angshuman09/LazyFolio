"use client";

import { createContext, useContext } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useGetUserProfile } from "@/hooks/profile";
import { useGetSubscription } from "@/hooks/subscription";
import { useDashboardSubmits } from "@/hooks/use-dashboard-submits";
import type { Tab } from "@/components/resources/extras";
import type { PortfolioSection } from "@/components/portfolios/shared/types";

type SessionData = ReturnType<typeof authClient.useSession>["data"];
type ProfileData = ReturnType<typeof useGetUserProfile>["data"];
type SubscriptionData = ReturnType<typeof useGetSubscription>["data"];

type DashboardSubmits = Pick<
  ReturnType<typeof useDashboardSubmits>,
  | "onProfileSubmit"
  | "onLinksSubmit"
  | "onExperienceSubmit"
  | "onSubmitProjects"
  | "onSubmitSkills"
  | "onSubmitBlogs"
>;

/**
 * State shared between the dashboard shell (header, sidebar, modals - rendered
 * by the segment layout) and the content column (the page + its loading
 * fallback). Keeping it here means the chrome and the content always agree on
 * the active tab, the loaded profile and the preview state, no matter which of
 * the two is on screen.
 */
export interface DashboardShellValue {
  /** better-auth session (`null` while it is still resolving). */
  session: SessionData;
  /** True while the session request is in flight. */
  isSessionPending: boolean;
  /** Dashboard profile, `undefined` until the request resolves. */
  profile: ProfileData;
  /** True while the profile request is in flight. */
  isProfileLoading: boolean;
  subData: SubscriptionData;
  isSubLoading: boolean;
  tab: Tab;
  changeTab: (nextTab: Tab) => void;
  previewSection: PortfolioSection;
  setPreviewSection: Dispatch<SetStateAction<PortfolioSection>>;
  isPreviewCollapsed: boolean;
  togglePreview: () => void;
  setSupportMeOpen: Dispatch<SetStateAction<boolean>>;
  /** Fallback handle used before the profile has a username. */
  username: string;
  submits: DashboardSubmits;
}

const DashboardShellContext = createContext<DashboardShellValue | null>(null);

export function DashboardShellProvider({
  value,
  children,
}: {
  value: DashboardShellValue;
  children: ReactNode;
}) {
  return (
    <DashboardShellContext.Provider value={value}>
      {children}
    </DashboardShellContext.Provider>
  );
}

export function useDashboardShell(): DashboardShellValue {
  const value = useContext(DashboardShellContext);
  if (!value) {
    throw new Error(
      "useDashboardShell must be used inside <DashboardShellProvider>",
    );
  }
  return value;
}
