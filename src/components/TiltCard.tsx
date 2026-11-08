import { useRef, type PointerEvent, type ReactNode } from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** maximum rotation in degrees */
  max?: number
}

/** Wraps a card in a pointer-driven 3D tilt with a moving holographic glare. */
export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useSpring(0, { stiffness: 200, damping: 25 })

  const spring = { stiffness: 180, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const scale = useTransform(hover, [0, 1], [1, 1.015])

  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, hsl(var(--primary) / 0.16), transparent 55%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    hover.set(1)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, scale, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={cn("relative h-full will-change-transform", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{ background: glare, opacity: hover }}
      />
    </motion.div>
  )
}
