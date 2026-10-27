"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { secureGetItem, secureSetItem } from "@/lib/storage-crypto";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "estudotec-tema";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = secureGetItem(THEME_STORAGE_KEY) || localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const nextTheme: Theme = prev === "light" ? "dark" : "light";
      try {
        secureSetItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // ignore
      }
      return nextTheme;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}

