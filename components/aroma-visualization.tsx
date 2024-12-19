'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type Scent } from '@/types/candle'

export function AromaVisualization({ scents }: { scents: Scent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Create particles for each scent
    const particles = scents.flatMap(scent => 
      Array.from({ length: Math.floor(scent.intensity * 20) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + (scent.intensity * 8),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        scent,
        opacity: Math.random() * 0.5 + 0.3
      }))
    )

    // Animation
    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.scent.color || '#000000'}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(animationFrame)
    }
  }, [scents])

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="space-y-4">
          <h2 className="text-2xl tracking-tight text-neutral-500 font-light">aromas</h2>
          <div className="flex gap-4 flex-wrap">
            {scents.map((scent) => (
              <div key={scent.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: scent.color || '#000000' }}
                />
                <span className="text-sm tracking-wide text-neutral-500">
                  {scent.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[2/1] w-full">
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-xl bg-[#FFFCF8]" 
          />
        </div>
      </CardContent>
    </Card>
  )
}

