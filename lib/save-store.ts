import { create } from "zustand";

export type DashboardSection =
  | "profile"
  | "links"
  | "experience"
  | "projects"
  | "skills"
  | "blogs";

export const SECTION_LABELS: Record<DashboardSection, string> = {
  profile: "Profile",
  links: "Links",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  blogs: "Blogs",
};

interface SaveState {
  /** Which sections have unsaved changes */
  dirtyItems: Set<DashboardSection>;
  /** Which sections are currently saving */
  savingItems: Set<DashboardSection>;
  /** Per-section error messages */
  errors: Map<DashboardSection, string>;
  /** Global save lifecycle status */
  globalStatus: "idle" | "saving" | "saved" | "error";

  // ── Dirty tracking ─────────────────────────────────────────
  markDirty: (section: DashboardSection) => void;
  markClean: (section: DashboardSection) => void;

  // ── Save lifecycle ─────────────────────────────────────────
  startSaving: (section: DashboardSection) => void;
  finishSaving: (section: DashboardSection) => void;
  failSaving: (section: DashboardSection, error: string) => void;
  clearError: (section: DashboardSection) => void;

  // ── Global save ────────────────────────────────────────────
  startGlobalSave: () => void;
  finishGlobalSave: () => void;
  failGlobalSave: () => void;

  // ── Helpers (plain getters — derive in component via selectors) ─
  reset: () => void;
}

/** Timer id for the "saved" → "idle" auto-transition */
let savedTimerId: ReturnType<typeof setTimeout> | null = null;

export const useSaveStore = create<SaveState>((set, get) => ({
  dirtyItems: new Set(),
  savingItems: new Set(),
  errors: new Map(),
  globalStatus: "idle",

  // ── Dirty ──────────────────────────────────────────────────
  markDirty: (section) =>
    set((s) => {
      if (s.dirtyItems.has(section)) return s;
      const next = new Set(s.dirtyItems);
      next.add(section);
      return { dirtyItems: next };
    }),

  markClean: (section) =>
    set((s) => {
      if (!s.dirtyItems.has(section)) return s;
      const next = new Set(s.dirtyItems);
      next.delete(section);
      // Also clear any error for this section
      const errs = new Map(s.errors);
      errs.delete(section);
      return { dirtyItems: next, errors: errs };
    }),

  // ── Saving ─────────────────────────────────────────────────
  startSaving: (section) =>
    set((s) => {
      const next = new Set(s.savingItems);
      next.add(section);
      // Clear previous error
      const errs = new Map(s.errors);
      errs.delete(section);
      return { savingItems: next, errors: errs };
    }),

  finishSaving: (section) =>
    set((s) => {
      const saving = new Set(s.savingItems);
      saving.delete(section);
      const dirty = new Set(s.dirtyItems);
      dirty.delete(section);
      const errs = new Map(s.errors);
      errs.delete(section);
      return { savingItems: saving, dirtyItems: dirty, errors: errs };
    }),

  failSaving: (section, error) =>
    set((s) => {
      const saving = new Set(s.savingItems);
      saving.delete(section);
      const errs = new Map(s.errors);
      errs.set(section, error);
      return { savingItems: saving, errors: errs };
    }),

  clearError: (section) =>
    set((s) => {
      if (!s.errors.has(section)) return s;
      const errs = new Map(s.errors);
      errs.delete(section);
      return { errors: errs };
    }),

  // ── Global ─────────────────────────────────────────────────
  startGlobalSave: () => {
    if (savedTimerId) {
      clearTimeout(savedTimerId);
      savedTimerId = null;
    }
    set({ globalStatus: "saving" });
  },

  finishGlobalSave: () => {
    if (savedTimerId) clearTimeout(savedTimerId);
    set({ globalStatus: "saved" });
    savedTimerId = setTimeout(() => {
      set({ globalStatus: "idle" });
      savedTimerId = null;
    }, 2000);
  },

  failGlobalSave: () => {
    set({ globalStatus: "error" });
  },

  reset: () => {
    if (savedTimerId) {
      clearTimeout(savedTimerId);
      savedTimerId = null;
    }
    set({
      dirtyItems: new Set(),
      savingItems: new Set(),
      errors: new Map(),
      globalStatus: "idle",
    });
  },
}));

// ── Selector helpers (use outside of React or as selectors) ──
export const selectDirtyCount = (s: SaveState) => s.dirtyItems.size;
export const selectIsAnyDirty = (s: SaveState) => s.dirtyItems.size > 0;
export const selectIsAnySaving = (s: SaveState) => s.savingItems.size > 0;
export const selectIsSectionDirty = (section: DashboardSection) => (s: SaveState) =>
  s.dirtyItems.has(section);
export const selectIsSectionSaving = (section: DashboardSection) => (s: SaveState) =>
  s.savingItems.has(section);
export const selectSectionError = (section: DashboardSection) => (s: SaveState) =>
  s.errors.get(section);
export const selectDirtySections = (s: SaveState) => Array.from(s.dirtyItems);

/**
 * Derive the dynamic button label.
 * - No dirty items → "All saved"
 * - 1 dirty item  → "Save {section label}"
 * - N dirty items → "Save all (N)"
 * - Saving        → "Saving…"
 * - Just saved    → "Saved ✓"
 */
export function getGlobalButtonLabel(state: SaveState): string {
  if (state.globalStatus === "saving" || state.savingItems.size > 0) {
    return "Saving…";
  }
  if (state.globalStatus === "saved") {
    return "Saved ✓";
  }
  const count = state.dirtyItems.size;
  if (count === 0) return "All saved";
  if (count === 1) {
    const section = Array.from(state.dirtyItems)[0];
    return `Save ${SECTION_LABELS[section].toLowerCase()}`;
  }
  return `Save all (${count})`;
}
