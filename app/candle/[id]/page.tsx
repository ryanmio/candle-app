import { getCandleById } from '@/lib/supabase'
import { CandleDisplay } from '@/components/candle-display'
import { FeedbackForm } from '@/components/feedback-form'
import { AromaVisualization } from '@/components/aroma-visualization'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function CandlePage({ params }: Props) {
  const { id } = await params
  const candle = await getCandleById(id)

  if (!candle) {
    notFound()
  }

  return (
    <main 
      className="min-h-screen w-full transition-colors duration-500"
      style={{ 
        backgroundColor: `color-mix(in srgb, ${candle.color} 10%, white)`,
      }}
    >
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <CandleDisplay candle={candle} />
        <AromaVisualization scents={candle.scents} />
        <FeedbackForm candleId={candle.id} scents={candle.scents} />
      </div>
    </main>
  )
}

