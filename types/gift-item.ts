export interface GiftItem {
  id: string
  name: string
  recipient_name: string
  color: string
  customizations: Customization[]
  image_url?: string
  video_url?: string
  created_at: string
  description?: string
  recommended_uses?: string[]
  // Add any additional fields specific to your gift item
  // size?: string
  // material?: string
  // weight?: number
}

export interface Customization {
  name: string
  description: string
  intensity: number  // You can rename this to something more appropriate for your gift item
  color?: string
  // Add any additional fields specific to your customizations
  // position?: string
  // image_url?: string
}

export interface Feedback {
  id: string
  gift_item_id: string
  customization_feedback: CustomizationFeedback[]
  comment: string
  created_at?: string
}

export interface CustomizationFeedback {
  customization_name: string
  rating: number  // You can rename this to something more appropriate for your gift item
}

// Add any additional interfaces specific to your gift item
// export interface GiftItemCategory {
//   id: string
//   name: string
//   description?: string
// } 