// The "limelight" cursor effects, all driven by a single mousemove handler:
//   1. a large radial glow that follows the pointer,
//   2. a second copy of the headline ("the lit layer") revealed through a mask
//      centered on the cursor, so the title appears spotlit, and
//   3. magnetic link buttons — the nearest button within range eases toward the
//      cursor (only one at a time, so two neighbors can't both grab it).
//
// Reads/writes are batched into a requestAnimationFrame callback to stay smooth.

/** Max distance (px) from a button's center for it to become magnetic. */
const MAGNET_RANGE = 170;
/** How strongly a magnetic button follows the cursor (fraction of the offset). */
const MAGNET_PULL_X = 0.24;
const MAGNET_PULL_Y = 0.3;

export function initLimelight(stage: HTMLElement): void {
  const title = stage.querySelector<HTMLElement>(".spot-title");
  const glow = stage.querySelector<HTMLElement>(".glow");
  const magnets = Array.from(stage.querySelectorAll<HTMLElement>("[data-mag]"));

  let rafId = 0;
  let cursorX = 0;
  let cursorY = 0;

  const render = () => {
    rafId = 0;
    moveGlow();
    lightHeadline();
    pullNearestMagnet();
  };

  const moveGlow = () => {
    if (glow) glow.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  };

  const lightHeadline = () => {
    if (!title) return;
    const rect = title.getBoundingClientRect();
    // Position the reveal mask relative to the title's own box.
    title.style.setProperty("--tx", `${cursorX - rect.left}px`);
    title.style.setProperty("--ty", `${cursorY - rect.top}px`);
  };

  const pullNearestMagnet = () => {
    // Measure every button's offset from the cursor, find the closest, then move
    // only that one if it's within range; reset the rest.
    const offsets = magnets.map((el) => {
      const rect = el.getBoundingClientRect();
      const dx = cursorX - (rect.left + rect.width / 2);
      const dy = cursorY - (rect.top + rect.height / 2);
      return { el, dx, dy, dist: Math.hypot(dx, dy) };
    });

    const nearest = offsets.reduce<(typeof offsets)[number] | null>(
      (closest, cur) => (closest === null || cur.dist < closest.dist ? cur : closest),
      null,
    );

    for (const { el, dx, dy } of offsets) {
      if (el === nearest?.el && nearest.dist < MAGNET_RANGE) {
        el.style.transform = `translate(${dx * MAGNET_PULL_X}px, ${dy * MAGNET_PULL_Y}px)`;
      } else {
        el.style.transform = "";
      }
    }
  };

  window.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(render);
  });
}
