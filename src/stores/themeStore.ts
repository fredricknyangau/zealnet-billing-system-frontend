import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const updateEffectiveTheme = () => {
        const { theme } = get();
        const effective = theme === "system" ? getSystemTheme() : theme;
        set({ effectiveTheme: effective });

        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (effective === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      };

      return {
        theme: "system",
        effectiveTheme: getSystemTheme(),
        setTheme: (theme) => {
          set({ theme });
          updateEffectiveTheme();
        },
      };
    },
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state && typeof window !== "undefined") {
          const effective =
            state.theme === "system" ? getSystemTheme() : state.theme;
          const root = document.documentElement;
          if (effective === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
          if (state.effectiveTheme !== effective) {
            state.effectiveTheme = effective;
          }
        }
      },
    }
  )
);

// Initialize theme on client side only
if (typeof window !== "undefined") {
  // Apply initial theme
  const applyInitialTheme = () => {
    try {
      const store = useThemeStore.getState();
      const effective =
        store.theme === "system" ? getSystemTheme() : store.theme;
      const root = document.documentElement;
      if (effective === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (error) {
      // Silently fail if store not ready
      console.warn("Theme initialization error:", error);
    }
  };

  // Apply immediately if DOM is ready, otherwise wait
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyInitialTheme);
  } else {
    applyInitialTheme();
  }

  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    try {
      const currentState = useThemeStore.getState();
      if (currentState.theme === "system") {
        currentState.setTheme("system"); // Trigger update
      }
    } catch (error) {
      console.warn("Theme update error:", error);
    }
  });
}
