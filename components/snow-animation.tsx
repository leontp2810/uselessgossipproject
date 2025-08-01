"use client"

import { useEffect, useRef } from "react"

interface Snowflake {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  originalVx: number
  originalVy: number
}

export function SnowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize snowflakes
    const initSnowflakes = () => {
      snowflakesRef.current = []
      const numSnowflakes = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000))

      for (let i = 0; i < numSnowflakes; i++) {
        const snowflake: Snowflake = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 1 + 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          originalVx: 0,
          originalVy: 0,
        }
        snowflake.originalVx = snowflake.vx
        snowflake.originalVy = snowflake.vy
        snowflakesRef.current.push(snowflake)
      }
    }
    initSnowflakes()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakesRef.current.forEach((snowflake) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - snowflake.x
        const dy = mouseRef.current.y - snowflake.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repulsionRadius = 100

        // Apply repulsion effect
        if (distance < repulsionRadius && distance > 0) {
          const force = (repulsionRadius - distance) / repulsionRadius
          const angle = Math.atan2(dy, dx)
          const repulsionStrength = 3

          snowflake.vx = snowflake.originalVx - Math.cos(angle) * force * repulsionStrength
          snowflake.vy = snowflake.originalVy - Math.sin(angle) * force * repulsionStrength
        } else {
          // Gradually return to original velocity
          snowflake.vx += (snowflake.originalVx - snowflake.vx) * 0.05
          snowflake.vy += (snowflake.originalVy - snowflake.vy) * 0.05
        }

        // Update position
        snowflake.x += snowflake.vx
        snowflake.y += snowflake.vy

        // Wrap around screen
        if (snowflake.x < -10) snowflake.x = canvas.width + 10
        if (snowflake.x > canvas.width + 10) snowflake.x = -10
        if (snowflake.y > canvas.height + 10) {
          snowflake.y = -10
          snowflake.x = Math.random() * canvas.width
        }

        // Draw snowflake
        ctx.save()
        ctx.globalAlpha = snowflake.opacity
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 3
        ctx.shadowColor = "#ffffff"
        ctx.beginPath()
        ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
