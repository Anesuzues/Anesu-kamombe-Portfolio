import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { use3DQuality } from "@/hooks/use-3d-quality"
import { useActiveSection, type SectionId } from "@/lib/sections"
import { getDotTexture } from "./textures"
import { WebGLBoundary } from "./WebGLBoundary"

/** Accent colour of the background scene per section — eases between them as you scroll. */
const SECTION_ACCENT: Record<SectionId, string> = {
  about: "#00ffff",
  skills: "#00ff66",
  projects: "#2f6bff",
  experience: "#00e5ff",
  contact: "#00ff99",
}

/** Pointer + scroll, tracked on window because the canvas ignores pointer events. */
const input = { x: 0, y: 0, scroll: 0 }

function useWindowInput() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      input.x = (e.clientX / window.innerWidth) * 2 - 1
      input.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      input.scroll = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])
}

function DataField({ count, accent }: { count: number; accent: THREE.Color }) {
  const ref = useRef<THREE.Points>(null!)
  const material = useRef<THREE.PointsMaterial>(null!)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45
      positions[i * 3 + 2] = -Math.random() * 50 + 8
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.01
    ref.current.rotation.x = input.scroll * 0.5
    material.current.color.lerp(accent, 0.04)
    material.current.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        ref={material}
        size={0.14}
        map={getDotTexture()}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

function CyberFloor({ accent }: { accent: THREE.Color }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(160, 80, "#00ffff", "#00ffff")
    const m = g.material as THREE.LineBasicMaterial
    m.transparent = true
    m.opacity = 0.22
    m.depthWrite = false
    return g
  }, [])

  useFrame((_, delta) => {
    // Endless forward motion: slide one cell then snap back.
    grid.position.z = (grid.position.z + delta * 1.6) % 2
    ;(grid.material as THREE.LineBasicMaterial).color.lerp(accent, 0.04)
  })

  return <primitive object={grid} position={[0, -7, -10]} />
}

// Kept toward the edges and far back so they frame content instead of sitting behind text.
const SHAPES = [
  { pos: [-16, 5, -14], kind: "ico", size: 1.6, speed: 0.25 },
  { pos: [17, -3, -16], kind: "oct", size: 2.2, speed: 0.18 },
  { pos: [12, 9, -26], kind: "torus", size: 2.4, speed: 0.12 },
  { pos: [-19, -6, -22], kind: "dodeca", size: 2.6, speed: 0.15 },
  { pos: [9, -8, -10], kind: "tetra", size: 0.9, speed: 0.4 },
  { pos: [-6, 12, -34], kind: "ico", size: 3.2, speed: 0.08 },
] as const

function FloatingShapes({ accent }: { accent: THREE.Color }) {
  const group = useRef<THREE.Group>(null!)
  const mats = useRef<THREE.MeshBasicMaterial[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    group.current.children.forEach((mesh, i) => {
      const s = SHAPES[i]
      mesh.rotation.x = t * s.speed
      mesh.rotation.y = t * s.speed * 1.3
      mesh.position.y = s.pos[1] + Math.sin(t * 0.6 + i) * 0.6 + input.scroll * (i % 2 ? 6 : -6)
    })
    mats.current.forEach((m, i) => m.color.lerp(i % 3 === 0 ? accent : WHITE_CYAN, 0.04))
  })

  return (
    <group ref={group}>
      {SHAPES.map((s, i) => (
        <mesh key={i} position={s.pos as unknown as [number, number, number]}>
          {s.kind === "ico" && <icosahedronGeometry args={[s.size, 0]} />}
          {s.kind === "oct" && <octahedronGeometry args={[s.size, 0]} />}
          {s.kind === "torus" && <torusGeometry args={[s.size, s.size * 0.08, 8, 48]} />}
          {s.kind === "dodeca" && <dodecahedronGeometry args={[s.size, 0]} />}
          {s.kind === "tetra" && <tetrahedronGeometry args={[s.size, 0]} />}
          <meshBasicMaterial
            ref={(m) => m && (mats.current[i] = m)}
            wireframe
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

const WHITE_CYAN = new THREE.Color("#7fdcff")

function CameraRig() {
  useFrame((state) => {
    const cam = state.camera
    cam.position.x += (input.x * 1.8 - cam.position.x) * 0.04
    cam.position.y += (input.y * 1.2 - input.scroll * 3 - cam.position.y) * 0.04
    cam.position.z += (10 - input.scroll * 6 - cam.position.z) * 0.04
    cam.lookAt(0, -input.scroll * 2, -10)
  })
  return null
}

function Scene({ low }: { low: boolean }) {
  const section = useActiveSection()
  const accent = useMemo(() => new THREE.Color(), [])
  accent.set(SECTION_ACCENT[section])

  return (
    <>
      <fog attach="fog" args={["#000a14", 12, 50]} />
      <DataField count={low ? 700 : 2000} accent={accent} />
      <CyberFloor accent={accent} />
      <FloatingShapes accent={accent} />
      <CameraRig />
    </>
  )
}

/** Fixed, full-viewport 3D scene that lives behind every page. */
export default function SceneBackground() {
  const { animate, low } = use3DQuality()
  useWindowInput()

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 120 }}
          dpr={low ? 1 : [1, 1.5]}
          gl={{ antialias: !low, alpha: true, powerPreference: "low-power" }}
          frameloop={animate ? "always" : "demand"}
        >
          <Scene low={low} />
        </Canvas>
      </WebGLBoundary>
      {/* Vignette keeps text readable over the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_95%)]" />
    </div>
  )
}
