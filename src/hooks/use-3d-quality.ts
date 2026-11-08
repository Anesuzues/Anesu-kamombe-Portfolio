import { useEffect, useState } from "react"

export type Quality3D = {
  /** false when WebGL scenes should not animate (prefers-reduced-motion) */
  animate: boolean
  /** lower particle counts / pixel ratio on phones and weak devices */
  low: boolean
}

function detect(): Quality3D {
  if (typeof window === "undefined") return { animate: true, low: false }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const coarse = window.matchMedia("(pointer: coarse)").matches
  const small = window.innerWidth < 768
  const cores = navigator.hardwareConcurrency ?? 8
  return { animate: !reduced, low: coarse || small || cores <= 4 }
}

export function use3DQuality(): Quality3D {
  const [quality, setQuality] = useState<Quality3D>(detect)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setQuality(detect())
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return quality
}
