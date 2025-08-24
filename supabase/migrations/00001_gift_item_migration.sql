-- Migration script to transform candle app to a new gift item app
-- Replace GIFT_ITEM with your specific gift item name (e.g., 'mugs', 'jewelry', etc.)

-- Step 1: Rename tables
ALTER TABLE candles RENAME TO gift_items;

-- Step 2: Update column names to be more generic
-- The 'scents' column is renamed to 'customizations' to be more generic
ALTER TABLE gift_items RENAME COLUMN scents TO customizations;

-- Optional: If you want to rename recipient_name to something else
-- ALTER TABLE gift_items RENAME COLUMN recipient_name TO recipient;

-- Step 3: Update foreign key references in the feedback table
ALTER TABLE feedback RENAME COLUMN candle_id TO gift_item_id;
ALTER TABLE feedback RENAME COLUMN scent_feedback TO customization_feedback;

-- Step 4: Drop existing indexes
DROP INDEX IF EXISTS idx_candles_id;
DROP INDEX IF EXISTS idx_feedback_candle_id;

-- Step 5: Create new indexes for better query performance
CREATE INDEX idx_gift_items_id ON gift_items(id);
CREATE INDEX idx_feedback_gift_item_id ON feedback(gift_item_id);

-- Step 6: Add any new columns specific to your gift item
-- For example, if your gift item needs a size field:
-- ALTER TABLE gift_items ADD COLUMN size TEXT;

-- Step 7: Update any existing data if needed
-- This example converts 'aromatherapy_description' to a more generic 'description'
ALTER TABLE gift_items RENAME COLUMN aromatherapy_description TO description;

-- Step 8: Add any new constraints or validations
-- For example, if you want to ensure the color is a valid hex code:
-- ALTER TABLE gift_items ADD CONSTRAINT valid_color CHECK (color ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');

-- Step 9: Update any triggers or functions
-- If you have any triggers or functions specific to candles, update them here

-- Step 10: Add any new tables specific to your gift item
-- For example, if your gift item has categories:
-- CREATE TABLE gift_item_categories (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   name TEXT NOT NULL,
--   description TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
-- 
-- ALTER TABLE gift_items ADD COLUMN category_id UUID REFERENCES gift_item_categories(id);
-- CREATE INDEX idx_gift_items_category_id ON gift_items(category_id); 