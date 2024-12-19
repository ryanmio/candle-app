import { Card } from '@/components/ui/card'

interface Candle {
  id: string
  name: string
  recipientName: string
  color: string
  imageUrl?: string
}

export function CandleDisplay({ candle, compact = false }: { candle: Candle, compact?: boolean }) {
  if (compact) {
    return (
      <div className="relative group">
        <div className="relative aspect-[1/1.1] w-full">
          {/* Candle body */}
          <div 
            className="absolute inset-x-0 bottom-0 top-0 rounded-[32px] transition-all duration-1000 ease-in-out
                       group-hover:opacity-95 group-hover:translate-y-[2px]
                       after:absolute after:inset-0 after:rounded-[32px]
                       after:shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: candle.color }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/10 via-transparent to-black/5" />
          </div>
          {/* Minimal wick */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-6 origin-bottom
                         bg-gradient-to-b from-transparent via-neutral-300 to-neutral-400" />
          {/* Minimal flame */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px]
                         bg-amber-50/90 rounded-full blur-[1px]
                         animate-[glow_4s_ease-in-out_infinite_alternate]
                         before:absolute before:inset-0 before:-z-10 before:blur-md before:bg-amber-50/50" />
        </div>
        {/* Elegant hover name - hidden on mobile, shown on hover for desktop */}
        <div className="absolute -bottom-10 left-0 right-0 text-center 
                       md:opacity-0 md:group-hover:opacity-100 transition-all duration-1000 ease-in-out
                       md:group-hover:-translate-y-1">
          <p className="text-base tracking-[0.2em] text-neutral-500 font-light
                       opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            {candle.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-16">
      <div className="relative aspect-square max-w-sm mx-auto">
        <div 
          className="absolute inset-0 rounded-[48px] transition-all duration-1000
                     after:absolute after:inset-0 after:rounded-[48px]
                     after:shadow-[inset_0_0_60px_rgba(0,0,0,0.1)]"
          style={{ backgroundColor: candle.color }}
        >
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-b from-white/10 via-transparent to-black/5" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[2px] h-9 origin-bottom
                       bg-gradient-to-b from-transparent via-neutral-300 to-neutral-400" />
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[4px] h-[4px]
                       bg-amber-50/90 rounded-full blur-[1px]
                       animate-[glow_4s_ease-in-out_infinite_alternate]
                       before:absolute before:inset-0 before:-z-10 before:blur-md before:bg-amber-50/50" />
        
        <div className="absolute inset-x-0 bottom-0 p-12 text-center">
          <h1 className="text-4xl tracking-[0.05em] font-light mb-3 text-neutral-700">{candle.name}</h1>
          <p className="text-sm tracking-[0.2em] text-neutral-500">for {candle.recipientName}</p>
        </div>
      </div>
    </div>
  )
}

