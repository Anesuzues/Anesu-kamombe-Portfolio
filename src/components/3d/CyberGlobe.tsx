import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, Icosahedron, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function HolographicRings() {
  const ringsRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.3
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={ringsRef}>
      <Torus args={[2, 0.05, 16, 100]}>
        <meshPhongMaterial color="#00ffff" emissive="#001a1a" wireframe />
      </Torus>
      <Torus args={[2.5, 0.03, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhongMaterial color="#ff0080" emissive="#1a0010" wireframe />
      </Torus>
      <Torus args={[3, 0.02, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
        <meshPhongMaterial color="#8000ff" emissive="#100010" wireframe />
      </Torus>
    </group>
  )
}

function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      coreRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Icosahedron ref={coreRef} args={[1, 1]}>
      <meshPhongMaterial
        color="#ffffff"
        emissive="#0066ff"
        transparent
        opacity={0.8}
        wireframe
      />
    </Icosahedron>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Group>(null!)
  
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const radius = 4 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      return {
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ] as [number, number, number],
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 0.05 + 0.02
      }
    })
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, index) => {
        const particle = particles[index]
        child.rotation.x = state.clock.elapsedTime * particle.speed
        child.rotation.y = state.clock.elapsedTime * particle.speed * 1.5
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3
        child.scale.setScalar(pulse)
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <octahedronGeometry args={[particle.size]} />
          <meshPhongMaterial
            color={index % 4 === 0 ? "#00ffff" : index % 4 === 1 ? "#ff0080" : index % 4 === 2 ? "#8000ff" : "#00ff00"}
            emissive={index % 4 === 0 ? "#003333" : index % 4 === 1 ? "#330020" : index % 4 === 2 ? "#200033" : "#003300"}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function EnergyField() {
  const fieldRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = -state.clock.elapsedTime * 0.1
      fieldRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <mesh ref={fieldRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshPhongMaterial
        color="#0066ff"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  )
}

export function CyberGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ff0080" />
        <pointLight position={[0, 0, -5]} intensity={0.6} color="#8000ff" />
        
        <EnergyField />
        <HolographicRings />
        <CentralCore />
        <FloatingParticles />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  )
}