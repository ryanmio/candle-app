import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Scent {
  name: string
  description: string
  intensity: number
}

export function AromaVisualization({ scents }: { scents: Scent[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Aromatherapy Benefits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {scents.map((scent) => (
          <div key={scent.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{scent.name}</h3>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${scent.intensity * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(scent.intensity * 100)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{scent.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

