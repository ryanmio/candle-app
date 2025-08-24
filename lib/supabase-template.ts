import { createClient } from '@supabase/supabase-js'
import { type GiftItem, type Feedback } from '@/types/gift-item'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getGiftItemById(id: string): Promise<GiftItem | null> {
  try {
    if (!id) throw new Error('Gift item ID is required')

    const { data, error } = await supabase
      .from('gift_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching gift item:', error)
      return null
    }
    
    if (!data) {
      console.error('No gift item found with ID:', id)
      return null
    }
    
    return data as GiftItem
  } catch (error) {
    console.error('Error in getGiftItemById:', error)
    return null
  }
}

interface FilterOptions {
  search?: string;
}

export async function getAllGiftItems(filters?: FilterOptions) {
  let query = supabase
    .from('gift_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    query = query.or(`name.ilike.%${searchTerm}%,recipient_name.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching gift items:', error)
    return []
  }

  return data || []
}

export async function createGiftItem(giftItem: Partial<GiftItem>): Promise<GiftItem | null> {
  try {
    const { data, error } = await supabase
      .from('gift_items')
      .insert([giftItem])
      .select()
      .single()

    if (error) {
      console.error('Error creating gift item:', error)
      return null
    }

    return data as GiftItem
  } catch (error) {
    console.error('Error in createGiftItem:', error)
    return null
  }
}

export async function updateGiftItem(id: string, updates: Partial<GiftItem>): Promise<GiftItem | null> {
  try {
    const { data, error } = await supabase
      .from('gift_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gift item:', error)
      return null
    }

    return data as GiftItem
  } catch (error) {
    console.error('Error in updateGiftItem:', error)
    return null
  }
}

export async function deleteGiftItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('gift_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gift item:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteGiftItem:', error)
    return false
  }
}

export async function addFeedbackToGiftItem(feedback: Partial<Feedback>): Promise<Feedback | null> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single()

    if (error) {
      console.error('Error adding feedback:', error)
      return null
    }

    return data as Feedback
  } catch (error) {
    console.error('Error in addFeedbackToGiftItem:', error)
    return null
  }
}

export async function getFeedbackForGiftItem(giftItemId: string): Promise<Feedback[]> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('gift_item_id', giftItemId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feedback:', error)
      return []
    }

    return data as Feedback[]
  } catch (error) {
    console.error('Error in getFeedbackForGiftItem:', error)
    return []
  }
} 