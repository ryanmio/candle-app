'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ColorInput } from '@/components/ui/color-input'
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
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-3xl font-semibold">Create a New Candle</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Candle Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="transition-colors focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_name" className="text-sm font-medium">Recipient Name</Label>
                  <Input 
                    id="recipient_name" 
                    name="recipient_name" 
                    value={formData.recipient_name} 
                    onChange={handleChange} 
                    required 
                    className="transition-colors focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-medium">Candle Color</Label>
                <ColorInput
                  value={formData.color}
                  onChange={(color) => setFormData(prev => ({ ...prev, color }))}
                />
              </div>
            </div>

            {/* Optional Information Section */}
            <div className="space-y-6 pt-4 border-t">
              <h3 className="text-lg font-medium text-primary/80">Additional Details</h3>
              <div className="space-y-2">
                <Label htmlFor="aromatherapy_description" className="text-sm font-medium">
                  Aromatherapy Description <span className="text-sm text-muted-foreground">(Optional)</span>
                </Label>
                <textarea 
                  id="aromatherapy_description" 
                  name="aromatherapy_description" 
                  value={formData.aromatherapy_description} 
                  onChange={(e) => handleChange(e as any)} 
                  placeholder="e.g., 'Promotes deep relaxation and stress relief through calming lavender notes, perfect for evening meditation and unwinding after a long day.'

or

'Energizing blend that enhances focus and mental clarity, combining citrus and mint notes for an invigorating atmosphere.'"
                  className="w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Recommended Uses <span className="text-sm text-muted-foreground">(Optional)</span>
                </Label>
                <div className="space-y-3">
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
                    className="transition-colors focus:border-primary"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {formData.recommended_uses?.map((use, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-full text-sm">
                        {use}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              recommended_uses: prev.recommended_uses?.filter((_, i) => i !== index)
                            }));
                          }}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scents Section */}
            <div className="space-y-6 pt-4 border-t">
              <h3 className="text-lg font-medium text-primary/80">Scent Profile</h3>
              <div className="space-y-6">
                {formData.scents.map((scent, index) => (
                  <div key={index} className="p-6 rounded-lg bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Scent {index + 1}</Label>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              scents: prev.scents.filter((_, i) => i !== index)
                            }))
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm">Name</Label>
                        <Input 
                          placeholder="e.g., Vanilla" 
                          value={scent.name} 
                          onChange={(e) => handleScentChange(index, 'name', e.target.value)} 
                          required 
                          className="transition-colors focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Description</Label>
                        <Input 
                          placeholder="e.g., Sweet and creamy" 
                          value={scent.description} 
                          onChange={(e) => handleScentChange(index, 'description', e.target.value)} 
                          required 
                          className="transition-colors focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm">Intensity (1-10)</Label>
                        <Input 
                          type="range" 
                          min="1" 
                          max="10" 
                          step="1" 
                          value={Math.round(scent.intensity * 10)} 
                          onChange={(e) => handleScentChange(index, 'intensity', parseFloat(e.target.value) / 10)} 
                          required 
                          className="flex-grow accent-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Color</Label>
                        <Input 
                          type="color" 
                          value={scent.color} 
                          onChange={(e) => handleScentChange(index, 'color', e.target.value)} 
                          required 
                          className="w-full h-10 p-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setFormData({ 
                  ...formData, 
                  scents: [...formData.scents, { name: '', description: '', intensity: 0.5, color: '#ffffff' }] 
                })}
                className="w-full"
                disabled={formData.scents.length >= 4}
              >
                {formData.scents.length >= 4 ? 'Maximum Scents Reached' : 'Add Another Scent'}
              </Button>
            </div>

            <div className="pt-6 border-t">
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-medium" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Candle'}
              </Button>
            </div>
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

