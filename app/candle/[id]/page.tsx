import { getCandleById } from '@/lib/supabase'
import { CandleDisplay } from '@/components/candle-display'
import { AromaVisualization } from '@/components/aroma-visualization'
import { ScentDetails } from '@/components/scent-details'
import { AromatherapyRecommendation } from '@/components/aromatherapy-recommendation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CandleFeedback } from './feedback'

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
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

function mapDatabaseCandle(candle: any) {
  return {
    ...candle,
    recipientName: candle.recipient_name
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CandlePage({ params }: PageProps) {
  const { id } = await params
  const dbCandle = await getCandleById(id)

  if (!dbCandle) {
    notFound()
  }

  const candle = mapDatabaseCandle(dbCandle)
  const bgColor = `color-mix(in srgb, ${candle.color} 10%, white)`
  const textColor = isLightColor(candle.color) ? 'text-gray-800' : 'text-gray-100'

  return (
    <main 
      className={`min-h-screen w-full transition-colors duration-500 ${textColor}`}
      style={{ 
        backgroundColor: bgColor,
      }}
    >
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <CandleDisplay candle={candle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AromaVisualization scents={candle.scents} />
          <ScentDetails scents={candle.scents} />
        </div>
        <AromatherapyRecommendation candle={candle} />
        <CandleFeedback candleId={candle.id} scents={candle.scents} />
        <div className="text-center pt-8">
          <Link 
            href="/create" 
            className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            create your own candle
          </Link>
        </div>
      </div>
    </main>
  )
}

