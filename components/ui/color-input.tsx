"use client"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Pipette } from "lucide-react"

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('EyeDropper' in window)
  }, [])

  const openEyeDropper = async () => {
    // @ts-ignore - EyeDropper API is not yet in TypeScript
    const eyeDropper = new window.EyeDropper()
    try {
      const result = await eyeDropper.open()
      onChange(result.sRGBHex)
    } catch (e) {
      // User canceled the eye dropper
    }
  }

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <button 
            type="button"
            className="flex items-center gap-2 px-3 h-10 rounded-l-md border border-r-0 hover:bg-accent transition-colors"
          >
            <div 
              className="w-4 h-4 rounded-sm border shadow-sm" 
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm">
              {value.toUpperCase()}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-0" align="start">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
      {isSupported && (
        <button
          type="button"
          onClick={openEyeDropper}
          className="px-3 h-10 border rounded-r-md hover:bg-accent transition-colors"
          title="Pick color from screen"
        >
          <Pipette className="h-4 w-4" />
        </button>
      )}
    </div>
  )
} 