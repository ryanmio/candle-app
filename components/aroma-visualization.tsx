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
    const particles = scents.flatMap((scent, scentIndex) => {
      // Calculate particle count based on intensity
      const baseCount = 30 // minimum particles
      const intensityBonus = Math.floor(scent.intensity * 100) // up to 100 additional particles
      const particleCount = baseCount + intensityBonus

      return Array.from({ length: particleCount }, () => {
        const baseSize = scent.intensity * 6
        const variance = baseSize * 0.7
        
        // Start near center with exponential distribution
        const angle = Math.random() * Math.PI * 2
        // Use exponential distribution for distance (more particles near center)
        const distance = Math.pow(Math.random(), 2) * 50 // squared for more density in center
        const centerX = canvas.offsetWidth / 2
        const centerY = canvas.offsetHeight / 2
        
        // Add slight offset based on scent index to prevent perfect overlap
        const offsetAngle = (scentIndex * Math.PI / scents.length)
        const offsetX = Math.cos(offsetAngle) * 10
        const offsetY = Math.sin(offsetAngle) * 10
        
        return {
          x: centerX + offsetX + (Math.cos(angle) * distance),
          y: centerY + offsetY + (Math.sin(angle) * distance),
          size: Math.random() * variance + baseSize,
          speedX: (Math.random() - 0.5) * 0.15, // Slightly slower initial speed
          speedY: (Math.random() - 0.5) * 0.15,
          scent,
          opacity: Math.random() * 0.4 + 0.2,
          wobble: {
            amplitude: Math.random() * 0.5,
            frequency: Math.random() * 0.02 + 0.01,
            offset: Math.random() * Math.PI * 2
          }
        }
      })
    })

    let time = 0
    // Animation
    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1
      
      particles.forEach(particle => {
        // Add wobble to movement
        const wobbleX = Math.sin(time * particle.wobble.frequency + particle.wobble.offset) * particle.wobble.amplitude
        const wobbleY = Math.cos(time * particle.wobble.frequency + particle.wobble.offset) * particle.wobble.amplitude
        
        // Update position
        particle.x += particle.speedX + wobbleX
        particle.y += particle.speedY + wobbleY

        // Wrap around edges instead of bouncing
        if (particle.x < 0) particle.x = canvas.offsetWidth
        if (particle.x > canvas.offsetWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvas.offsetHeight
        if (particle.y > canvas.offsetHeight) particle.y = 0

        // Draw particle with soft edges
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        const color = particle.scent.color || '#000000'
        gradient.addColorStop(0, `${color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${color}00`)
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
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

