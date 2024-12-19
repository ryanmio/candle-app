import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-light mb-4">Candle Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, we couldn't find the candle you're looking for.
      </p>
      <Link 
        href="/"
        className="text-lg underline hover:text-gray-600 transition-colors"
      >
        View All Candles
      </Link>
    </div>
  )
} 