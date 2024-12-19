'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Scent {
  name: string
  description: string
  intensity: number
}

export function FeedbackForm({ 
  candleId, 
  scents 
}: { 
  candleId: string
  scents: Scent[]
}) {
  const [scentFeedback, setScentFeedback] = useState<Record<string, number>>(
    Object.fromEntries(scents.map(s => [s.name, 0.5]))
  )
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-medium mb-2">Thank you for your feedback!</h3>
          <p className="text-muted-foreground">
            Your input helps me create better candles.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {scents.map((scent) => (
            <div key={scent.name} className="space-y-2">
              <Label className="text-lg">
                How strong is the {scent.name.toLowerCase()} scent?
              </Label>
              <Slider
                value={[scentFeedback[scent.name]]}
                onValueChange={([value]) => 
                  setScentFeedback(prev => ({ ...prev, [scent.name]: value }))
                }
                max={1}
                step={0.1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Too Light</span>
                <span>Perfect</span>
                <span>Too Strong</span>
              </div>
            </div>
          ))}
          
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-lg">Additional Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the candle..."
              className="resize-none"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

