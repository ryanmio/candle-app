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
  const [formData, setFormData] = useState<{
    name: string;
    recipient_name: string;
    color: string;
    scents: Array<{
      name: string;
      description: string;
      intensity: number;
      color: string;
    }>;
    aromatherapy_description?: string;
    recommended_uses?: string[];
  }>({
    name: '',
    recipient_name: '',
    color: '#ffffff',
    scents: [{ name: '', description: '', intensity: 0.5, color: '#ffffff' }],
    aromatherapy_description: '',
    recommended_uses: [],
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
    const value = e.target.type === 'text' ? e.target.value :
                 e.target.type === 'color' ? e.target.value :
                 e.target.value;
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleScentChange = (index: number, field: keyof typeof formData.scents[0], value: string | number) => {
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
            <div>
              <Label htmlFor="aromatherapy_description">Aromatherapy Description (Optional)</Label>
              <Input 
                id="aromatherapy_description" 
                name="aromatherapy_description" 
                value={formData.aromatherapy_description} 
                onChange={handleChange} 
                placeholder="Describe the aromatherapy benefits..."
              />
            </div>
            <div>
              <Label>Recommended Uses (Optional)</Label>
              <div className="flex gap-2 flex-wrap">
                <Input 
                  placeholder="Add recommended use and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          recommended_uses: [...(prev.recommended_uses || []), input.value.trim()]
                        }));
                        input.value = '';
                      }
                    }
                  }}
                />
                {formData.recommended_uses?.map((use, index) => (
                  <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                    {use}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          recommended_uses: prev.recommended_uses?.filter((_, i) => i !== index)
                        }));
                      }}
                      className="ml-1 text-sm hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {formData.scents!.map((scent, index) => (
              <div key={index} className="space-y-2 p-4 border rounded">
                <Label>Scent {index + 1}</Label>
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
                <div>
                  <Label>Intensity</Label>
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
                <div>
                  <Label>Scent Color</Label>
                  <Input 
                    type="color" 
                    value={scent.color} 
                    onChange={(e) => handleScentChange(index, 'color', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setFormData({ ...formData, scents: [...formData.scents!, { name: '', description: '', intensity: 0.5, color: '#ffffff' }] })}
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

