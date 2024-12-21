import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.recipient_name || !data.color || !data.scents || !Array.isArray(data.scents)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate scents
    if (!data.scents.every((scent: any) => 
      scent.name && 
      scent.description && 
      typeof scent.intensity === 'number' && 
      scent.color
    )) {
      return NextResponse.json(
        { error: 'Invalid scent data' },
        { status: 400 }
      )
    }

    // Update the candle
    const { error } = await supabase
      .from('candles')
      .update({
        name: data.name,
        recipient_name: data.recipient_name,
        color: data.color,
        scents: data.scents,
        aromatherapy_description: data.aromatherapy_description || null,
        recommended_uses: data.recommended_uses || [],
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating candle:', error)
      return NextResponse.json(
        { error: 'Failed to update candle' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/candles/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 