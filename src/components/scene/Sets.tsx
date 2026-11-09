import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#d9a441";
const TEAL = "#1aa3a8";
const COCOA = "#8a4b1f";
const INK = "#0d1424";

/** Scales its children in when the section is active and out when it isn't. */
function SetGroup({ active, x, children }: { active: boolean; x: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const s = THREE.MathUtils.damp(g.scale.x, active ? 1 : 0, active ? 3.5 : 7, Math.min(dt, 0.05));
    g.scale.setScalar(s);
    g.visible = s > 0.01;
  });
  return (
    <group ref={ref} position={[x, 0, 0]} scale={0} visible={false}>
      {children}
    </group>
  );
}

/** Glowing ring on the floor under the character. */
function Pedestal({ color = GOLD }: { color?: string }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.6) * 0.03);
  });
  return (
    <group>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.25, 1.32, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.5, 1.52, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/** Soft cone of light from above. */
function Spotlight() {
  return (
    <mesh position={[0, 4.2, -0.3]}>
      <coneGeometry args={[1.7, 8.4, 40, 1, true]} />
      <meshBasicMaterial
        color="#f3d28a"
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Three electron-style orbits circling the thinker. */
function Orbits() {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.Mesh[]>([]);
  const rings = useMemo(
    () => [
      { rot: [Math.PI / 2.3, 0, 0], color: TEAL, r: 2.0, speed: 0.9 },
      { rot: [Math.PI / 2.6, Math.PI / 3, 0], color: GOLD, r: 2.25, speed: -0.7 },
      { rot: [Math.PI / 2.4, -Math.PI / 3, 0], color: COCOA, r: 2.5, speed: 0.55 },
    ],
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) group.current.rotation.y = t * 0.15;
    dots.current.forEach((d, i) => {
      const a = t * rings[i].speed + i * 2;
      d.position.set(Math.cos(a) * rings[i].r, Math.sin(a) * rings[i].r, 0);
    });
  });
  return (
    <group ref={group} position={[0, 1.5, 0]}>
      {rings.map((ring, i) => (
        <group key={i} rotation={ring.rot as [number, number, number]}>
          <mesh>
            <torusGeometry args={[ring.r, 0.012, 8, 120]} />
            <meshBasicMaterial color={ring.color} transparent opacity={0.7} />
          </mesh>
          <mesh
            ref={(m) => {
              if (m) dots.current[i] = m;
            }}
          >
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color={ring.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Desk with an open laptop, a mug and a lamp. */
function Desk() {
  return (
    <group position={[0, 0, -0.9]}>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[2.3, 0.08, 1]} />
        <meshStandardMaterial color="#3a2414" roughness={0.6} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.07, 1, 0.9]} />
          <meshStandardMaterial color="#141b2c" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* laptop */}
      <mesh position={[-0.2, 1.08, 0.05]}>
        <boxGeometry args={[0.8, 0.03, 0.52]} />
        <meshStandardMaterial color="#2a3142" metalness={0.7} roughness={0.35} />
      </mesh>
      <group position={[-0.2, 1.09, -0.2]} rotation={[-0.3, 0, 0]}>
        <mesh position={[0, 0.27, 0]}>
          <boxGeometry args={[0.8, 0.54, 0.025]} />
          <meshStandardMaterial color="#2a3142" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.27, 0.014]}>
          <planeGeometry args={[0.74, 0.47]} />
          <meshBasicMaterial color={TEAL} toneMapped={false} />
        </mesh>
      </group>
      {/* mug */}
      <mesh position={[0.62, 1.14, 0.18]}>
        <cylinderGeometry args={[0.07, 0.06, 0.16, 20]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.4} />
      </mesh>
      {/* lamp */}
      <mesh position={[0.9, 1.33, -0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.78, 1.62, -0.25]} rotation={[0, 0, 1.2]}>
        <coneGeometry args={[0.14, 0.24, 20, 1, true]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.7, 1.5, -0.1]} color="#ffd9a0" intensity={3} distance={3} />
    </group>
  );
}

function useScreenTexture(accent: string, seed: number) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 320;
    c.height = 200;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = "#1a2236";
    ctx.fillRect(0, 0, 320, 26);
    ["#c0703a", GOLD, TEAL].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(16 + i * 16, 13, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = accent;
    ctx.fillRect(18, 44, 110, 12);
    let r = seed;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(18, 70 + i * 16, 60 + rnd() * 90, 7);
    }
    for (let i = 0; i < 6; i++) {
      const hgt = 20 + rnd() * 80;
      ctx.fillStyle = i % 2 ? accent : "rgba(255,255,255,0.25)";
      ctx.fillRect(190 + i * 19, 170 - hgt, 12, hgt);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [accent, seed]);
}

