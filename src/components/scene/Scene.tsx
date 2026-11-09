import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Grid, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Character } from "./Character";
import { scrollState } from "./scrollState";
import { sections } from "@/data/content";


const GOLD = "#d9a441";
const TEAL = "#1aa3a8";
const COCOA = "#8a4b1f";

function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);
  useFrame(({ camera, pointer }, dt) => {
    const d = Math.min(dt, 0.05);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.7, 3, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.7 + pointer.y * 0.3, 3, d);
    camera.lookAt(look);
  });
  return null;
}

/** Gold grid floor that streams towards the camera as the page scrolls. */
function Floor() {
  const grid = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (grid.current) grid.current.position.z = (scrollState.progress * 48) % 4;
  });
  return (
    <Grid
      ref={grid}
      infiniteGrid
      cellSize={1}
      sectionSize={4}
      cellThickness={0.6}
      sectionThickness={1.1}
      cellColor="#4a3418"
      sectionColor={GOLD}
      fadeDistance={42}
      fadeStrength={2.2}
      followCamera={false}
    />
  );
}

/** Rotating portal ring behind the stage; its colour follows the active section. */
function Portal({ section }: { section: number }) {
  const ring = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const target = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    if (!ring.current) return;
    ring.current.rotation.z += dt * 0.12;
    ring.current.rotation.y = Math.sin(scrollState.progress * Math.PI * 2) * 0.5;
    target.set(sections[section]?.accent ?? GOLD);
    mats.current.forEach((m) => m.color.lerp(target, 0.04));
  });
  return (
    <group ref={ring} position={[0, 3.2, -9]}>
      {[5.2, 6.1, 7.4].map((r, i) => (
        <mesh key={r} rotation={[0, 0, i * 1.3]}>
          <torusGeometry args={[r, i === 0 ? 0.05 : 0.02, 8, 120, Math.PI * (1.2 + i * 0.25)]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            color={GOLD}
            transparent
            opacity={0.75 - i * 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Wireframe shapes orbiting the stage; the whole field turns with scroll. */
function Decor() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const colors = [GOLD, TEAL, COCOA, GOLD, TEAL];
    return Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = 9 + ((i * 7) % 5) * 1.6;
      return {
        pos: [Math.cos(a) * r, 1.2 + ((i * 3) % 7) * 0.9, Math.sin(a) * r - 2] as [number, number, number],
        size: 0.35 + ((i * 5) % 4) * 0.18,
        kind: i % 4,
        color: colors[i % colors.length],
        speed: 0.6 + (i % 3) * 0.4,
      };
    });
  }, []);
  useFrame((_, dt) => {
    if (!group.current) return;
    const target = scrollState.progress * Math.PI * 1.6;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 2.5, Math.min(dt, 0.05));
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={it.speed} rotationIntensity={1.6} floatIntensity={1.4} position={it.pos}>
          <mesh>
            {it.kind === 0 && <icosahedronGeometry args={[it.size, 0]} />}
            {it.kind === 1 && <octahedronGeometry args={[it.size, 0]} />}
            {it.kind === 2 && <torusKnotGeometry args={[it.size * 0.6, it.size * 0.18, 64, 8]} />}
            {it.kind === 3 && <boxGeometry args={[it.size, it.size, it.size]} />}
            <meshBasicMaterial color={it.color} wireframe transparent opacity={0.55} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function World({ section, portal }: { section: number; portal: React.MutableRefObject<HTMLElement> }) {
  // Below the lg breakpoint the character is drawn by the DOM companion instead.
  const compact = useThree((s) => s.size.width) < 1024;
  return (
    <group>
      <Floor />
      <Portal section={section} />
      <Decor />
      <Sparkles count={140} scale={[34, 9, 22]} position={[0, 4, -3]} size={2.4} speed={0.35} color={GOLD} opacity={0.7} />
      {!compact && (
        <Suspense fallback={null}>
          <Character section={section} portal={portal} />
        </Suspense>
      )}
    </group>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Scene({ section }: { section: number }) {
  const portal = useRef<HTMLDivElement>(null!);
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.7, 10], fov: 35, near: 0.1, far: 120 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          eventSource={document.getElementById("root")!}
          eventPrefix="client"
        >
          <fog attach="fog" args={["#070b14", 12, 34]} />
          <Stars radius={60} depth={30} count={1600} factor={3} saturation={0} fade speed={0.6} />
          <CameraRig />
          <World section={section} portal={portal} />
        </Canvas>
      </SceneBoundary>
      <div ref={portal} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}
