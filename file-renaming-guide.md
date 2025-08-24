# File Renaming Guide

This guide lists all the files that need to be renamed and updated when migrating from the candle app to your new gift item app.

## Directory Renaming

1. `app/candle/` → `app/gift-item/` (or your specific gift item name)
2. `app/create/` → `app/create-gift/` (or your specific gift item name)

## Component Files to Rename

1. `components/candle-card.tsx` → `components/gift-item-card.tsx`
2. `components/candle-display.tsx` → `components/gift-item-display.tsx`
3. `components/aroma-visualization.tsx` → `components/customization-visualization.tsx`
4. `components/scent-details.tsx` → `components/customization-details.tsx`
5. `components/aromatherapy-recommendation.tsx` → `components/gift-recommendation.tsx`

## Type Definition Files to Rename

1. `types/candle.ts` → `types/gift-item.ts`

## API and Data Access Files to Update

1. `lib/supabase.ts` - Update all function names and references:
   - `getCandleById` → `getGiftItemById`
   - `getAllCandles` → `getAllGiftItems`
   - `createCandle` → `createGiftItem`
   - `updateCandle` → `updateGiftItem`
   - `deleteCandle` → `deleteGiftItem`
   - `addFeedbackToCandle` → `addFeedbackToGiftItem`
   - `getFeedbackForCandle` → `getFeedbackForGiftItem`

## Page Files to Update

1. `app/page.tsx` - Update references to candles and components
2. `app/candle/[id]/page.tsx` → `app/gift-item/[id]/page.tsx`
3. `app/candle/[id]/edit/page.tsx` → `app/gift-item/[id]/edit/page.tsx`
4. `app/candle/[id]/feedback.tsx` → `app/gift-item/[id]/feedback.tsx`
5. `app/create/page.tsx` → `app/create-gift/page.tsx`

## Script Files to Update

1. `scripts/generate-qr-codes.ts` - Update references to candles and URLs

## Content Updates

In addition to renaming files, you'll need to update the content within these files:

1. Replace all instances of "candle" with your gift item name
2. Replace all instances of "scent" with your customization type
3. Replace all instances of "aroma" with an appropriate term for your gift item
4. Update any specific candle-related terminology to match your gift item

## UI/UX Considerations

1. Update color schemes if they were specifically chosen for candles
2. Update icons and imagery to match your gift item
3. Update visualization components to appropriately represent your gift item's customizations
4. Consider if the intensity scale makes sense for your gift item or if it needs to be replaced

## README and Documentation

1. Update `README.md` with information about your gift item
2. Update any documentation files with your gift item specifics

## Environment Variables

The environment variables should remain the same, but you may want to update:

```
NEXT_PUBLIC_SITE_URL=https://your-gift-item-site.com
```

## Testing Checklist

After making all these changes, test:

1. Creating a new gift item
2. Viewing a gift item
3. Editing a gift item
4. Deleting a gift item
5. Sharing a gift item (QR code generation)
6. Submitting feedback for a gift item
7. Viewing feedback for a gift item
8. Search functionality
9. Responsive design on various devices 