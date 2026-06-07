import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/site";

// Crossfading project carousel. `selected` is what the nav highlights and
// changes instantly; `shown` is the content currently rendered. On a change we
// fade out, swap `shown` after the fade, then fade back in — so the dots/arrows
// feel responsive while the copy and screenshot crossfade.

/** Fade duration — must match the .pj-copy / .pj-shot opacity transition in CSS. */
const FADE_MS = 250;

interface Props {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: Props) {
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending fade if the component unmounts mid-transition.
  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, target));
    if (clamped === selected) return;
    setSelected(clamped);
    setVisible(false);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setShown(clamped);
      setVisible(true);
    }, FADE_MS);
  };

  const project = projects[shown];
  const fade = { opacity: visible ? 1 : 0 };

  return (
    <article className="pj">
      <div className="pj-text">
        <div className="pj-copy" style={fade}>
          <h3>{project.name}</h3>
          {project.status && <span className="status">{project.status}</span>}
          <p>{project.desc}</p>
          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a className="gh" href={project.href}>Read on GitHub →</a>
        </div>

        <div className="pj-nav">
          <div className="car-dots">
            {projects.map((p, i) => (
              <button
                key={p.name}
                className={"car-dot" + (i === selected ? " on" : "")}
                aria-label={`Project ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className="car-controls">
            <button
              className="car-btn"
              aria-label="Previous"
              disabled={selected === 0}
              onClick={() => goTo(selected - 1)}
            >
              ←
            </button>
            <button
              className="car-btn"
              aria-label="Next"
              disabled={selected === projects.length - 1}
              onClick={() => goTo(selected + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="pj-shot" style={fade}>
        <div className="shot">
          <span>{project.shot}</span>
        </div>
      </div>
    </article>
  );
}
