import type { PoseName } from "@/data/content";

export interface Reaction {
  pose?: PoseName;
  quip?: string;
  /** How long the pose is held, in ms. */
  ms?: number;
}

type Listener = (r: Reaction) => void;
const listeners = new Set<Listener>();

/** Tiny event bus so page content can make the character react. */
export const companion = {
  react(r: Reaction) {
    listeners.forEach((l) => l(r));
  },
  on(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

/** Milliseconds since the visitor last moved, scrolled, typed or tapped. */
let lastInput = typeof performance !== "undefined" ? performance.now() : 0;
if (typeof window !== "undefined") {
  const touch = () => {
    lastInput = performance.now();
  };
  ["pointermove", "pointerdown", "scroll", "keydown", "touchstart", "wheel"].forEach((e) =>
    window.addEventListener(e, touch, { passive: true }),
  );
}
export const idleFor = () => performance.now() - lastInput;
export const SLEEP_AFTER_MS = 40_000;
