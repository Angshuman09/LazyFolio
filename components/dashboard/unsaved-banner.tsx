"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow"
import {
  useSaveStore,
  selectIsAnyDirty,
  selectDirtySections,
  SECTION_LABELS,
} from "@/lib/save-store";
import { saveAllSections } from "@/lib/save-registry";
import { useCallback } from "react";

export default function UnsavedBanner() {
  const isAnyDirty = useSaveStore(selectIsAnyDirty);
  const dirtySections = useSaveStore(useShallow(selectDirtySections));
  const isAnySaving = useSaveStore((s) => s.savingItems.size > 0);
  const hasErrors = useSaveStore((s) => s.errors.size > 0);

  const handleSaveAll = useCallback(async () => {
    const state = useSaveStore.getState();
    if (state.savingItems.size > 0) return;

    const sections = Array.from(state.dirtyItems);
    if (sections.length === 0) return;

    state.startGlobalSave();
    const { failed } = await saveAllSections(sections);
    if (failed.length > 0) {
      state.failGlobalSave();
    } else {
      state.finishGlobalSave();
    }
  }, []);

  return (
    <AnimatePresence>
      {isAnyDirty && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden z-30"
        >
          <div
            className={`flex items-center gap-3 px-4 md:px-6 py-2 text-[0.75rem] border-b transition-colors duration-200 ${
              hasErrors
                ? "bg-red-500/8 border-red-500/20 text-red-600 dark:text-red-400"
                : "bg-amber-500/8 border-amber-500/20 text-amber-700 dark:text-amber-400"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                hasErrors
                  ? "bg-red-500"
                  : "bg-amber-500 animate-pulse"
              }`}
            />

            <div className="flex-1 min-w-0 font-medium">
              {hasErrors ? (
                <span className="inline-flex items-center gap-1">
                  <AlertCircle size={12} />
                  Some changes failed to save
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    Unsaved changes in{" "}
                    {dirtySections.map((s) => SECTION_LABELS[s]).join(", ")}
                  </span>
                  <span className="sm:hidden">
                    {dirtySections.length} unsaved{" "}
                    {dirtySections.length === 1 ? "change" : "changes"}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={isAnySaving}
              onClick={handleSaveAll}
              className={`shrink-0 inline-flex items-center gap-1 px-3 h-6.5 rounded-full text-[0.72rem] font-semibold border-none cursor-pointer transition-all duration-150 whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed ${
                hasErrors
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              {isAnySaving
                ? "Saving…"
                : `Save all (${dirtySections.length})`}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
