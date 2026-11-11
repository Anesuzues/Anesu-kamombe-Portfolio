import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clickQuips, reactions, sections, spriteSizes, walkCycle, type PoseName } from "@/data/content";
import { companion, idleFor, SLEEP_AFTER_MS } from "@/lib/companion";

/** World units per sprite pixel: a standing pose is ~3.3 units tall. */
const UNIT = 3.3 / spriteSizes.idle.h;
const WALK_SPEED = 3.2;
/** Distance covered per walk frame, matched to the stride so feet don't slide. */
const STEP = 0.46;
const IDLE_BREAKS: PoseName[] = ["coffee", "water", "stretch", "yawn", "idle", "shrug"];

// Sprites load on demand: the first pose shows as soon as it arrives, the rest stream in behind it.
const textures = new Map<PoseName, THREE.Texture>();
const pending = new Map<PoseName, Promise<THREE.Texture>>();
const loader = new THREE.TextureLoader();
function loadPose(name: PoseName) {
  let p = pending.get(name);
  if (!p) {
    p = loader.loadAsync(`/ava/${name}.webp`).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      textures.set(name, t);
      return t;
    });
    pending.set(name, p);
  }
  return p;
}

function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.8)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

interface Props {
  section: number;
  /** Fixed overlay element the speech bubble is rendered into. */
  portal: React.MutableRefObject<HTMLElement>;
  /** World x the character should stand at for the active section. */
  targetX: number;
  /** Visible width of the stage in world units. */
  stageWidth: number;
  onReady?: () => void;
}

interface Override {
  pose: PoseName;
  until: number;
  dance?: boolean;
}

