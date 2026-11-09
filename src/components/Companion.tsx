import { useEffect, useRef, useState } from "react";
import { clickQuips, reactions, sections, spriteSizes, walkCycle, type PoseName } from "@/data/content";
import { companion, idleFor, SLEEP_AFTER_MS } from "@/lib/companion";

const SCALE = 180 / spriteSizes.idle.h;

/**
 * Small-screen version of the character: a fixed sprite in the bottom corner that
 * changes pose with the active section. On large screens he lives in the 3D scene.
 */
export function Companion({ section }: { section: number }) {
  const def = sections[section];
  const [mode, setMode] = useState<"walking" | "posed" | "dancing">("posed");
  const [override, setOverride] = useState<PoseName | null>(null);
  const [frame, setFrame] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const taps = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Stroll on the spot briefly whenever the section changes.
  useEffect(() => {
    clear();
    setOverride(null);
    setMode("walking");
    setBubble(def.quip);
    later(() => setMode("posed"), 900);
    later(() => setBubble(null), 4800);
    return clear;
  }, [def.quip]);

  useEffect(() => {
    if (mode !== "walking") return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % walkCycle.length), 120);
    return () => window.clearInterval(id);
  }, [mode]);

  // Page-triggered reactions and dozing off when the visitor goes quiet.
  useEffect(
    () =>
      companion.on((r) => {
        clear();
        if (r.pose) setOverride(r.pose);
        if (r.quip) setBubble(r.quip);
        later(() => {
          setOverride(null);
          setBubble(null);
        }, r.ms ?? 3000);
      }),
    [],
  );
  useEffect(() => {
    const id = window.setInterval(() => {
      setOverride((cur) => {
        const quiet = idleFor() > SLEEP_AFTER_MS;
        if (quiet && cur === null) {
          setBubble(reactions.asleep);
          return "sleep";
        }
        if (!quiet && cur === "sleep") {
          setBubble(null);
          return null;
        }
        return cur;
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  const onTap = () => {
    clear();
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      setMode("posed");
      setOverride("facepalm");
      setBubble(reactions.tooManyClicks);
      later(() => {
        setOverride(null);
        setBubble(null);
      }, 2800);
      return;
    }
    setOverride(null);
    setMode("dancing");
    setBubble(clickQuips[Math.floor(Math.random() * clickQuips.length)]);
    later(() => setMode("posed"), 2400);
    later(() => setBubble(null), 3400);
  };

  const pose: PoseName =
    mode === "walking" ? walkCycle[frame] : mode === "dancing" ? "dance" : (override ?? def.pose);
  const size = spriteSizes[pose];

  return (
    <div className={`companion is-${mode} fixed bottom-2 right-2 z-20 lg:hidden`}>
      <div className={`speech-bubble is-dom ${bubble ? "is-open" : ""}`} aria-live="polite">
        {bubble ?? ""}
      </div>
      <button type="button" onClick={onTap} aria-label="Make Anesu dance" className="flex h-[184px] items-end justify-center">
        <img
          src={`/ava/${pose}.webp`}
          alt=""
          width={Math.round(size.w * SCALE)}
          height={Math.round(size.h * SCALE)}
          style={{ width: size.w * SCALE, height: size.h * SCALE }}
          draggable={false}
        />
      </button>
    </div>
  );
}
