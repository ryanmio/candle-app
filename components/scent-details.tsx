import { Card, CardContent } from '@/components/ui/card'
import { type Scent } from '@/types/candle'

export function ScentDetails({ scents }: { scents: Scent[] }) {
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-8">
          {scents.map((scent) => (
            <div key={scent.name} className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: scent.color || '#000000' }}
                />
                <h3 className="text-lg tracking-wide text-neutral-600 font-light">
                  {scent.name}
                </h3>
                <div className="ml-auto text-sm tracking-wider text-neutral-400 tabular-nums">
                  {Math.round(scent.intensity * 100)}%
                </div>
              </div>
              
              {/* Intensity bar */}
              <div className="relative h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${scent.intensity * 100}%`,
                    backgroundColor: scent.color || '#000000',
                    opacity: 0.3
                  }}
                />
              </div>

              {/* Description */}
              <p className="text-sm tracking-wide text-neutral-500 leading-relaxed">
                {scent.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 