// Single source of truth for the site's content. Components and the React
// islands all read from here, so updating a project or link is a one-line edit.

export interface SiteLink {
  /** Display name, e.g. "GitHub". */
  label: string;
  /** Secondary mono-spaced label, e.g. the handle or "PDF". */
  handle: string;
  href: string;
}

export interface Project {
  name: string;
  desc: string;
  tags: string[];
  href: string;
  /** Optional pill shown next to the title, e.g. "In progress". */
  status: string | null;
  /** Caption shown on the placeholder screenshot. */
  shot: string;
}

export interface Site {
  links: SiteLink[];
  projects: Project[];
}

export const site: Site = {
  links: [
    { label: "GitHub", handle: "daniel-curry", href: "https://github.com/daniel-curry" },
    { label: "LinkedIn", handle: "danielcurry1", href: "https://linkedin.com/in/danielcurry1" },
    { label: "Email", handle: "daniel@daniel-curry.com", href: "mailto:daniel@daniel-curry.com" },
    { label: "Résumé", handle: "PDF", href: "#" },
  ],
  projects: [
    {
      name: "Scout",
      desc: "A keyboard-driven app launcher for Linux, written in Rust with GTK3. Results appear the moment you start typing. I've been using it as my daily driver since the day I built it.",
      tags: ["Rust", "GTK3", "Linux"],
      href: "https://github.com/daniel-curry/scout",
      status: null,
      shot: "Scout launcher UI",
    },
    {
      name: "Pulse",
      desc: "A Spotify web frontend built in TypeScript and React. I'm using it to learn modern React patterns and the Spotify Web API. The core is wired up with more on the way.",
      tags: ["TypeScript", "React"],
      href: "https://github.com/daniel-curry/pulse",
      status: "In progress",
      shot: "Pulse player UI",
    },
    {
      name: "Dotfiles",
      desc: "My Linux dotfiles for Hyprland, Neovim, Kitty, and the rest of the essentials. Version-controlled and reproducible, so a fresh machine is one script away from home.",
      tags: ["Hyprland", "Neovim", "Shell"],
      href: "https://github.com/daniel-curry/dotfiles",
      status: null,
      shot: "Hyprland desktop",
    },
  ],
};
