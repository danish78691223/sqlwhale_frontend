"use client";
import { Moon, Sun } from "lucide-react";
type ThemeToggleProps = { theme: "dark" | "light"; onToggle: () => void };
export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return <button type="button" className="sqlwhale-theme-toggle" onClick={onToggle}
    aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    title={isDark ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={!isDark}>
    {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    <span>{isDark ? "Light" : "Dark"}</span>
  </button>;
}