import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { clickQuips, sections, spriteSizes, type PoseName } from "@/data/content";

const SPRITES = spriteSizes;
const NAMES = Object.keys(SPRITES) as PoseName[];
const URLS = NAMES.map((n) => `/ava/${n}.webp`);
/** World units per sprite pixel: a standing pose is ~3.3 units tall. */
const UNIT = 3.3 / 716;
const WALK_SPEED = 3.4;
const IDLE_BREAKS: PoseName[] = ["coffee", "water", "stretch", "yawn", "idle"];

function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.75)");
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
}

export function Character({ section, portal }: Props) {
  const textures = useTexture(URLS);
  const shadowTex = useShadowTexture();
  const viewport = useThree((s) => s.viewport);
  const clock = useThree((s) => s.clock);

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
  }, [textures]);

  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const [pose, setPose] = useState<PoseName>(sections[0].pose);
  const [mirror, setMirror] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const state = useRef({
    pose: sections[0].pose as PoseName,
    mirror: false,
    walking: false,
    phase: 0,
    pop: 0,
    override: null as null | { pose: PoseName; until: number; dance?: boolean },
    nextBreak: 9,
    started: false,
  });

  const def = sections[section] ?? sections[0];
  const targetX = (def.side === "right" ? 1 : -1) * Math.min(viewport.width * 0.27, 4.2);

  // Speech bubble on arrival at each section.
  useEffect(() => {
    setBubble(def.quip);
    const id = window.setTimeout(() => setBubble(null), 5200);
    state.current.override = null;
    return () => window.clearTimeout(id);
  }, [def.quip]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const apply = (p: PoseName, m: boolean) => {
    const s = state.current;
    if (s.pose !== p) {
      s.pose = p;
      s.pop = 1;
      setPose(p);
    }
    if (s.mirror !== m) {
      s.mirror = m;
      setMirror(m);
    }
  };

  useFrame(({ clock }, dt) => {
    const g = group.current;
    const b = body.current;
    if (!g || !b) return;
    const s = state.current;
    const t = clock.elapsedTime;
    const step = Math.min(dt, 0.05);

    if (!s.started) {
      g.position.x = targetX;
      s.started = true;
    }

    const dx = targetX - g.position.x;
    let bob = 0;
    let lean = 0;

    if (Math.abs(dx) > 0.03) {
      // Walk across the stage towards the next mark.
      const dir = Math.sign(dx);
      g.position.x += dir * Math.min(Math.abs(dx), WALK_SPEED * step);
      s.walking = true;
      s.phase += step * 11;
      bob = Math.abs(Math.sin(s.phase)) * 0.09;
      lean = -dir * 0.05 + Math.sin(s.phase) * 0.025;
      apply("walking", dir < 0);
    } else {
      if (s.walking) {
        s.walking = false;
        s.nextBreak = t + 8 + Math.random() * 4;
      }
      if (s.override && t > s.override.until) s.override = null;
      if (!s.override && t > s.nextBreak) {
        const p = IDLE_BREAKS[Math.floor(Math.random() * IDLE_BREAKS.length)];
        s.override = { pose: p, until: t + 2.8 };
        s.nextBreak = t + 9 + Math.random() * 5;
      }
      if (s.override) {
        if (s.override.dance) {
          bob = Math.abs(Math.sin(t * 9)) * 0.12;
          lean = Math.sin(t * 9) * 0.06;
          apply("dance", Math.floor(t * 3) % 2 === 0);
        } else {
          apply(s.override.pose, false);
        }
      } else {
        // Point / wave towards the content, which sits on the opposite side.
        apply(def.pose, def.pose === "pointing" && def.side === "right");
      }
    }

    // Squash-and-stretch pop on pose change plus gentle breathing.
    s.pop = Math.max(0, s.pop - step * 4.5);
    const pop = Math.sin(s.pop * Math.PI) * 0.07;
    const breathe = Math.sin(t * 1.8) * 0.006;
    b.position.y = bob;
    b.rotation.z = THREE.MathUtils.damp(b.rotation.z, lean, 10, step);
    b.scale.set(1 - pop * 0.6, 1 + pop + breathe, 1);
  });

  const bubbleTimer = useRef<number>();
  useEffect(() => () => window.clearTimeout(bubbleTimer.current), []);

  const onClick = () => {
    const s = state.current;
    if (s.walking) return;
    s.override = { pose: "dance", until: clock.elapsedTime + 2.6, dance: true };
    setBubble(clickQuips[Math.floor(Math.random() * clickQuips.length)]);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 3600);
  };

  const size = SPRITES[pose];
  const w = size.w * UNIT;
  const h = size.h * UNIT;
  const map = textures[NAMES.indexOf(pose)];

  return (
    <group ref={group}>
      {/* contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[w * 1.5, 0.9]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.9} />
      </mesh>

      <group ref={body}>
        <mesh
          position={[0, h / 2, 0]}
          scale={[mirror ? -1 : 1, 1, 1]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={map} transparent alphaTest={0.05} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        {/* glossy floor reflection */}
        <mesh position={[0, -h / 2, 0]} scale={[mirror ? -1 : 1, -1, 1]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={map} transparent opacity={0.13} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <Html position={[0, h + 0.25, 0]} center portal={portal} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <div className={`speech-bubble ${bubble ? "is-open" : ""}`}>{bubble ?? ""}</div>
      </Html>
    </group>
  );
}

useTexture.preload(URLS);
