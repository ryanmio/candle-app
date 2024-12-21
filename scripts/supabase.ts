import { createClient } from '@supabase/supabase-js'
import { type Candle, type Feedback } from '../types/candle'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables check:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set')
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with URL:', supabaseUrl)
export const supabase = createClient(supabaseUrl, supabaseKey)

interface FilterOptions {
  search?: string;
}

export async function getAllCandles(filters?: FilterOptions) {
  console.log('Fetching all candles...')
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
    console.error('Error fetching candles:', error)
    return []
  }

  console.log(`Successfully fetched ${data?.length || 0} candles`)
  return data || []
} 