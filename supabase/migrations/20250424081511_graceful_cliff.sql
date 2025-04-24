/*
  # Initial database schema for NoteGenius

  1. New Tables
    - `profiles` - Store user profile information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `full_name` (text)
      - `avatar_url` (text)
      - `theme` (text, default 'light')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `notes` - Store user notes
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `revision_scheduled` (boolean, default false)
      - `revision_date` (timestamptz)
      - `summary` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Select, insert, update, delete their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  revision_scheduled BOOLEAN DEFAULT false,
  revision_date TIMESTAMPTZ,
  summary TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Notes Policies
CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);