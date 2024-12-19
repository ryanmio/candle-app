export interface Candle {
  id: string
  name: string
  recipient_name: string
  color: string
  scents: Scent[]
  image_url?: string
  video_url?: string
  created_at: string
}

export interface Scent {
  name: string
  description: string
  intensity: number
  color?: string
}

export interface Feedback {
  id: string
  candle_id: string
  scent_feedback: ScentFeedback[]
  comment: string
  created_at: string
}

export interface ScentFeedback {
  scent_name: string
  intensity: number
}

