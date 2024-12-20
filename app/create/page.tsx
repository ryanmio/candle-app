'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type Candle } from '@/types/candle'
import { UrlPopup } from '@/components/url-popup'

export default function CreateCandlePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Candle>>({
    name: '',
    recipient_name: '',
    color: '#ffffff',
    scents: [{ name: '', description: '', intensity: 0.5 }],
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUrlPopup, setShowUrlPopup] = useState(false)
  const [candleUrl, setCandleUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()

      if (response.ok) {
        if (data.id) {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
          const url = `${baseUrl}/candle/${data.id}`
          setCandleUrl(url)
          setShowUrlPopup(true)
        } else {
          setError('Invalid candle data received')
        }
      } else {
        setError(data.error || 'Failed to create candle')
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Error creating candle:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleScentChange = (index: number, field: string, value: string | number) => {
    const newScents = [...formData.scents!]
    newScents[index] = { ...newScents[index], [field]: value }
    setFormData({ ...formData, scents: newScents })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Candle</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Candle Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input id="recipient_name" name="recipient_name" value={formData.recipient_name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="color">Candle Color</Label>
              <Input id="color" name="color" type="color" value={formData.color} onChange={handleChange} required />
            </div>
            {formData.scents!.map((scent, index) => (
              <div key={index} className="space-y-2">
                <Input 
                  placeholder="Scent Name" 
                  value={scent.name} 
                  onChange={(e) => handleScentChange(index, 'name', e.target.value)} 
                  required 
                />
                <Input 
                  placeholder="Scent Description" 
                  value={scent.description} 
                  onChange={(e) => handleScentChange(index, 'description', e.target.value)} 
                  required 
                />
                <Input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={scent.intensity} 
                  onChange={(e) => handleScentChange(index, 'intensity', parseFloat(e.target.value))} 
                  required 
                />
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setFormData({ ...formData, scents: [...formData.scents!, { name: '', description: '', intensity: 0.5 }] })}
            >
              Add Scent
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Candle'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {showUrlPopup && (
        <UrlPopup 
          url={candleUrl} 
          onClose={() => setShowUrlPopup(false)}
          onView={() => {
            setShowUrlPopup(false)
            router.push(candleUrl)
          }}
        />
      )}
    </main>
  )
}

