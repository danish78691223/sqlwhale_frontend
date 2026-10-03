"use client"

import * as React from "react"

export interface Floating3DParticlesProps extends Omit<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  "width" | "height"
> {
  quantity?: number
  color?: string
  size?: number
  opacity?: number
  drift?: number
  depth?: number
}

interface Particle {
  angle: number
  radius: number
  y: number
  size: number
  angularSpeed: number
  opacity: number
  screenX: number
  screenY: number
  projectedScale: number
}

const MOBILE_BREAKPOINT = 768
const SPREAD_FACTOR = 1.2
const MAX_DPR = 2

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "").trim()
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean

  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(139,92,246,${alpha})`

  const n = Number.parseInt(full, 16)
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`
}

function deriveProjection(depth: number) {
  const t = Math.max(0, Math.min(1, depth))
  const fov = 800 - t * 600
  const perspectiveDistance = 100 + t * 700
  const depthRange = t * Math.min(400, fov + perspectiveDistance - 1)
  return { fov, perspectiveDistance, depthRange }
}

function spawnParticle(
  width: number,
  height: number,
  size: number,
  opacity: number
): Particle {
  const sizeVariance = size * 0.4
  const opacityVariance = 0.2

  return {
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * Math.max(width, height) * SPREAD_FACTOR,
    y: (Math.random() - 0.5) * height * 2,
    size: Math.max(0.5, size - sizeVariance + Math.random() * sizeVariance * 2),
    angularSpeed: 0.0015 + Math.random() * 0.001,
    opacity: Math.min(
      1,
      Math.max(0, opacity - opacityVariance + Math.random() * opacityVariance * 2)
    ),
    screenX: 0,
    screenY: 0,
    projectedScale: 1,
  }
}

export function Floating3DParticles({
  quantity = 400,
  color = "#8B5CF6",
  size = 5,
  opacity = 0.3,
  drift = 0.8,
  depth = 0.5,
  className,
  style,
  ...canvasProps
}: Floating3DParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let mounted = true
    let paused = false
    let reducedMotion = false
    let rafId: number | null = null
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let staticDirty = true

    const { fov, perspectiveDistance, depthRange } = deriveProjection(depth)
    const colorRef = { current: color }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncReducedMotion = () => {
      reducedMotion = mq.matches
    }

    const draw = (p: Particle) => {
      const radius = Math.max(0, p.size * p.projectedScale)
      if (radius <= 0) return

      ctx.beginPath()
      ctx.fillStyle = hexToRgba(colorRef.current, p.opacity)
      ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const staticFrame = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      const denom = Math.max(1, fov + perspectiveDistance)
      const scale = fov / denom

      for (const p of particles) {
        p.screenX = cx + Math.cos(p.angle) * p.radius * scale
        p.screenY = cy + p.y * scale
        p.projectedScale = scale
        draw(p)
      }
    }

    const tick = () => {
      if (!mounted) return

      if (paused || reducedMotion) {
        if (reducedMotion && staticDirty) {
          staticDirty = false
          staticFrame()
        }
        rafId = requestAnimationFrame(tick)
        return
      }

      staticDirty = true
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      for (const p of particles) {
        p.angle += p.angularSpeed
        p.y -= drift

        if (p.y < -height) {
          p.y = height
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR
        } else if (p.y > height) {
          p.y = -height
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR
        }

        const denom = Math.max(
          1,
          fov + perspectiveDistance + Math.sin(p.angle) * depthRange
        )
        const scale = fov / denom

        p.screenX = cx + Math.cos(p.angle) * p.radius * scale
        p.screenY = cy + p.y * scale
        p.projectedScale = scale
      }

      particles.sort((a, b) => a.projectedScale - b.projectedScale)
      for (const p of particles) draw(p)

      rafId = requestAnimationFrame(tick)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))

      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = window.innerWidth < MOBILE_BREAKPOINT
        ? Math.round(quantity * 0.2)
        : quantity

      particles = Array.from({ length: Math.max(0, count) }, () =>
        spawnParticle(width, height, size, opacity)
      )

      staticDirty = true
    }

    const onVisibilityChange = () => {
      paused = document.hidden
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null

    if (ro) ro.observe(canvas)
    else window.addEventListener("resize", resize)

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry) paused = document.hidden || !entry.isIntersecting
            },
            { threshold: 0 }
          )
        : null

    io?.observe(canvas)

    document.addEventListener("visibilitychange", onVisibilityChange)
    mq.addEventListener("change", syncReducedMotion)

    syncReducedMotion()
    resize()
    rafId = requestAnimationFrame(tick)

    return () => {
      mounted = false
      if (rafId !== null) cancelAnimationFrame(rafId)
      ro?.disconnect()
      if (!ro) window.removeEventListener("resize", resize)
      io?.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      mq.removeEventListener("change", syncReducedMotion)
    }
  }, [quantity, color, size, opacity, drift, depth])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={style}
      {...canvasProps}
    />
  )
}
