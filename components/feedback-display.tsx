"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFeedbackForCandle } from '@/lib/supabase'

interface FeedbackDisplayProps {
  candleId: string
  onBack: () => void
}

interface ScentFeedbackSummary {
  name: string
  avgIntensity: number
  count: number
}

function calculateScentAverages(feedback: any[]): ScentFeedbackSummary[] {
  const scentTotals: Record<string, { total: number; count: number }> = {}

  feedback.forEach(item => {
    if (item.scent_feedback) {
      item.scent_feedback.forEach((sf: any) => {
        if (!scentTotals[sf.scent_name]) {
          scentTotals[sf.scent_name] = { total: 0, count: 0 }
        }
        scentTotals[sf.scent_name].total += sf.intensity
        scentTotals[sf.scent_name].count += 1
      })
    }
  })

  return Object.entries(scentTotals).map(([name, { total, count }]) => ({
    name,
    avgIntensity: total / count,
    count
  }))
}

export function FeedbackDisplay({ candleId, onBack }: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      const data = await getFeedbackForCandle(candleId)
      setFeedback(data || [])
      setLoading(false)
    }
    loadFeedback()
  }, [candleId])

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          Loading feedback...
        </CardContent>
      </Card>
    )
  }

  if (feedback.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-serif">Feedback</CardTitle>
          <button
            onClick={onBack}
            className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            Leave feedback
          </button>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          No feedback yet. Be the first to share your experience!
        </CardContent>
      </Card>
    )
  }

  const scentAverages = calculateScentAverages(feedback)

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-serif">Feedback</CardTitle>
        <button
          onClick={onBack}
          className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors"
        >
          Leave feedback
        </button>
      </CardHeader>
      <CardContent className="space-y-8">
        {scentAverages.map((scent) => (
          <div key={scent.name} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-medium">{scent.name}</span>
              <span className="text-sm text-muted-foreground">
                {scent.count} {scent.count === 1 ? 'rating' : 'ratings'}
              </span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden">
              {/* Background gradient line */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #ef4444 0%, #ef4444 20%, #22c55e 50%, #ef4444 80%, #ef4444 100%)'
                }}
              />
              {/* Average marker */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                style={{
                  left: `${scent.avgIntensity * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Too Light</span>
              <span>Perfect</span>
              <span>Too Strong</span>
            </div>
          </div>
        ))}
        
        {/* Comments section */}
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h3 className="text-lg font-medium">Recent Comments</h3>
          {feedback.filter(item => item.comment).slice(0, 3).map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {item.comment}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 