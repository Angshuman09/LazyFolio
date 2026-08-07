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
  dirtyItems: Set<DashboardSection>;
  savingItems: Set<DashboardSection>;
  errors: Map<DashboardSection, string>;

  globalStatus: "idle" | "saving" | "saved" | "error";

  markDirty: (section: DashboardSection) => void;
  markClean: (section: DashboardSection) => void;

  startSaving: (section: DashboardSection) => void;
  finishSaving: (section: DashboardSection) => void;
  failSaving: (section: DashboardSection, error: string) => void;
  clearError: (section: DashboardSection) => void;

  startGlobalSave: () => void;
  finishGlobalSave: () => void;
  failGlobalSave: () => void;

  reset: () => void;
}

let savedTimerId: ReturnType<typeof setTimeout> | null = null;

export const useSaveStore = create<SaveState>((set, get) => ({
  dirtyItems: new Set(),
  savingItems: new Set(),
  errors: new Map(),
  globalStatus: "idle",

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
      const errs = new Map(s.errors);
      errs.delete(section);
      return { dirtyItems: next, errors: errs };
    }),

  startSaving: (section) =>
    set((s) => {
      const next = new Set(s.savingItems);
      next.add(section);
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
