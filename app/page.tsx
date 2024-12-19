import { getAllCandles } from '@/lib/supabase'
import { CandleDisplay } from '@/components/candle-display'
import Link from 'next/link'

function mapDatabaseCandle(candle: any) {
  return {
    ...candle,
    recipientName: candle.recipient_name
  }
}

export default async function HomePage() {
  const dbCandles = await getAllCandles()
  const candles = dbCandles.map(mapDatabaseCandle)

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Candle Collection</h1>
          <Link 
            href="/create" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Create New Candle
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candles.map((candle) => (
            <Link 
              key={candle.id} 
              href={`/candle/${candle.id}`}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <div 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${candle.color} 10%, white)`,
                }}
              >
                <CandleDisplay candle={candle} compact />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

