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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}