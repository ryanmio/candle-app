import { Card } from '@/components/ui/card'

// Function to determine if a color is light or dark
function isLightColor(color: string) {
  // Convert color to RGB
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith('rgb')) {
    [r, g, b] = color.match(/\d+/g)!.map(Number);
  } else {
    return true; // Default to light for unknown formats
  }
  
  // Calculate relative luminance using a lower threshold for better handling of medium colors
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65; // Increased threshold to better identify medium-dark colors
}

interface Candle {
  id: string
  name: string
  recipientName: string
  color: string
  imageUrl?: string
}

export function CandleDisplay({ candle, compact = false }: { candle: Candle, compact?: boolean }) {
  const textColor = isLightColor(candle.color) ? 'text-neutral-500' : 'text-white';

  if (compact) {
    return (
      <div className="relative group">
        <div className="relative aspect-[1/1.1] w-full">
          {/* Candle body */}
          <div 
            className="absolute inset-x-0 bottom-0 top-0 rounded-[32px] transition-all duration-1000 ease-in-out
                       group-hover:opacity-95 group-hover:translate-y-[2px]
                       after:absolute after:inset-0 after:rounded-[32px]
                       after:shadow-[inset_0_4px_20px_rgba(255,255,255,0.2),inset_0_-4px_20px_rgba(0,0,0,0.05)]
                       before:absolute before:inset-0 before:rounded-[32px] before:mix-blend-soft-light
                       before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),rgba(255,255,255,0))]"
            style={{ 
              backgroundColor: candle.color,
              boxShadow: `0 4px 24px -12px ${candle.color}80`
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-black/5" />
          </div>
          {/* Minimal wick */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-6 origin-bottom
                         bg-gradient-to-b from-transparent via-neutral-300 to-neutral-400" />
          {/* Minimal flame */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[6px] h-[8px]
                         bg-amber-50/70 rounded-full blur-[3px]
                         animate-[glow_4s_ease-in-out_infinite_alternate]
                         before:absolute before:inset-0 before:-z-10 before:blur-[8px] before:bg-amber-50/40" />
        </div>
        {/* Name - always visible */}
        <div className="absolute -bottom-14 left-0 right-0 text-center">
          <p className="text-base tracking-[0.2em] text-neutral-500 font-light px-2
                       [text-wrap:balance]">
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
                     after:shadow-[inset_0_4px_20px_rgba(255,255,255,0.2),inset_0_-4px_20px_rgba(0,0,0,0.05)]
                     before:absolute before:inset-0 before:rounded-[48px] before:mix-blend-soft-light
                     before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),rgba(255,255,255,0))]"
          style={{ 
            backgroundColor: candle.color,
            boxShadow: `0 4px 24px -12px ${candle.color}80`
          }}
        >
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-white/10 via-transparent to-black/5" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[2px] h-9 origin-bottom
                       bg-gradient-to-b from-transparent via-neutral-300 to-neutral-400" />
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[8px] h-[12px]
                       bg-amber-50/70 rounded-full blur-[4px]
                       animate-[glow_4s_ease-in-out_infinite_alternate]
                       before:absolute before:inset-0 before:-z-10 before:blur-[10px] before:bg-amber-50/40" />
        
        <div className="absolute inset-x-0 bottom-8 text-center">
          <h1 className="text-4xl tracking-[0.05em] font-light mb-3 text-neutral-700">{candle.name}</h1>
          <p className={`text-sm tracking-[0.2em] ${textColor}`}>for {candle.recipientName}</p>
        </div>
      </div>
    </div>
  )
}

