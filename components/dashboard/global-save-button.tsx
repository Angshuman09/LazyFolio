"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  useSaveStore,
  getGlobalButtonLabel,
  selectIsAnyDirty,
  selectIsAnySaving,
} from "@/lib/utils/save-store";
import { saveAllSections } from "@/lib/utils/save-registry";

export default function GlobalSaveButton({
  disabled,
}: {
  disabled?: boolean;
}) {
  const isAnyDirty = useSaveStore(selectIsAnyDirty);
  const isAnySaving = useSaveStore(selectIsAnySaving);
  const globalStatus = useSaveStore((s) => s.globalStatus);
  const label = useSaveStore(getGlobalButtonLabel);
  const isSaved = globalStatus === "saved";
  const isSaving = globalStatus === "saving" || isAnySaving;
  const isIdle = !isAnyDirty && !isSaving && !isSaved;

  const handleSaveAll = useCallback(async () => {
    const state = useSaveStore.getState();
    if (state.savingItems.size > 0) return;

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

  const isButtonDisabled = disabled || isIdle || isSaving || isSaved;

  return (
    <motion.button
      type="button"
      disabled={isButtonDisabled}
      onClick={handleSaveAll}
      className={`
        inline-flex items-center gap-1.5 px-5 md:px-4.5 h-8.5 rounded-full
        text-[0.78rem] font-semibold border-none transition-all duration-200
        font-sans-body whitespace-nowrap cursor-pointer
        disabled:cursor-not-allowed
        ${
          isSaved
            ? "bg-emerald-600 text-white opacity-100"
            : isIdle
              ? "bg-(--lf-ink)/40 text-(--lf-bg) opacity-55"
              : "bg-(--lf-ink) text-(--lf-bg) hover:opacity-82"
        }
        ${isButtonDisabled && !isSaved ? "opacity-55" : ""}
      `}
      whileTap={!isButtonDisabled ? { scale: 0.97 } : undefined}
      layout
      title={
        isSaving
          ? "Saving your changes…"
          : isAnyDirty
            ? "⌘S to save current tab · ⌘⇧S to save all"
            : "All changes saved"
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-1.5"
        >
          {isSaving && (
            <svg
              className="animate-spin"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
          {isSaved && <Check size={13} strokeWidth={2.5} />}
          {isIdle && <Check size={12} strokeWidth={2} className="opacity-60" />}
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">
            {isSaving ? "Saving" : isSaved ? "Saved" : isIdle ? "Saved" : "Save"}
          </span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
