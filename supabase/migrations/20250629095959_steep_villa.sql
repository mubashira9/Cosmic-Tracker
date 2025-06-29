/*
  # Enhanced Cosmic Tracker Features

  1. New Tables
    - `item_history` - Track all changes to items (add, edit, delete, move)
    - `item_reminders` - Store expiry dates and reminder settings for items
    
  2. Table Updates
    - Add `last_moved_at` timestamp to items table
    - Add `notes` field for additional item information
    
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users to manage their own data
    
  4. Indexes
    - Add indexes for performance on frequently queried columns
*/

-- Add new columns to items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'last_moved_at'
  ) THEN
    ALTER TABLE items ADD COLUMN last_moved_at timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'notes'
  ) THEN
    ALTER TABLE items ADD COLUMN notes text DEFAULT '';
  END IF;
END $$;

-- Create item_history table
CREATE TABLE IF NOT EXISTS item_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'moved')),
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create item_reminders table
CREATE TABLE IF NOT EXISTS item_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  expiry_date date NOT NULL,
  reminder_days_before integer DEFAULT 7,
  is_active boolean DEFAULT true,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE item_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for item_history
CREATE POLICY "Users can read their own item history"
  ON item_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own item history"
  ON item_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for item_reminders
CREATE POLICY "Users can manage their own reminders"
  ON item_reminders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS item_history_user_id_idx ON item_history(user_id);
CREATE INDEX IF NOT EXISTS item_history_item_id_idx ON item_history(item_id);
CREATE INDEX IF NOT EXISTS item_history_created_at_idx ON item_history(created_at DESC);
CREATE INDEX IF NOT EXISTS item_reminders_user_id_idx ON item_reminders(user_id);
CREATE INDEX IF NOT EXISTS item_reminders_expiry_date_idx ON item_reminders(expiry_date);
CREATE INDEX IF NOT EXISTS item_reminders_active_idx ON item_reminders(is_active) WHERE is_active = true;