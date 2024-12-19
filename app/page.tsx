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
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-[1800px] mx-auto px-8 py-16 md:py-16 py-8">
        <div className="flex flex-col md:flex-row md:items-baseline mb-16 md:mb-32 gap-8 md:gap-0">
          <h1 className="text-xl tracking-[0.2em] text-neutral-400 font-light">candle collection</h1>
          <div className="md:ml-auto order-3 md:order-2">
            <Link 
              href="/create" 
              className="text-xs tracking-[0.2em] text-neutral-400 hover:text-neutral-800 
                       transition-colors duration-700"
            >
              + new candle
            </Link>
          </div>
          <div className="w-full h-px bg-neutral-100 order-2 md:hidden" />
        </div>
        
        <div className="relative">
          {/* Candles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                         gap-x-8 md:gap-x-16 gap-y-16 md:gap-y-24 pb-16">
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
          {/* Minimal shelf line with gradient */}
          <div className="absolute bottom-0 left-8 right-8 h-[1px] 
                         bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        </div>
      </div>
    </main>
  )
}

