import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface Candle {
  id: string
  name: string
  recipientName: string
  color: string
  imageUrl?: string
}

export function CandleDisplay({ candle }: { candle: Candle }) {
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 md:flex md:items-center md:space-x-6">
        <div className="relative aspect-square w-48 mx-auto mb-4 md:mb-0 md:w-64">
          <div 
            className="absolute inset-0 rounded-full shadow-lg"
            style={{ backgroundColor: candle.color }}
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1 h-4 bg-amber-400 animate-flicker" />
        </div>
        
        <div className="text-center md:text-left md:flex-1">
          <h1 className="text-3xl font-serif mb-2">{candle.name}</h1>
          <p className="text-muted-foreground mb-1">made with love for</p>
          <p className="text-2xl font-light mb-4">{candle.recipientName}</p>
          
          {candle.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={candle.imageUrl}
                alt="Candle making process"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

