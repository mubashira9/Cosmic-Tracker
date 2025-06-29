/*
  # Create item_history table

  1. New Tables
    - `item_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `item_id` (uuid, foreign key to items, nullable)
      - `item_name` (text, required)
      - `action` (text, required - created/updated/deleted/moved)
      - `old_values` (jsonb, nullable)
      - `new_values` (jsonb, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `item_history` table
    - Add policy for authenticated users to insert their own history
    - Add policy for authenticated users to read their own history

  3. Indexes
    - Index on created_at (descending)
    - Index on item_id
    - Index on user_id
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

-- Create RLS policies using DO blocks to handle IF NOT EXISTS logic
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'item_history' 
    AND policyname = 'Users can insert their own item history'
  ) THEN
    CREATE POLICY "Users can insert their own item history"
      ON item_history
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'item_history' 
    AND policyname = 'Users can read their own item history'
  ) THEN
    CREATE POLICY "Users can read their own item history"
      ON item_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;