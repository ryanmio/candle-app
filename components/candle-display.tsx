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
        <div className="relative aspect-[1/1.8] w-full">
          {/* Candle body */}
          <div 
            className="absolute inset-x-0 bottom-0 top-2 rounded-2xl transition-all duration-700 ease-out
                       group-hover:rounded-3xl group-hover:opacity-90"
            style={{ backgroundColor: candle.color }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50" />
          </div>
          {/* Minimal wick */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-px h-1 bg-black/20" />
          {/* Minimal flame */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-amber-100 
                         rounded-full shadow-lg shadow-amber-200/50
                         animate-[glow_3s_ease-in-out_infinite]" />
        </div>
        {/* Elegant hover name */}
        <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 
                       group-hover:opacity-100 transition-opacity duration-700 ease-out">
          <p className="text-xs tracking-wide uppercase text-neutral-400">
            {candle.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-12">
      <div className="relative aspect-square max-w-sm mx-auto">
        <div 
          className="absolute inset-0 rounded-3xl shadow-sm"
          style={{ backgroundColor: candle.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-px h-2 bg-black/20" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-100 
                       rounded-full shadow-lg shadow-amber-200/50
                       animate-[glow_3s_ease-in-out_infinite]" />
        
        <div className="absolute inset-x-0 bottom-0 p-8 text-center">
          <h1 className="text-2xl tracking-wide mb-2">{candle.name}</h1>
          <p className="text-sm tracking-widest uppercase text-neutral-500">for {candle.recipientName}</p>
        </div>
      </div>
    </div>
  )
}

