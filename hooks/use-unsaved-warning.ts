"use client";

import { useEffect, useCallback, useState } from "react";
import { useSaveStore, selectIsAnyDirty, SECTION_LABELS } from "@/lib/utils/save-store";
import type { DashboardSection } from "@/lib/utils/save-store";
import { discardSection } from "@/lib/utils/save-registry";

/**
 * Hook that manages unsaved changes warnings.
 *
 * 1. Registers a `beforeunload` handler when any section is dirty
 * 2. Provides a tab-switch interception system with a confirmation modal
 */
export function useUnsavedWarning() {
  const isAnyDirty = useSaveStore(selectIsAnyDirty);

  // ── Browser close / refresh warning ────────────────────────
  useEffect(() => {
    if (!isAnyDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isAnyDirty]);

  return { isAnyDirty };
}

/**
 * Hook for tab-switch interception.
 * Returns helpers to manage a confirmation modal when switching tabs
 * while the current tab has unsaved changes.
 */
export function useTabSwitchGuard(
  currentTab: DashboardSection | "insights",
  onSwitch: (tab: string) => void,
  profileId?: string,
) {
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const isDirty = useSaveStore((s) => {
    if (currentTab === "insights") return false;
    return s.dirtyItems.has(currentTab as DashboardSection);
  });

  /** Call this instead of directly switching tabs */
  const requestTabSwitch = useCallback(
    (targetTab: string) => {
      if (targetTab === currentTab) return;

      if (isDirty) {
        setPendingTab(targetTab);
      } else {
        onSwitch(targetTab);
      }
    },
    [currentTab, isDirty, onSwitch],
  );

  /** User chose to discard changes and switch */
  const confirmDiscard = useCallback(() => {
    if (pendingTab) {
      if (currentTab !== "insights") {
        discardSection(currentTab as DashboardSection, profileId);
      }
      onSwitch(pendingTab);
      setPendingTab(null);
    }
  }, [pendingTab, currentTab, profileId, onSwitch]);

  /** User cancelled the switch */
  const cancelSwitch = useCallback(() => {
    setPendingTab(null);
  }, []);

  /** Get a human-readable label for the current dirty section */
  const dirtyLabel =
    currentTab !== "insights"
      ? SECTION_LABELS[currentTab as DashboardSection]
      : "";

  return {
    /** The tab the user wants to switch to (null if no pending switch) */
    pendingTab,
    /** Whether the confirmation modal should be shown */
    showConfirmation: pendingTab !== null,
    /** Call to discard changes and switch */
    confirmDiscard,
    /** Call to cancel the switch */
    cancelSwitch,
    /** Call instead of direct tab switching */
    requestTabSwitch,
    /** Human-readable label of the dirty section */
    dirtyLabel,
  };
}

