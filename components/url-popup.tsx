import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

interface UrlPopupProps {
  url: string
  onClose: () => void
  onView: () => void
}

export function UrlPopup({ url, onClose, onView }: UrlPopupProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Alert className="max-w-md w-full bg-white relative">
        <AlertDescription className="flex flex-col gap-4">
          <div className="text-sm">
            Your candle has been created! Here's the link:
          </div>
          <div className="flex items-center gap-2 bg-neutral-100 p-2 rounded">
            <div className="flex-1 truncate text-sm">
              {url}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onView}>
              View Candle
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
} 