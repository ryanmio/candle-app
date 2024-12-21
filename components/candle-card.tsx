'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CandleDisplay } from '@/components/candle-display'
import { UrlPopup } from '@/components/url-popup'
import { LuShare2, LuPencil } from "react-icons/lu"
import { useLongPress } from 'use-long-press'

interface CandleCardProps {
  candle: {
    id: string
    name: string
    recipientName: string
    color: string
    imageUrl?: string
  }
}

export function CandleCard({ candle }: CandleCardProps) {
  const [showShare, setShowShare] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const handleShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const url = `${baseUrl}/candle/${candle.id}`
    setShareUrl(url)
    setShowShare(true)
  }

  const bind = useLongPress(() => {
    setShowActions(true)
  }, {
    onCancel: () => {
      // Only navigate if we're not showing actions
      if (!showActions) {
        window.location.href = `/candle/${candle.id}`
      }
    },
    threshold: 500, // ms
    cancelOnMovement: true,
  })

  return (
    <div className="relative group">
      {/* Candle display with long press binding */}
      <div {...bind()} className="block">
        <CandleDisplay candle={candle} compact />
      </div>

      {/* Mobile action menu */}
      {showActions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
             onClick={() => setShowActions(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-xs"
               onClick={e => e.stopPropagation()}>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowActions(false)
                  handleShare()
                }}
                className="w-full flex items-center gap-2 p-3 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <LuShare2 className="h-4 w-4" />
                Share
              </button>
              <Link
                href={`/candle/${candle.id}/edit`}
                className="w-full flex items-center gap-2 p-3 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <LuPencil className="h-4 w-4" />
                Edit
              </Link>
              <Link
                href={`/candle/${candle.id}`}
                className="w-full flex items-center gap-2 p-3 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop hover actions */}
      <div className="absolute -bottom-8 left-0 right-0 hidden md:flex justify-center gap-4
                    opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={handleShare}
          className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors
                   flex items-center gap-1"
        >
          <LuShare2 className="h-4 w-4" />
          Share
        </button>
        <Link
          href={`/candle/${candle.id}/edit`}
          className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors
                   flex items-center gap-1"
        >
          <LuPencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      {showShare && (
        <UrlPopup
          url={shareUrl}
          onClose={() => setShowShare(false)}
          onView={() => {
            setShowShare(false)
            window.location.href = shareUrl
          }}
        />
      )}
    </div>
  )
} 