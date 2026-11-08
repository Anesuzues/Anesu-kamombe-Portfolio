import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { use3DQuality } from "@/hooks/use-3d-quality"
import { fibonacciSphere, getDotTexture } from "./textures"
import { WebGLBoundary } from "./WebGLBoundary"

const RADIUS = 2

/** Fresnel rim glow around the globe. */
const atmosphereShader = {
  uniforms: { uColor: { value: new THREE.Color("#00e5ff") } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
      gl_FragColor = vec4(uColor, rim * 0.65);
    }
  `,
}

function GlobeSurface({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const pts = fibonacciSphere(count, RADIUS)
    const positions = new Float32Array(pts.length * 3)
    const colors = new Float32Array(pts.length * 3)
    const cyan = new THREE.Color("#00ffff")
    const green = new THREE.Color("#00ff66")
    const tmp = new THREE.Color()
    pts.forEach((p, i) => {
      p.toArray(positions, i * 3)
      // Pseudo "continents": a few bands get the brighter green tint.
      const land = Math.sin(p.x * 2.1) * Math.cos(p.y * 1.7) + Math.sin(p.z * 2.6) > 0.55
      tmp.copy(land ? green : cyan).multiplyScalar(land ? 1 : 0.45)
      tmp.toArray(colors, i * 3)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return g
  }, [count])

  return (
    <>
      {/* Dark core hides the back hemisphere so the globe reads as solid */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshBasicMaterial color="#00111f" transparent opacity={0.92} />
      </mesh>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.055}
          map={getDotTexture()}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh scale={1.1}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <shaderMaterial
          args={[atmosphereShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  )
}

type Arc = { curve: THREE.QuadraticBezierCurve3; points: THREE.Vector3[]; color: string; speed: number; offset: number }

function makeArcs(n: number): Arc[] {
  const palette = ["#00ffff", "#00ff66", "#2f6bff", "#ff2bd6"]
  const randomOnSphere = () =>
    new THREE.Vector3().randomDirection().multiplyScalar(RADIUS)
  return Array.from({ length: n }, (_, i) => {
    const a = randomOnSphere()
    let b = randomOnSphere()
    while (a.distanceTo(b) < 1.6) b = randomOnSphere()
    const mid = a.clone().add(b).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(RADIUS + a.distanceTo(b) * 0.45)
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    return {
      curve,
      points: curve.getPoints(48),
      color: palette[i % palette.length],
      speed: 0.18 + Math.random() * 0.2,
      offset: Math.random(),
    }
  })
}

/** Attack / data-flow arcs with a packet travelling along each one. */
function DataArcs({ count }: { count: number }) {
  const arcs = useMemo(() => makeArcs(count), [count])
  const packets = useRef<THREE.Mesh[]>([])
  const nodes = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    arcs.forEach((arc, i) => {
      const p = packets.current[i]
      if (p) p.position.copy(arc.curve.getPoint((t * arc.speed + arc.offset) % 1))
      const n = nodes.current[i]
      if (n) n.scale.setScalar(1 + ((t * 1.5 + arc.offset * 3) % 1) * 2.5)
      if (n) (n.material as THREE.MeshBasicMaterial).opacity = 1 - ((t * 1.5 + arc.offset * 3) % 1)
    })
  })

  return (
    <group>
      {arcs.map((arc, i) => {
        const end = arc.curve.v2
        return (
          <group key={i}>
            <Line points={arc.points} color={arc.color} lineWidth={1.2} transparent opacity={0.55} />
            <mesh ref={(m) => m && (packets.current[i] = m)}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Ping ring at the target node */}
            <mesh
              ref={(m) => m && (nodes.current[i] = m)}
              position={end}
              onUpdate={(m) => m.lookAt(end.clone().multiplyScalar(2))}
            >
              <ringGeometry args={[0.04, 0.06, 24]} />
              <meshBasicMaterial color={arc.color} transparent side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: [number, number, number]; speed: number; color: string }) {
  const sat = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    sat.current.rotation.z += delta * speed
  })
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      <group ref={sat}>
        <mesh position={[radius, 0, 0]}>
          <octahedronGeometry args={[0.07, 0]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}

function Globe({ low }: { low: boolean }) {
  const group = useRef<THREE.Group>(null!)

  // Subtle tilt toward the pointer, on top of OrbitControls' auto-rotate.
  useFrame((state) => {
    group.current.rotation.x += (state.pointer.y * 0.25 - group.current.rotation.x) * 0.05
    group.current.rotation.z += (-state.pointer.x * 0.15 - group.current.rotation.z) * 0.05
  })

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <GlobeSurface count={low ? 1400 : 2600} />
      <DataArcs count={low ? 6 : 10} />
      <OrbitRing radius={2.9} tilt={[Math.PI / 2.3, 0, 0.2]} speed={0.6} color="#00ffff" />
      <OrbitRing radius={3.3} tilt={[Math.PI / 1.8, 0.5, 0]} speed={-0.4} color="#00ff66" />
    </group>
  )
}

export function CyberGlobe() {
  const { animate, low } = use3DQuality()

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing" aria-label="Interactive 3D globe of secured data flows" role="img">
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={low ? 1 : [1, 2]}
          gl={{ antialias: true, alpha: true }}
          frameloop={animate ? "always" : "demand"}
        >
          <Globe low={low} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={animate} autoRotateSpeed={0.8} rotateSpeed={0.5} />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
