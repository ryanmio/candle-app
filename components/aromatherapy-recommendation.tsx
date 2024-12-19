import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type Candle } from '@/types/candle'

export function AromatherapyRecommendation({ candle }: { candle: Candle }) {
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <h2 className="text-2xl tracking-tight text-neutral-500 font-light">aromatherapy guide</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm tracking-wide text-neutral-500 leading-relaxed">
          {candle.aromatherapy_description || 
            "This carefully crafted blend is designed to create a balanced and harmonious atmosphere. Light this candle when you want to enhance your space with natural aromatherapy benefits."}
        </p>
        
        <div className="pt-2">
          <h3 className="text-sm tracking-wider text-neutral-400 uppercase mb-2">Perfect for</h3>
          <div className="flex flex-wrap gap-2">
            {candle.recommended_uses?.map((use) => (
              <div 
                key={use}
                className="px-3 py-1 rounded-full bg-neutral-50 text-sm text-neutral-500"
              >
                {use}
              </div>
            )) || defaultRecommendedUses.map((use) => (
              <div 
                key={use}
                className="px-3 py-1 rounded-full bg-neutral-50 text-sm text-neutral-500"
              >
                {use}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const defaultRecommendedUses = [
  "Evening relaxation",
  "Meditation",
  "Gentle ambiance"
] 