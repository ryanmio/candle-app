import { NextResponse } from 'next/server'
import { createCandle, getAllCandles } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const candle = await request.json()
    
    // Validate the candle data
    if (!candle.name || !candle.recipient_name || !candle.color || !Array.isArray(candle.scents) || candle.scents.length === 0) {
      return NextResponse.json({ error: 'Invalid candle data. Please fill all required fields.' }, { status: 400 })
    }

    const newCandle = await createCandle(candle)
    if (!newCandle) {
      return NextResponse.json({ error: 'Failed to create candle in the database.' }, { status: 500 })
    }
    return NextResponse.json(newCandle, { status: 201 })
  } catch (error) {
    console.error('Error creating candle:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unexpected error occurred while creating the candle.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const candles = await getAllCandles()
    return NextResponse.json(candles)
  } catch (error) {
    console.error('Error fetching candles:', error)
    return NextResponse.json({ error: 'Failed to fetch candles' }, { status: 500 })
  }
}

