'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Candle page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-light mb-4">Something Went Wrong</h2>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, we encountered an error while loading this candle.
      </p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="text-lg underline hover:text-gray-600 transition-colors"
        >
          Try Again
        </button>
        <Link 
          href="/"
          className="text-lg underline hover:text-gray-600 transition-colors"
        >
          View All Candles
        </Link>
      </div>
    </div>
  )
} 