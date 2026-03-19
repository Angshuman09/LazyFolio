import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lf-theme", theme);
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Important for SSR: keep this static so server and initial client render match.
  theme: "light",
  setTheme: (theme) => {
    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyThemeToDocument(next);
    set({ theme: next });
  },
}));

