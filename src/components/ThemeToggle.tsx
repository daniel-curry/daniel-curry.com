import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, type Theme } from "../scripts/theme";

// A small island: it holds the current theme as React state and drives the rest
// of the page (which lives outside React) through `applyTheme`. The button shows
// the icon for the theme you'd switch *to*.

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export default function ThemeToggle() {
  // Start at "light" so server and first client render agree; the real stored
  // value is read in the mount effect below to avoid a hydration mismatch.
  const [theme, setTheme] = useState<Theme>("light");

  // On mount, adopt the persisted theme.
  useEffect(() => setTheme(getStoredTheme()), []);

  // Whenever the theme changes, push it to the page + storage.
  useEffect(() => applyTheme(theme), [theme]);

  const isDark = theme === "dark";
  const next = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={next}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
