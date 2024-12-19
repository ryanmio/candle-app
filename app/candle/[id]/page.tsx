import { getCandleById } from '@/lib/supabase'
import { CandleDisplay } from '@/components/candle-display'
import { FeedbackForm } from '@/components/feedback-form'
import { AromaVisualization } from '@/components/aroma-visualization'
import { ScentDetails } from '@/components/scent-details'
import { AromatherapyRecommendation } from '@/components/aromatherapy-recommendation'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
  }>
}

function mapDatabaseCandle(candle: any) {
  return {
    ...candle,
    recipientName: candle.recipient_name
  }
}

export default async function CandlePage({ params }: Props) {
  const { id } = await params
  const dbCandle = await getCandleById(id)

  if (!dbCandle) {
    notFound()
  }

  const candle = mapDatabaseCandle(dbCandle)

  return (
    <main 
      className="min-h-screen w-full transition-colors duration-500"
      style={{ 
        backgroundColor: `color-mix(in srgb, ${candle.color} 10%, white)`,
      }}
    >
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <CandleDisplay candle={candle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AromaVisualization scents={candle.scents} />
          <ScentDetails scents={candle.scents} />
        </div>
        <AromatherapyRecommendation candle={candle} />
        <FeedbackForm candleId={candle.id} scents={candle.scents} />
      </div>
    </main>
  )
}

