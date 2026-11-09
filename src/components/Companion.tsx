import { useEffect, useRef, useState } from "react";
import { clickQuips, reactions, sections, spriteSizes, walkCycle, type PoseName } from "@/data/content";
import { companion, idleFor, SLEEP_AFTER_MS } from "@/lib/companion";

const SCALE = 180 / spriteSizes.idle.h;
/** Width of the box the sprite is centred in. */
const BOX = 120;
/** How far in from the screen edge he stands. */
const EDGE = 58;
const SPEED = 230; // px per second
const STEP = 25; // px travelled per walk frame, matched to the stride

/**
 * Small-screen version of the character. He walks along the bottom of the screen to the
 * side given by the active section, then takes that section's pose. On large screens he
 * lives in the 3D scene instead.
 */
export function Companion({ section }: { section: number }) {
  const def = sections[section];
  const box = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(true);
  const [facingLeft, setFacingLeft] = useState(true);
  const [frame, setFrame] = useState(0);
  const [dancing, setDancing] = useState(false);
  const [override, setOverride] = useState<PoseName | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const pos = useRef<{ x: number | null; dist: number }>({ x: null, dist: 0 });
  const side = useRef(def.side);
  side.current = def.side;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Walk towards the active section's side. Runs for the lifetime of the component.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const place = (x: number) => {
      if (box.current) box.current.style.transform = `translate3d(${x - BOX / 2}px, 0, 0)`;
    };
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const p = pos.current;
      const w = window.innerWidth;
      const target = side.current === "right" ? w - EDGE : EDGE;
      if (p.x === null) p.x = w + BOX; // intro: start off-screen and walk in
      const dx = target - p.x;
      if (Math.abs(dx) > 1) {
        const move = Math.min(Math.abs(dx), SPEED * dt);
        p.x += Math.sign(dx) * move;
        p.dist += move;
        setWalking(true);
        setFacingLeft(dx < 0);
        setFrame(Math.floor(p.dist / STEP) % walkCycle.length);
      } else {
        p.x = target;
        setWalking(false);
      }
      place(p.x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Quip on arrival at each section.
  useEffect(() => {
    clear();
    setOverride(null);
    setDancing(false);
    setBubble(def.quip);
    later(() => setBubble(null), 4800);
    return clear;
  }, [def.quip]);

  // Page-triggered reactions.
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

  // Doze off when the visitor goes quiet.
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
    if (walking) return;
    clear();
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      setDancing(false);
      setOverride("facepalm");
      setBubble(reactions.tooManyClicks);
      later(() => {
        setOverride(null);
        setBubble(null);
      }, 2800);
      return;
    }
    setOverride(null);
    setDancing(true);
    setBubble(clickQuips[Math.floor(Math.random() * clickQuips.length)]);
    later(() => setDancing(false), 2400);
    later(() => setBubble(null), 3400);
  };

  const pose: PoseName = walking ? walkCycle[frame] : dancing ? "dance" : (override ?? def.pose);
  const size = spriteSizes[pose];
  // Walk frames face right; the pointing sprite points to the viewer's left.
  const flip = walking ? facingLeft : pose === "pointing" && def.side === "left";
  const mode = walking ? "walking" : dancing ? "dancing" : "posed";
  // Keep the head centred while the walk frames change width.
  const shift = (0.5 - (size.ax ?? 0.5)) * size.w * SCALE * (flip ? -1 : 1);

  return (
    <div
      ref={box}
      className={`companion is-${mode} pointer-events-none fixed bottom-2 left-0 z-20 lg:hidden`}
      style={{ width: BOX, transform: "translate3d(100vw, 0, 0)" }}
    >
      <div
        className={`speech-bubble is-dom ${def.side === "left" ? "is-left" : ""} ${bubble && !walking ? "is-open" : ""}`}
        aria-live="polite"
      >
        {bubble ?? ""}
      </div>
      <button
        type="button"
        onClick={onTap}
        aria-label="Make Anesu dance"
        className="pointer-events-auto mx-auto flex h-[184px] items-end justify-center"
      >
        <span style={{ transform: `translateX(${shift}px) scaleX(${flip ? -1 : 1})` }} className="block">
          <img
            src={`/ava/${pose}.webp`}
            alt=""
            width={Math.round(size.w * SCALE)}
            height={Math.round(size.h * SCALE)}
            style={{ width: size.w * SCALE, height: size.h * SCALE, maxWidth: "none" }}
            draggable={false}
          />
        </span>
      </button>
    </div>
  );
}
