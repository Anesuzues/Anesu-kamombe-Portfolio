import { useEffect, useRef, useState } from "react";
import { clickQuips, sections, spriteSizes, type PoseName } from "@/data/content";

const SCALE = 0.25;

/**
 * Small-screen version of the character: a fixed sprite in the bottom corner that
 * changes pose with the active section. On large screens he lives in the 3D scene.
 */
export function Companion({ section }: { section: number }) {
  const def = sections[section];
  const [mode, setMode] = useState<"walking" | "posed" | "dancing">("posed");
  const [bubble, setBubble] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    clear();
    setMode("walking");
    setBubble(def.quip);
    later(() => setMode("posed"), 750);
    later(() => setBubble(null), 4800);
    return clear;
  }, [def.quip]);

  const onTap = () => {
    clear();
    setMode("dancing");
    setBubble(clickQuips[Math.floor(Math.random() * clickQuips.length)]);
    later(() => setMode("posed"), 2400);
    later(() => setBubble(null), 3400);
  };

  const pose: PoseName = mode === "walking" ? "walking" : mode === "dancing" ? "dance" : def.pose;
  const size = spriteSizes[pose];

  return (
    <div className={`companion is-${mode} fixed bottom-2 right-2 z-20 lg:hidden`}>
      <div className={`speech-bubble is-dom ${bubble ? "is-open" : ""}`} aria-live="polite">
        {bubble ?? ""}
      </div>
      <button type="button" onClick={onTap} aria-label="Make Anesu dance" className="block">
        <img
          key={pose}
          src={`/ava/${pose}.webp`}
          alt=""
          width={Math.round(size.w * SCALE)}
          height={Math.round(size.h * SCALE)}
          style={{ width: size.w * SCALE, height: size.h * SCALE, transform: pose === "pointing" ? "scaleX(-1)" : undefined }}
          draggable={false}
        />
      </button>
    </div>
  );
}
