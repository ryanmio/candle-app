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
    <main className="min-h-screen w-full bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-baseline mb-24">
          <h1 className="text-2xl tracking-tight text-neutral-800">candle collection</h1>
          <Link 
            href="/create" 
            className="text-sm tracking-wide text-neutral-400 hover:text-neutral-800 transition-colors duration-500"
          >
            + new candle
          </Link>
        </div>
        
        {/* Shelf */}
        <div className="relative">
          {/* Candles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-12 pb-12">
            {candles.map((candle) => (
              <Link 
                key={candle.id} 
                href={`/candle/${candle.id}`}
                className="w-full"
              >
                <CandleDisplay candle={candle} compact />
              </Link>
            ))}
          </div>
          {/* Minimal shelf line */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-neutral-200" />
        </div>
      </div>
    </main>
  )
}

