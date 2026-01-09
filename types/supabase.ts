export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      thoughts: {
        Row: {
          id: string
          user_id: string
          content: string
          title: string | null
          emotional_tone: string | null
          raw_analysis: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          title?: string | null
          emotional_tone?: string | null
          raw_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          title?: string | null
          emotional_tone?: string | null
          raw_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      cognitive_snapshots: {
        Row: {
          id: string
          user_id: string
          main_goal: string | null
          biggest_challenge: string | null
          confusion_area: string | null
          risk_tolerance: 'low' | 'medium' | 'high' | null
          time_horizon: 'short' | 'long' | null
          initial_thought: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          main_goal?: string | null
          biggest_challenge?: string | null
          confusion_area?: string | null
          risk_tolerance?: 'low' | 'medium' | 'high' | null
          time_horizon?: 'short' | 'long' | null
          initial_thought?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          main_goal?: string | null
          biggest_challenge?: string | null
          confusion_area?: string | null
          risk_tolerance?: 'low' | 'medium' | 'high' | null
          time_horizon?: 'short' | 'long' | null
          initial_thought?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cognitive_nodes: {
        Row: {
          id: string
          user_id: string
          thought_id: string | null
          node_type: 'belief' | 'goal' | 'fear' | 'value' | 'assumption' | 'decision' | 'intention'
          content: string
          confidence: number
          importance: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          thought_id?: string | null
          node_type: 'belief' | 'goal' | 'fear' | 'value' | 'assumption' | 'decision' | 'intention'
          content: string
          confidence?: number
          importance?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          thought_id?: string | null
          node_type?: 'belief' | 'goal' | 'fear' | 'value' | 'assumption' | 'decision' | 'intention'
          content?: string
          confidence?: number
          importance?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      cognitive_edges: {
        Row: {
          id: string
          user_id: string
          source_node_id: string
          target_node_id: string
          edge_type: 'supports' | 'conflicts' | 'causes' | 'depends_on' | 'related_to'
          strength: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_node_id: string
          target_node_id: string
          edge_type: 'supports' | 'conflicts' | 'causes' | 'depends_on' | 'related_to'
          strength?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_node_id?: string
          target_node_id?: string
          edge_type?: 'supports' | 'conflicts' | 'causes' | 'depends_on' | 'related_to'
          strength?: number
          created_at?: string
        }
      }
      cognitive_insights: {
        Row: {
          id: string
          user_id: string
          thought_id: string | null
          insight_type: 'contradiction' | 'bias' | 'pattern' | 'blind_spot' | 'growth_opportunity'
          title: string
          description: string
          severity: 'low' | 'medium' | 'high' | null
          related_node_ids: string[] | null
          resolved: boolean
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          thought_id?: string | null
          insight_type: 'contradiction' | 'bias' | 'pattern' | 'blind_spot' | 'growth_opportunity'
          title: string
          description: string
          severity?: 'low' | 'medium' | 'high' | null
          related_node_ids?: string[] | null
          resolved?: boolean
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          thought_id?: string | null
          insight_type?: 'contradiction' | 'bias' | 'pattern' | 'blind_spot' | 'growth_opportunity'
          title?: string
          description?: string
          severity?: 'low' | 'medium' | 'high' | null
          related_node_ids?: string[] | null
          resolved?: boolean
          resolved_at?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          theme: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          theme?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          theme?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Keep notes for backwards compatibility during migration
      notes: {
        Row: {
          id: string
          title: string
          content: string
          user_id: string
          created_at: string
          updated_at: string
          revision_scheduled: boolean
          revision_date: string | null
          summary: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          user_id: string
          created_at?: string
          updated_at?: string
          revision_scheduled?: boolean
          revision_date?: string | null
          summary?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          revision_scheduled?: boolean
          revision_date?: string | null
          summary?: string | null
        }
      }
    }
  }
}

// Type helpers for cognitive features
export type Thought = Database['public']['Tables']['thoughts']['Row']
export type CognitiveSnapshot = Database['public']['Tables']['cognitive_snapshots']['Row']
export type CognitiveNode = Database['public']['Tables']['cognitive_nodes']['Row']
export type CognitiveEdge = Database['public']['Tables']['cognitive_edges']['Row']
export type CognitiveInsight = Database['public']['Tables']['cognitive_insights']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type NodeType = CognitiveNode['node_type']
export type EdgeType = CognitiveEdge['edge_type']
export type InsightType = CognitiveInsight['insight_type']
