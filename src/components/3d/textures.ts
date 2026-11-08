import * as THREE from "three"

let dotTexture: THREE.Texture | null = null

/** Soft round sprite so THREE.Points render as glowing dots instead of squares. */
export function getDotTexture() {
  if (dotTexture) return dotTexture
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.35, "rgba(255,255,255,0.6)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  dotTexture = new THREE.CanvasTexture(canvas)
  return dotTexture
}

/** Evenly distributed points on a sphere. */
export function fibonacciSphere(count: number, radius: number) {
  const out: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    out.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius))
  }
  return out
}
