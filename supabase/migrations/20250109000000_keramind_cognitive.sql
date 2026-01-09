/*
  # KeraMind Cognitive Intelligence Schema

  1. New Tables
    - `thoughts` - Store user thoughts (replaces notes)
    - `cognitive_snapshots` - Store onboarding cognitive snapshots
    - `cognitive_nodes` - Nodes in the cognitive graph (beliefs, goals, fears, etc.)
    - `cognitive_edges` - Edges connecting nodes (supports, conflicts, causes)
    - `cognitive_insights` - AI-detected insights (contradictions, biases, patterns)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create thoughts table (evolved from notes)
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title TEXT,
  emotional_tone TEXT, -- e.g., 'anxious', 'hopeful', 'uncertain', 'confident'
  raw_analysis JSONB, -- Store full AI analysis response
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cognitive snapshots for onboarding
CREATE TABLE IF NOT EXISTS cognitive_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  main_goal TEXT,
  biggest_challenge TEXT,
  confusion_area TEXT,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  time_horizon TEXT CHECK (time_horizon IN ('short', 'long')),
  initial_thought TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id) -- One snapshot per user
);

-- Create cognitive nodes table
CREATE TABLE IF NOT EXISTS cognitive_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thought_id UUID REFERENCES thoughts(id) ON DELETE SET NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('belief', 'goal', 'fear', 'value', 'assumption', 'decision', 'intention')),
  content TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.80, -- 0.00 to 1.00
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cognitive edges table
CREATE TABLE IF NOT EXISTS cognitive_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES cognitive_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES cognitive_nodes(id) ON DELETE CASCADE,
  edge_type TEXT NOT NULL CHECK (edge_type IN ('supports', 'conflicts', 'causes', 'depends_on', 'related_to')),
  strength DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_node_id, target_node_id, edge_type)
);

-- Create cognitive insights table
CREATE TABLE IF NOT EXISTS cognitive_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thought_id UUID REFERENCES thoughts(id) ON DELETE SET NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('contradiction', 'bias', 'pattern', 'blind_spot', 'growth_opportunity')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  related_node_ids UUID[], -- Array of related cognitive node IDs
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cognitive_nodes_user_id ON cognitive_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_nodes_type ON cognitive_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_cognitive_edges_user_id ON cognitive_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_insights_user_id ON cognitive_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_insights_type ON cognitive_insights(insight_type);

-- Enable Row Level Security
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_insights ENABLE ROW LEVEL SECURITY;

-- Thoughts Policies
CREATE POLICY "Users can view their own thoughts"
  ON thoughts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create thoughts"
  ON thoughts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts"
  ON thoughts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thoughts"
  ON thoughts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Cognitive Snapshots Policies
CREATE POLICY "Users can view their own snapshot"
  ON cognitive_snapshots FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their snapshot"
  ON cognitive_snapshots FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their snapshot"
  ON cognitive_snapshots FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Cognitive Nodes Policies
CREATE POLICY "Users can view their own nodes"
  ON cognitive_nodes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create nodes"
  ON cognitive_nodes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nodes"
  ON cognitive_nodes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nodes"
  ON cognitive_nodes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Cognitive Edges Policies
CREATE POLICY "Users can view their own edges"
  ON cognitive_edges FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create edges"
  ON cognitive_edges FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own edges"
  ON cognitive_edges FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Cognitive Insights Policies
CREATE POLICY "Users can view their own insights"
  ON cognitive_insights FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create insights"
  ON cognitive_insights FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON cognitive_insights FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON cognitive_insights FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Add onboarding_completed field to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
