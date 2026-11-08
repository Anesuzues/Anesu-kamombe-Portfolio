import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { use3DQuality } from "@/hooks/use-3d-quality"
import { fibonacciSphere, getDotTexture } from "./textures"
import { WebGLBoundary } from "./WebGLBoundary"

export type SphereSkill = { label: string; color: string }

const RADIUS = 3.1

function Network({ skills }: { skills: SphereSkill[] }) {
  const group = useRef<THREE.Group>(null!)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  // Stretch into a wide ellipsoid: labels are wider than tall, so this cuts overlap.
  const positions = useMemo(
    () => fibonacciSphere(skills.length, RADIUS).map((p) => p.set(p.x * 1.45, p.y * 0.95, p.z * 1.1)),
    [skills.length]
  )

  // Connect every node to its two nearest neighbours → "neural mesh" look.
  const edges = useMemo(() => {
    const seg: number[] = []
    const seen = new Set<string>()
    positions.forEach((p, i) => {
      positions
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (seen.has(key)) return
          seen.add(key)
          seg.push(...p.toArray(), ...positions[j].toArray())
        })
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3))
    return g
  }, [positions])

  const dots = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(positions)
    const c = new Float32Array(positions.length * 3)
    skills.forEach((s, i) => new THREE.Color(s.color).toArray(c, i * 3))
    g.setAttribute("color", new THREE.BufferAttribute(c, 3))
    return g
  }, [positions, skills])

  const tmp = useMemo(() => new THREE.Vector3(), [])

  // Fade/scale labels by depth so the sphere reads as 3D.
  useFrame((state) => {
    group.current.updateMatrixWorld()
    positions.forEach((p, i) => {
      const el = labels.current[i]
      if (!el) return
      tmp.copy(p).applyMatrix4(group.current.matrixWorld).applyMatrix4(state.camera.matrixWorldInverse)
      const depth = THREE.MathUtils.clamp((tmp.z + state.camera.position.length() + RADIUS * 1.1) / (RADIUS * 2.2), 0, 1)
      el.style.opacity = String(0.18 + depth * 0.82)
      el.style.transform = `scale(${0.75 + depth * 0.35})`
      el.style.filter = depth < 0.45 ? "blur(1px)" : "none"
    })
  })

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
      <points geometry={dots}>
        <pointsMaterial size={0.22} map={getDotTexture()} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.25} />
      </mesh>
      {skills.map((s, i) => (
        <Html key={s.label} position={positions[i]} center zIndexRange={[20, 0]}>
          <div
            ref={(el) => (labels.current[i] = el)}
            className="whitespace-nowrap rounded-md border bg-card px-2.5 py-1 font-mono text-xs select-none"
            style={{ borderColor: `${s.color}66`, color: s.color, textShadow: `0 0 8px ${s.color}88` }}
          >
            {s.label}
          </div>
        </Html>
      ))}
    </group>
  )
}

/** Pull the camera back on narrow (portrait) containers so the ellipsoid fits. */
function FitCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    camera.position.setLength(aspect < 1 ? 13 : aspect < 1.6 ? 10.5 : 8.5)
  }, [camera, size])
  return null
}

export default function SkillSphere({ skills }: { skills: SphereSkill[] }) {
  const { animate, low } = use3DQuality()

  return (
    <div className="h-full w-full cursor-grab active:cursor-grabbing" aria-hidden>
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 8.5], fov: 50 }}
          dpr={low ? 1 : [1, 2]}
          gl={{ alpha: true, antialias: true }}
          frameloop={animate ? "always" : "demand"}
        >
          <FitCamera />
          <Network skills={skills} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={animate} autoRotateSpeed={1.2} rotateSpeed={0.6} />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
