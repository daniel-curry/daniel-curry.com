// Scroll-reveal: fade `.reveal` elements in as they enter the viewport.
//
// The hidden state is gated behind a `.reveal-on` class added here at runtime, so
// if JS never runs the content stays visible rather than being stuck invisible.

/** How far above the bottom of the viewport an element reveals (0–1 of height). */
const REVEAL_THRESHOLD = 0.9;
/** Cap on the per-element stagger so a long page doesn't accumulate huge delays. */
const MAX_STAGGER_STEPS = 6;
const STAGGER_MS = 55;

export function initReveal(stage: HTMLElement): void {
  stage.classList.add("reveal-on");

  const elements = Array.from(stage.querySelectorAll<HTMLElement>(".reveal"));
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
  });

  const revealVisible = () => {
    const viewportHeight = window.innerHeight;
    for (const el of elements) {
      if (el.classList.contains("in")) continue;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < viewportHeight * REVEAL_THRESHOLD && rect.bottom > 0;
      if (inView) el.classList.add("in");
    }
  };

  // rAF-throttle scroll so we check at most once per frame.
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      revealVisible();
    });
  };

  // Run a few times up front to catch elements already in view on load.
  revealVisible();
  requestAnimationFrame(revealVisible);
  setTimeout(revealVisible, 120);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}
