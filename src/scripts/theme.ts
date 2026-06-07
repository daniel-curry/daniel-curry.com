// Theme handling shared between the pre-paint inline script (in Base.astro) and
// the ThemeToggle React island. Keeping the DOM-mutation logic here means both
// callers stay in sync and the component itself holds only React state.

export type Theme = "light" | "dark";

const STORAGE_KEY = "dc-theme";

/** Background colors used before the stylesheet's vars are available (pre-paint). */
const FALLBACK_BG: Record<Theme, string> = {
  dark: "oklch(0.18 0.008 80)",
  light: "oklch(0.975 0.006 85)",
};

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** The persisted theme, or "light" if none/invalid. Safe to call before paint. */
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // localStorage can throw (private mode, blocked cookies) — fall through.
  }
  return "light";
}

/**
 * Apply a theme to the page: flip the `data-theme` attribute on the `.stage`
 * element (which drives all the CSS vars), sync the document/body background to
 * match, and persist the choice. Returns nothing — call it for its effects.
 */
export function applyTheme(theme: Theme): void {
  const stage = document.querySelector<HTMLElement>(".stage");
  if (stage) stage.setAttribute("data-theme", theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore persistence failures.
  }

  // Once the stage exists its computed bg is authoritative; otherwise use the
  // pre-paint fallback so the page never flashes the wrong color.
  const bg = stage ? getComputedStyle(stage).backgroundColor : FALLBACK_BG[theme];
  document.body.style.backgroundColor = bg;
  document.documentElement.style.background = bg;
}
