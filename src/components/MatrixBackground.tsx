import { useEffect, useRef } from 'react'

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix rain effect
    const columns = Math.floor(canvas.width / 20)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("")

    function draw() {
      if (!ctx || !canvas) return

      // Create fade effect
      ctx.fillStyle = 'rgba(4, 16, 32, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff00'
      ctx.font = '15px monospace'

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)]
        
        // Position
        const x = i * 20
        const y = drops[i] * 20

        ctx.fillStyle = `hsl(120, 100%, ${Math.random() * 50 + 25}%)`
        ctx.fillText(text, x, y)

        // Reset drop when it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
      style={{ background: 'transparent' }}
    />
  )
}