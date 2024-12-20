import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckIcon, CopyIcon, DownloadIcon } from '@radix-ui/react-icons'
import { QRCodeSVG } from 'qrcode.react'
import { LuQrCode } from "react-icons/lu"

interface UrlPopupProps {
  url: string
  onClose: () => void
  onView: () => void
}

export function UrlPopup({ url, onClose, onView }: UrlPopupProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<SVGSVGElement>(null)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQR = () => {
    if (!qrRef.current) return

    // Create a canvas and draw the QR code
    const canvas = document.createElement('canvas')
    const svg = qrRef.current
    const box = svg.getBoundingClientRect()
    
    canvas.width = box.width
    canvas.height = box.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Convert SVG to data URL
    const data = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    // Create an image from the SVG
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      
      // Convert canvas to PNG and download
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = 'candle-qr-code.png'
      a.click()
      
      // Cleanup
      URL.revokeObjectURL(url)
    }
    img.src = url
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQR(!showQR)}
              className="shrink-0"
              title="Show QR Code"
            >
              <LuQrCode className="h-4 w-4" />
            </Button>
          </div>
          {showQR && (
            <div className="flex flex-col items-center gap-4 p-4 bg-white rounded">
              <QRCodeSVG ref={qrRef} value={url} size={200} />
              <Button
                variant="outline"
                size="sm"
                onClick={downloadQR}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Save QR Code
              </Button>
            </div>
          )}
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