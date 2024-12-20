"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-300" />
      <Input
        type="search"
        placeholder="Search by name or recipient..."
        className="pl-7 border-0 border-b border-neutral-200 rounded-none bg-transparent placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-neutral-400 transition-colors"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
} 