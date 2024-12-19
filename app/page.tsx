import { CandleDisplay } from '@/components/candle-display'
import { AromaVisualization } from '@/components/aroma-visualization'
import { FeedbackForm } from '@/components/feedback-form'

// Placeholder data
const candleData = {
  id: '1',
  name: 'Serenity',
  recipientName: 'Emma',
  color: '#E6D3A3',
  scents: [
    { name: 'Lavender', description: 'Calming and relaxing', intensity: 0.7 },
    { name: 'Vanilla', description: 'Sweet and comforting', intensity: 0.5 },
    { name: 'Sandalwood', description: 'Grounding and earthy', intensity: 0.3 },
  ],
  imageUrl: '/placeholder.svg?height=400&width=600',
}

export default function CandlePage() {
  return (
    <main className="min-h-screen w-full transition-colors duration-500" style={{ 
      backgroundColor: `color-mix(in srgb, ${candleData.color} 10%, white)`,
    }}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <CandleDisplay candle={candleData} />
        <AromaVisualization scents={candleData.scents} />
        <FeedbackForm candleId={candleData.id} scents={candleData.scents} />
      </div>
    </main>
  )
}

