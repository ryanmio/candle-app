import { getAllCandles } from '@/lib/supabase'
import { SearchBar } from '@/components/search-bar'
import { CandleCard } from '@/components/candle-card'
import Link from 'next/link'

function mapDatabaseCandle(candle: any) {
  return {
    ...candle,
    recipientName: candle.recipient_name
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const searchTerm = params.search?.toString()
  const dbCandles = await getAllCandles({ search: searchTerm })
  const candles = dbCandles.map(mapDatabaseCandle)

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-[1800px] mx-auto px-8 py-16 md:py-16 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline">
            <h1 className="text-xl tracking-[0.2em] text-neutral-400 font-light">candle collection</h1>
            <Link 
              href="/create" 
              className="text-xs tracking-[0.2em] text-neutral-400 hover:text-neutral-800 
                       transition-colors duration-700 mt-4 md:mt-0"
            >
              + new candle
            </Link>
          </div>
          <div className="max-w-sm">
            <SearchBar />
          </div>
        </div>
        
        <div className="relative mt-16">
          {/* Candles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                         gap-x-8 md:gap-x-16 gap-y-20 md:gap-y-24 pb-16">
            {candles.map((candle) => (
              <CandleCard key={candle.id} candle={candle} />
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