function Screen({ position, rotation, accent, seed }: {
  position: [number, number, number];
  rotation: [number, number, number];
  accent: string;
  seed: number;
}) {
  const tex = useScreenTexture(accent, seed);
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7} position={position}>
      <group rotation={rotation}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.34, 0.86]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
        <mesh>
          <planeGeometry args={[1.28, 0.8]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/** Floating app windows, one per featured project. */
function Screens({ dir }: { dir: number }) {
  return (
    <group>
      <Screen position={[-1.9 * dir, 3.5, -1.2]} rotation={[0, 0.35 * dir, 0]} accent={GOLD} seed={3} />
      <Screen position={[-0.3 * dir, 4.35, -1.8]} rotation={[0.1, 0.1 * dir, 0]} accent={TEAL} seed={11} />
      <Screen position={[1.5 * dir, 3.7, -1.4]} rotation={[0, -0.35 * dir, 0]} accent="#c0703a" seed={23} />
      <Screen position={[1.9 * dir, 2.2, -2.2]} rotation={[0, -0.45 * dir, 0]} accent={GOLD} seed={42} />
    </group>
  );
}

/** A stack of books, a trophy and a couple of floating certificates. */
function Library({ dir }: { dir: number }) {
  const cert = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 210;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f6ecd6";
    ctx.fillRect(0, 0, 300, 210);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 280, 190);
    ctx.fillStyle = "#3a2414";
    ctx.fillRect(80, 40, 140, 12);
    ctx.fillStyle = "rgba(58,36,20,0.4)";
    [74, 92, 110].forEach((y, i) => ctx.fillRect(50 + i * 10, y, 200 - i * 20, 6));
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(150, 160, 20, 0, Math.PI * 2);
    ctx.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const books = [
    { c: COCOA, w: 0.9, y: 0.07 },
    { c: "#0e7c86", w: 0.8, y: 0.21 },
    { c: "#c9a14a", w: 0.85, y: 0.35 },
    { c: "#2a3142", w: 0.7, y: 0.49 },
  ];
  return (
    <group>
      <group position={[1.75 * dir, 0, -0.4]} rotation={[0, -0.3 * dir, 0]}>
        {books.map((b, i) => (
          <mesh key={i} position={[(i % 2) * 0.05, b.y, 0]} rotation={[0, i * 0.2, 0]}>
            <boxGeometry args={[b.w, 0.13, 0.62]} />
            <meshStandardMaterial color={b.c} roughness={0.7} />
          </mesh>
        ))}
        {/* trophy */}
        <group position={[0, 0.56, 0]}>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 0.1, 24]} />
            <meshStandardMaterial color="#1b2233" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 0.22, 16]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.17, 0.07, 0.26, 24]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      </group>
      {[
        { p: [-1.7 * dir, 3.3, -1.2], r: 0.3 * dir },
        { p: [1.4 * dir, 3.9, -1.6], r: -0.3 * dir },
      ].map((cfg, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.3} floatIntensity={0.8} position={cfg.p as [number, number, number]}>
          <mesh rotation={[0, cfg.r, i ? 0.06 : -0.06]}>
            <planeGeometry args={[1.2, 0.84]} />
            <meshBasicMaterial map={cert} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/** Looping confetti shower. */
function Confetti({ active }: { active: boolean }) {
  const COUNT = 140;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const parts = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 3 - 0.5,
        y: Math.random() * 7,
        v: 0.8 + Math.random() * 1.4,
        spin: (Math.random() - 0.5) * 6,
        phase: Math.random() * 6,
        color: new THREE.Color([GOLD, TEAL, "#f6ecd6", "#c0703a"][i % 4]),
      })),
    [],
  );
  useFrame(({ clock }, dt) => {
    const m = mesh.current;
    if (!m || !active) return;
    const t = clock.elapsedTime;
    parts.forEach((p, i) => {
      p.y -= p.v * Math.min(dt, 0.05);
      if (p.y < 0) p.y = 6.5 + Math.random();
      dummy.position.set(p.x + Math.sin(t * 1.5 + p.phase) * 0.25, p.y, p.z);
      dummy.rotation.set(t * p.spin, t * p.spin * 0.7, p.phase);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (!m.instanceColor) m.setColorAt(i, p.color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <planeGeometry args={[0.11, 0.07]} />
      <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}

/**
 * One small set per section, built around the spot where the character stands.
 * `xs` holds the stage x for each section; `dir` is +1 when he stands on the right.
 */
export function Sets({ section, xs }: { section: number; xs: number[] }) {
  const dir = (i: number) => (xs[i] >= 0 ? 1 : -1);
  return (
    <>
      <SetGroup active={section === 0} x={xs[0]}>
        <Pedestal />
      </SetGroup>
      <SetGroup active={section === 1} x={xs[1]}>
        <Pedestal color="#c0703a" />
        <Spotlight />
      </SetGroup>
      <SetGroup active={section === 2} x={xs[2]}>
        <Orbits />
      </SetGroup>
      <SetGroup active={section === 3} x={xs[3] - dir(3) * 1.35}>
        <Desk />
      </SetGroup>
      <SetGroup active={section === 4} x={xs[4]}>
        <Pedestal color={TEAL} />
        <Screens dir={dir(4)} />
      </SetGroup>
      <SetGroup active={section === 5} x={xs[5]}>
        <Library dir={dir(5)} />
      </SetGroup>
      <SetGroup active={section === 6} x={xs[6]}>
        <Pedestal />
        <Confetti active={section === 6} />
      </SetGroup>
    </>
  );
}
