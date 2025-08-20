import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function NetworkLines() {
  const linesRef = useRef<THREE.Group>(null!)
  
  // Generate random network connections
  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < 20; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      )
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      )
      lines.push([start, end])
    }
    return lines
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={linesRef}>
      {connections.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="#00ffff"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  )
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Sphere ref={globeRef} args={[1.5, 32, 32]}>
      <meshPhongMaterial
        color="#001122"
        wireframe
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

function FloatingNodes() {
  const nodesRef = useRef<THREE.Group>(null!)
  
  const nodes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      scale: Math.random() * 0.1 + 0.05,
      speed: Math.random() * 0.02 + 0.01
    }))
  }, [])

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, index) => {
        const node = nodes[index]
        child.position.y += Math.sin(state.clock.elapsedTime * node.speed) * 0.01
        child.rotation.x = state.clock.elapsedTime * node.speed
        child.rotation.z = state.clock.elapsedTime * node.speed * 0.5
      })
    }
  })

  return (
    <group ref={nodesRef}>
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position}>
          <boxGeometry args={[node.scale, node.scale, node.scale]} />
          <meshPhongMaterial
            color={index % 3 === 0 ? "#00ff00" : index % 3 === 1 ? "#00ffff" : "#0066ff"}
            emissive={index % 3 === 0 ? "#003300" : index % 3 === 1 ? "#003333" : "#001133"}
          />
        </mesh>
      ))}
    </group>
  )
}

export function CyberGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff00" />
        
        <Globe />
        <NetworkLines />
        <FloatingNodes />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}