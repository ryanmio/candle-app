'use client'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center gap-8 p-4 bg-white">
      <div className="relative w-32 h-48">
        <div 
          className="absolute inset-0 animate-pulse rounded-lg"
          style={{
            background: 'linear-gradient(45deg, #FFE4B5dd, #FFE4B5aa)',
            boxShadow: '0 4px 24px #FFE4B566'
          }}
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-800 animate-flicker"
        />
      </div>
      
      <div className="text-center text-2xl font-light opacity-80 animate-fade-in">
        Loading...
      </div>
    </div>
  )
} 