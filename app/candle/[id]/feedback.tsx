'use client'

import { useState } from 'react'
import { FeedbackForm } from '@/components/feedback-form'
import { FeedbackDisplay } from '@/components/feedback-display'
import Link from 'next/link'

interface CandleFeedbackProps {
  candleId: string
  scents: Array<{
    name: string
    description: string
    intensity: number
    color: string
  }>
}

export function CandleFeedback({ candleId, scents }: CandleFeedbackProps) {
  const [showingFeedback, setShowingFeedback] = useState(false)

  return (
    <div className="space-y-4">
      {showingFeedback ? (
        <FeedbackDisplay 
          candleId={candleId} 
          onBack={() => setShowingFeedback(false)} 
        />
      ) : (
        <FeedbackForm 
          candleId={candleId} 
          scents={scents} 
          onViewFeedback={() => setShowingFeedback(true)}
        />
      )}
    </div>
  )
} 