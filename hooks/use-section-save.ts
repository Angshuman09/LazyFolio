"use client";

import { useEffect, useRef, useCallback } from "react";
import { DashboardSection, useSaveStore } from "@/lib/save-store";
import { registerSave, unregisterSave, registerDiscard, unregisterDiscard } from "@/lib/save-registry";

interface UseSectionSaveOptions {
  /** react-hook-form's isDirty (or any boolean indicating unsaved changes) */
  isDirty: boolean;
  /**
   * The save function for this section.
   * Must return a Promise that resolves on success and rejects on failure.
   */
  onSave: () => Promise<void>;
  /**
   * Optional discard callback to reset form state when user discards changes.
   */
  onDiscard?: () => void;
}

/**
 * Hook that connects a form section to the global save system.
 *
 * 1. Syncs `isDirty` → `useSaveStore.markDirty / markClean`
 * 2. Registers / unregisters the section's save function in the save registry
 * 3. Returns section-specific save state (isSaving, error, retry)
 */
export function useSectionSave(
  section: DashboardSection,
  { isDirty, onSave, onDiscard }: UseSectionSaveOptions,
) {
  const {
    markDirty,
    markClean,
    startSaving,
    finishSaving,
    failSaving,
    clearError,
  } = useSaveStore();

  const isSaving = useSaveStore((s) => s.savingItems.has(section));
  const error = useSaveStore((s) => s.errors.get(section));

  // Keep onSave and onDiscard in refs so the registries always have latest closures
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const onDiscardRef = useRef(onDiscard);
  onDiscardRef.current = onDiscard;

  // ── Sync dirty state ───────────────────────────────────────
  useEffect(() => {
    if (isDirty) {
      markDirty(section);
    } else {
      markClean(section);
    }
  }, [isDirty, section, markDirty, markClean]);

  // ── Wrapped save with lifecycle management ────────────────
  const executeSave = useCallback(async () => {
    // Prevent duplicate saves
    if (useSaveStore.getState().savingItems.has(section)) return;

    startSaving(section);
    try {
      await onSaveRef.current();
      finishSaving(section);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      failSaving(section, message);
      throw err; // Re-throw so the global save handler can catch it
    }
  }, [section, startSaving, finishSaving, failSaving]);

  // ── Register / unregister in global save registry ─────────
  useEffect(() => {
    registerSave(section, executeSave);
    if (onDiscardRef.current) {
      registerDiscard(section, () => {
        if (onDiscardRef.current) onDiscardRef.current();
      });
    }

    return () => {
      unregisterSave(section);
      unregisterDiscard(section);
    };
  }, [section, executeSave]);

  const retry = useCallback(() => {
    clearError(section);
    executeSave();
  }, [clearError, section, executeSave]);

  return {
    /** Whether this section is currently saving */
    isSaving,
    /** Error message if last save failed, undefined otherwise */
    error,
    /** Retry the save after a failure */
    retry,
    /** Programmatically trigger save for this section */
    save: executeSave,
  };
}

