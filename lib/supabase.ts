import { createClient } from '@supabase/supabase-js'
import { type Candle, type Feedback } from '@/types/candle'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getCandleById(id: string): Promise<Candle | null> {
  try {
    if (!id) throw new Error('Candle ID is required')

    const { data, error } = await supabase
      .from('candles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching candle:', error)
      return null
    }
    
    if (!data) {
      console.error('No candle found with ID:', id)
      return null
    }
    
    return data as Candle
  } catch (error) {
    console.error('Error in getCandleById:', error)
    return null
  }
}

interface FilterOptions {
  search?: string;
}

export async function getAllCandles(filters?: FilterOptions) {
  let query = supabase
    .from('candles')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    query = query.or(`name.ilike.%${searchTerm}%,recipient_name.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error:', error)
    return []
  }

  return data || []
}

export async function createCandle(candle: Omit<Candle, 'id' | 'createdAt'>): Promise<Candle | null> {
  try {
    if (!candle.name || !candle.recipient_name || !candle.color || !Array.isArray(candle.scents)) {
      throw new Error('Invalid candle data: missing required fields')
    }

    const { data, error } = await supabase
      .from('candles')
      .insert(candle)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating candle:', error)
      throw new Error(`Failed to create candle: ${error.message}`)
    }
    
    if (!data) {
      throw new Error('No data returned from Supabase after candle creation')
    }
    
    return data as Candle
  } catch (error) {
    console.error('Error in createCandle:', error)
    throw error
  }
}

export async function submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback | null> {
  try {
    if (!feedback.candle_id || !feedback.scent_feedback) {
      throw new Error('Invalid feedback data: missing required fields')
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert(feedback)
      .select()
      .single()
    
    if (error) {
      console.error('Error submitting feedback:', error)
      return null
    }
    
    return data as Feedback
  } catch (error) {
    console.error('Error in submitFeedback:', error)
    return null
  }
}

export async function getCandleBasicInfo(id: string) {
  try {
    if (!id) throw new Error('Candle ID is required')

    const { data, error } = await supabase
      .from('candles')
      .select('name, color, recipient_name')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching basic candle info:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getCandleBasicInfo:', error)
    return null
  }
}

export async function getFeedbackForCandle(candleId: string): Promise<Feedback[]> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('candle_id', candleId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feedback:', error)
      return []
    }

    return data as Feedback[]
  } catch (error) {
    console.error('Error in getFeedbackForCandle:', error)
    return []
  }
}

