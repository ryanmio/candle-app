"use client"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Camera, Pipette } from "lucide-react"

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile('ontouchstart' in window)
  }, [])

  const openEyeDropper = async () => {
    if ('EyeDropper' in window) {
      // @ts-ignore - EyeDropper API is not yet in TypeScript
      const eyeDropper = new window.EyeDropper()
      try {
        const result = await eyeDropper.open()
        onChange(result.sRGBHex)
      } catch (e) {
        // User canceled the eye dropper
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            // Get the center pixel color
            const pixel = ctx.getImageData(Math.floor(img.width/2), Math.floor(img.height/2), 1, 1).data
            const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')
            onChange(hex)
          }
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button 
            type="button"
            className="w-10 h-10 rounded-md border shadow-sm transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 border-0" align="start">
          <div className="space-y-4">
            <HexColorPicker color={value} onChange={onChange} />
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">#</div>
              <Input
                value={value.replace('#', '')}
                onChange={(e) => {
                  const newValue = e.target.value
                  if (/^[A-Fa-f0-9]{0,6}$/.test(newValue)) {
                    onChange(`#${newValue.toLowerCase()}`)
                  }
                }}
                className="h-8 px-0 font-mono text-sm uppercase bg-transparent border-0 focus-visible:ring-0"
                maxLength={6}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {isMobile ? (
        <label className="w-10 h-10 flex items-center justify-center rounded-md border cursor-pointer transition-colors hover:bg-accent">
          <Camera className="h-4 w-4" />
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleImageUpload}
            className="sr-only" 
          />
        </label>
      ) : (
        <button
          type="button"
          onClick={openEyeDropper}
          className="w-10 h-10 flex items-center justify-center rounded-md border transition-colors hover:bg-accent"
          title="Pick color from screen"
        >
          <Pipette className="h-4 w-4" />
        </button>
      )}
    </div>
  )
} 