export function Character({ section, portal, targetX, stageWidth, onReady }: Props) {
  const shadowTex = useShadowTexture();
  const clock = useThree((s) => s.clock);

  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const def = sections[section] ?? sections[0];
  const [pose, setPose] = useState<PoseName>(def.pose);
  const [mirror, setMirror] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  const state = useRef({
    pose: def.pose as PoseName,
    mirror: false,
    walking: false,
    dist: 0,
    pop: 0,
    override: null as Override | null,
    nextBreak: 12,
    started: false,
    asleep: false,
    clicks: [] as number[],
  });

  // First pose first, then the walk cycle, then everything else.
  useEffect(() => {
    let alive = true;
    loadPose(def.pose).then(() => {
      if (!alive) return;
      setReady(true);
      onReady?.();
      const rest = [...walkCycle, ...(Object.keys(spriteSizes) as PoseName[])];
      rest.reduce((chain, name) => chain.then(() => loadPose(name)).then(() => undefined), Promise.resolve());
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bubbleTimer = useRef<number>();
  const say = (text: string | null, ms = 4200) => {
    window.clearTimeout(bubbleTimer.current);
    setBubble(text);
    if (text && ms > 0) bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };
  useEffect(() => () => window.clearTimeout(bubbleTimer.current), []);

  // Quip on arrival at each section.
  useEffect(() => {
    say(def.quip, 5200);
    state.current.override = null;
     
  }, [def.quip]);

  // Reactions triggered by the page (hovering a project card, the CV button, ...).
  useEffect(
    () =>
      companion.on((r) => {
        const s = state.current;
        if (s.walking) return;
        if (r.pose) s.override = { pose: r.pose, until: clock.elapsedTime + (r.ms ?? 2600) / 1000 };
        if (r.quip) say(r.quip, r.ms ?? 3600);
      }),
     
    [clock],
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const apply = (p: PoseName, m: boolean) => {
    const s = state.current;
    if (s.pose !== p && textures.has(p)) {
      const wasWalking = s.pose.startsWith("walk");
      s.pose = p;
      if (!(wasWalking && p.startsWith("walk"))) s.pop = 1;
      setPose(p);
    }
    if (s.mirror !== m) {
      s.mirror = m;
      setMirror(m);
    }
  };

  useFrame(({ clock, pointer }, dt) => {
    const g = group.current;
    const b = body.current;
    if (!g || !b || !ready) return;
    const s = state.current;
    const t = clock.elapsedTime;
    const step = Math.min(dt, 0.05);

    if (!s.started) {
      // Intro: walk in from off-stage.
      g.position.x = Math.sign(targetX || 1) * (stageWidth / 2 + 1.5);
      s.started = true;
    }

    const dx = targetX - g.position.x;
    let bob = 0;
    let lean = 0;

    if (Math.abs(dx) > 0.03) {
      const dir = Math.sign(dx);
      // Movement uses a looser clamp than the animation so slow devices don't walk in slow motion.
      const move = Math.min(Math.abs(dx), WALK_SPEED * Math.min(dt, 0.12));
      g.position.x += dir * move;
      s.dist += move;
      s.walking = true;
      s.asleep = false;
      apply(walkCycle[Math.floor(s.dist / STEP) % walkCycle.length], dir < 0);
    } else {
      if (s.walking) {
        s.walking = false;
        s.nextBreak = t + 9 + Math.random() * 4;
      }
      if (s.override && t > s.override.until) s.override = null;

      // Doze off when the visitor goes quiet; wake up with a yawn.
      const quiet = idleFor() > SLEEP_AFTER_MS;
      if (quiet && !s.asleep && !s.override) {
        s.asleep = true;
        say(reactions.asleep, 0);
      } else if (!quiet && s.asleep) {
        s.asleep = false;
        s.override = { pose: "yawn", until: t + 2.2 };
        say(reactions.wake, 2600);
        s.nextBreak = t + 10;
      }

      if (!s.override && !s.asleep && t > s.nextBreak) {
        const p = IDLE_BREAKS[Math.floor(Math.random() * IDLE_BREAKS.length)];
        s.override = { pose: p, until: t + 2.8 };
        s.nextBreak = t + 10 + Math.random() * 6;
      }

      if (s.asleep) {
        apply("sleep", false);
        bob = Math.sin(t * 1.2) * 0.015;
      } else if (s.override?.dance) {
        bob = Math.abs(Math.sin(t * 9)) * 0.12;
        lean = Math.sin(t * 9) * 0.06;
        apply("dance", Math.floor(t * 3) % 2 === 0);
      } else if (s.override) {
        apply(s.override.pose, false);
      } else {
        // The pointing sprite points to the viewer's left; flip it when the content is on the right.
        apply(def.pose, def.pose === "pointing" && def.side === "left");
        // Lean a touch towards the cursor.
        const px = (pointer.x * stageWidth) / 2;
        lean = -THREE.MathUtils.clamp((px - g.position.x) * 0.006, -0.035, 0.035);
      }
    }

    // Squash-and-stretch pop on pose change plus gentle breathing.
    s.pop = Math.max(0, s.pop - step * 4.5);
    const pop = Math.sin(s.pop * Math.PI) * 0.06;
    const breathe = s.walking ? 0 : Math.sin(t * 1.8) * 0.006;
    b.position.y = bob;
    b.rotation.z = THREE.MathUtils.damp(b.rotation.z, lean, 8, step);
    b.scale.set(1 - pop * 0.6, 1 + pop + breathe, 1);
  });

  const onClick = () => {
    const s = state.current;
    if (s.walking) return;
    const now = clock.elapsedTime;
    s.clicks = [...s.clicks.filter((c) => now - c < 2.5), now];
    if (s.clicks.length >= 3) {
      s.clicks = [];
      s.override = { pose: "facepalm", until: now + 2.6 };
      say(reactions.tooManyClicks, 3000);
      return;
    }
    s.override = { pose: "dance", until: now + 2.6, dance: true };
    say(clickQuips[Math.floor(Math.random() * clickQuips.length)], 3600);
  };

  if (!ready) return null;

  const size = spriteSizes[pose];
  const w = size.w * UNIT;
  const h = size.h * UNIT;
  const map = textures.get(pose) ?? textures.get(def.pose)!;
  const flip = mirror ? -1 : 1;
  // Keep the head over the group origin so walk frames of different widths don't jitter.
  const offsetX = (0.5 - (size.ax ?? 0.5)) * w * flip;

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.05]}>
        <planeGeometry args={[1.9, 0.8]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.85} />
      </mesh>

      <group ref={body}>
        <mesh
          position={[offsetX, h / 2, 0]}
          scale={[flip, 1, 1]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={map} transparent alphaTest={0.05} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <Html position={[0, h + 0.25, 0]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <div className={`speech-bubble ${bubble ? "is-open" : ""}`}>{bubble ?? ""}</div>
      </Html>
    </group>
  );
}
