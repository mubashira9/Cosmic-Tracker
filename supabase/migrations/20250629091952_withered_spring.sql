/*
  # Create items table for Cosmic Tracker

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, item name)
      - `location` (text, where item is stored)
      - `description` (text, optional description)
      - `category` (text, item category)
      - `item_image_url` (text, optional image URL)
      - `location_image_url` (text, optional location image URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `items` table
    - Add policy for users to manage their own items only
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'tools',
  item_image_url text,
  location_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own items"
  ON items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS items_user_id_idx ON items(user_id);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON items(created_at DESC);