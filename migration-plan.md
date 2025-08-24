# Migration Plan: Adapting ThisCandleIsForYou for a Different Gift Item

This document outlines the steps needed to adapt the ThisCandleIsForYou application for a different gift item.

## Project Structure Overview

The application is built with:
- Next.js (React framework)
- TypeScript
- Tailwind CSS for styling
- Supabase for database and authentication
- QR code generation for sharing

## Directory Structure

```
├── app/                      # Next.js app directory (pages and routing)
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── candle/               # Candle detail pages
│   │   └── [id]/             # Dynamic route for individual candles
│   ├── components/           # App-specific components
│   ├── create/               # Candle creation page
│   ├── protected/            # Protected routes
│   └── page.tsx              # Homepage
├── components/               # Shared UI components
│   ├── ui/                   # UI components (buttons, inputs, etc.)
│   ├── typography/           # Typography components
│   └── ...                   # Various feature components
├── lib/                      # Utility libraries
│   ├── supabase.ts           # Supabase client and data access methods
│   └── utils.ts              # General utility functions
├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   └── generate-qr-codes.ts  # QR code generation script
├── supabase/                 # Supabase configuration
│   └── schema.sql            # Database schema
├── types/                    # TypeScript type definitions
│   └── candle.ts             # Candle type definitions
└── utils/                    # Utility functions
```

## Database Schema Changes

Current schema:

```sql
-- Create the candles table
CREATE TABLE candles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  color TEXT NOT NULL,
  scents JSONB NOT NULL,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the feedback table
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candle_id UUID REFERENCES candles(id),
  scent_feedback JSONB NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Migration Steps

### 1. Database Schema Migration

Create a new migration file `supabase/migrations/[timestamp]_gift_item_migration.sql`:

```sql
-- Rename tables to reflect new gift item (example: for custom mugs)
ALTER TABLE candles RENAME TO gift_items;

-- Update column names and types as needed
ALTER TABLE gift_items RENAME COLUMN scents TO customizations;

-- Update foreign key references in the feedback table
ALTER TABLE feedback RENAME COLUMN candle_id TO gift_item_id;
ALTER TABLE feedback RENAME COLUMN scent_feedback TO customization_feedback;

-- Create new indexes for better query performance
DROP INDEX IF EXISTS idx_candles_id;
DROP INDEX IF EXISTS idx_feedback_candle_id;
CREATE INDEX idx_gift_items_id ON gift_items(id);
CREATE INDEX idx_feedback_gift_item_id ON feedback(gift_item_id);
```

### 2. Type Definitions Update

Update `types/candle.ts` to `types/gift-item.ts`:

```typescript
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
}

export interface Customization {
  name: string
  description: string
  intensity: number  // Or another appropriate measure
  color?: string
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
  rating: number  // Or another appropriate measure
}
```

### 3. Component Renaming and Updates

1. Rename components:
   - `candle-card.tsx` → `gift-item-card.tsx`
   - `candle-display.tsx` → `gift-item-display.tsx`
   - `aroma-visualization.tsx` → `customization-visualization.tsx`
   - `scent-details.tsx` → `customization-details.tsx`

2. Update imports and references throughout the codebase

### 4. Page Structure Updates

1. Rename directories:
   - `app/candle/` → `app/gift-item/`
   - `app/create/` → `app/create-gift/`

2. Update dynamic routes and references

### 5. API and Data Access Updates

Update `lib/supabase.ts` to reflect new table and field names:

```typescript
export async function getGiftItemById(id: string): Promise<GiftItem | null> {
  try {
    if (!id) throw new Error('Gift item ID is required')

    const { data, error } = await supabase
      .from('gift_items')
      .select('*')
      .eq('id', id)
      .single()
    
    // Error handling...
    
    return data as GiftItem
  } catch (error) {
    console.error('Error in getGiftItemById:', error)
    return null
  }
}

export async function getAllGiftItems(filters?: FilterOptions) {
  let query = supabase
    .from('gift_items')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply filters...
  
  const { data, error } = await query
  
  // Error handling...
  
  return data || []
}

// Update other methods similarly...
```

### 6. QR Code Generation Script Update

Update `scripts/generate-qr-codes.ts`:

```typescript
// Update imports and references
import { getAllGiftItems } from './supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourgiftsite.com'

async function generateQRCodes() {
  // Create qr-codes directory if it doesn't exist
  const qrDir = path.join(process.cwd(), 'qr-codes')
  await fs.mkdir(qrDir, { recursive: true })

  // Get all gift items
  const giftItems = await getAllGiftItems()
  console.log(`Found ${giftItems.length} gift items`)

  // Generate QR code for each gift item
  for (const item of giftItems) {
    const itemUrl = `${SITE_URL}/gift-item/${item.id}`
    // Rest of the code...
  }
}
```

### 7. UI Text and Branding Updates

1. Update all UI text references from "candle" to your new gift item
2. Update branding elements (logos, colors, etc.)
3. Update README.md and documentation

### 8. Environment Variables

Required environment variables remain the same:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://yourgiftsite.com
```

### 9. Package Dependencies

The current dependencies should work for the new application, but review for any gift-item specific packages that might be needed.

## Testing Plan

1. Test database migrations
2. Test CRUD operations for the new gift item
3. Test the customization visualization
4. Test QR code generation
5. Test feedback submission and display
6. Test responsive design on various devices

## Deployment Steps

1. Set up a new Supabase project
2. Run the database migration scripts
3. Update environment variables
4. Deploy the Next.js application to your preferred hosting provider (Vercel recommended)
5. Set up proper redirects and routing

## Additional Considerations

1. SEO updates for the new gift item
2. Analytics tracking updates
3. Social sharing metadata updates
4. Consider any specific features unique to your new gift item that weren't needed for candles

This migration plan provides a comprehensive guide to transform the ThisCandleIsForYou application into a personalized experience for your new gift item while maintaining the core functionality and user experience. 