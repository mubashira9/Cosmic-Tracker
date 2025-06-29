/*
  # Create item_history table

  1. New Tables
    - `item_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `item_id` (uuid, foreign key to items, nullable)
      - `item_name` (text, required)
      - `action` (text, required - must be 'created', 'updated', 'deleted', or 'moved')
      - `old_values` (jsonb, nullable)
      - `new_values` (jsonb, nullable)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `item_history` table
    - Add policy for users to insert their own item history
    - Add policy for users to read their own item history

  3. Indexes
    - Index on created_at for efficient ordering
    - Index on item_id for efficient lookups
    - Index on user_id for efficient user filtering
*/

CREATE TABLE IF NOT EXISTS item_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id uuid,
  item_name text NOT NULL,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT item_history_action_check CHECK (action = ANY (ARRAY['created'::text, 'updated'::text, 'deleted'::text, 'moved'::text]))
);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'item_history_user_id_fkey'
  ) THEN
    ALTER TABLE item_history ADD CONSTRAINT item_history_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'item_history_item_id_fkey'
  ) THEN
    ALTER TABLE item_history ADD CONSTRAINT item_history_item_id_fkey 
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS item_history_created_at_idx ON item_history (created_at DESC);
CREATE INDEX IF NOT EXISTS item_history_item_id_idx ON item_history (item_id);
CREATE INDEX IF NOT EXISTS item_history_user_id_idx ON item_history (user_id);

-- Enable RLS
ALTER TABLE item_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "Users can insert their own item history"
  ON item_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can read their own item history"
  ON item_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);