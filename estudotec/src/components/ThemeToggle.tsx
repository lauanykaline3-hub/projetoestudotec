"use client";

import { useTheme } from "@/context/ThemeContext";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 rounded-2xl p-2 text-xs font-semibold transition-all duration-200 border cursor-pointer ${
        isDark
          ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-sm shadow-amber-500/10"
          : "bg-white text-indigo-700 border-gray-200 hover:bg-gray-50 shadow-sm"
      } ${className}`}
      title={isDark ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
      aria-label="Alternar tema de cores"
    >
      <span className="text-base leading-none">
        {isDark ? "☀️" : "🌙"}
      </span>
      {showLabel && (
        <span className="font-medium text-[11px]">
          {isDark ? "Tema Claro" : "Tema Escuro"}
        </span>
      )}
    </button>
  );
}

