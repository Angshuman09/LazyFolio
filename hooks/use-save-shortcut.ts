"use client";

import { useEffect, useCallback } from "react";
import { useSaveStore, selectIsAnyDirty } from "@/lib/save-store";
import { saveAllSections } from "@/lib/save-registry";
import type { DashboardSection } from "@/lib/save-store";
import type { Tab } from "@/components/resources/extras";
import { getSaveFn } from "@/lib/save-registry";

/**
 * Keyboard shortcut hook for save operations.
 *
 * - ⌘S / Ctrl+S → save the current tab (if dirty and editable)
 * - ⌘⇧S / Ctrl+Shift+S → save all dirty sections
 */
export function useSaveShortcut(activeTab: Tab) {
  const isAnyDirty = useSaveStore(selectIsAnyDirty);

  const handleSaveAll = useCallback(async () => {
    const state = useSaveStore.getState();
    if (state.savingItems.size > 0) return; // Already saving

    const dirtySections = Array.from(state.dirtyItems);
    if (dirtySections.length === 0) return;

    state.startGlobalSave();
    const { failed } = await saveAllSections(dirtySections);
    if (failed.length > 0) {
      state.failGlobalSave();
    } else {
      state.finishGlobalSave();
    }
  }, []);

  const handleSaveCurrentTab = useCallback(async () => {
    const state = useSaveStore.getState();
    const section = activeTab as DashboardSection;

    // Insights tab is not editable
    if (activeTab === "insights") return;

    // Check if this section is dirty
    if (!state.dirtyItems.has(section)) return;

    // Check if already saving
    if (state.savingItems.has(section)) return;

    const saveFn = getSaveFn(section);
    if (saveFn) {
      await saveFn();
    }
  }, [activeTab]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod || e.key.toLowerCase() !== "s") return;

      e.preventDefault();

      if (e.shiftKey) {
        handleSaveAll();
      } else {
        handleSaveCurrentTab();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSaveAll, handleSaveCurrentTab]);

  return { handleSaveAll, isAnyDirty };
}
