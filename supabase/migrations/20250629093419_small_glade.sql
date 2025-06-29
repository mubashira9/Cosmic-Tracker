/*
  # Enhance items table with new features

  1. New Columns
    - `is_starred` (boolean) - Mark items as favorites
    - `has_pin` (boolean) - Mark items as requiring PIN for access
    - `pin_code` (text) - 4-digit PIN for secure items
    - `tags` (text array) - Searchable tags for items

  2. Security
    - Update existing RLS policies to handle new columns
    - Ensure PIN codes are only accessible to item owners

  3. Indexes
    - Add indexes for better performance on new columns
*/

-- Add new columns to items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'is_starred'
  ) THEN
    ALTER TABLE items ADD COLUMN is_starred boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'has_pin'
  ) THEN
    ALTER TABLE items ADD COLUMN has_pin boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'pin_code'
  ) THEN
    ALTER TABLE items ADD COLUMN pin_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'tags'
  ) THEN
    ALTER TABLE items ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS items_is_starred_idx ON items (is_starred) WHERE is_starred = true;
CREATE INDEX IF NOT EXISTS items_has_pin_idx ON items (has_pin) WHERE has_pin = true;
CREATE INDEX IF NOT EXISTS items_tags_idx ON items USING GIN (tags);

-- Update RLS policy to ensure PIN codes are secure
DROP POLICY IF EXISTS "Users can manage their own items" ON items;

CREATE POLICY "Users can manage their own items"
  ON items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);