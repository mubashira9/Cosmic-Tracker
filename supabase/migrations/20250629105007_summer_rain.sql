/*
  # Add encryption fields to support end-to-end encryption

  1. New Columns Added
    - `encryption_salt` - Salt for encrypting item data
    - `pin_code_hash` - Hashed PIN instead of plain text
    - `is_pin_protected` - Flag to indicate PIN protection
    - `pin_encrypted_data` - Separately encrypted data for PIN items
    - `pin_salt` - Separate salt for PIN encryption
    - `encryption_salt` to item_history table

  2. Security Changes
    - Replace pin_code with pin_code_hash for better security
    - Add encryption support for all sensitive data
    - Separate encryption for PIN-protected items
*/

-- Add encryption fields to items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'encryption_salt'
  ) THEN
    ALTER TABLE items ADD COLUMN encryption_salt text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'pin_code_hash'
  ) THEN
    ALTER TABLE items ADD COLUMN pin_code_hash text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'is_pin_protected'
  ) THEN
    ALTER TABLE items ADD COLUMN is_pin_protected boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'pin_encrypted_data'
  ) THEN
    ALTER TABLE items ADD COLUMN pin_encrypted_data text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'pin_salt'
  ) THEN
    ALTER TABLE items ADD COLUMN pin_salt text;
  END IF;
END $$;

-- Add encryption field to item_history table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'item_history' AND column_name = 'encryption_salt'
  ) THEN
    ALTER TABLE item_history ADD COLUMN encryption_salt text;
  END IF;
END $$;

-- Migrate existing pin_code to pin_code_hash (if any exist)
-- Note: This is a one-way migration - existing PINs will need to be reset
UPDATE items 
SET pin_code_hash = NULL, 
    is_pin_protected = COALESCE(has_pin, false)
WHERE pin_code IS NOT NULL;

-- Remove the old pin_code column for security
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'pin_code'
  ) THEN
    ALTER TABLE items DROP COLUMN pin_code;
  END IF;
END $$;