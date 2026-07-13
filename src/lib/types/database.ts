export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          role: 'client' | 'provider' | 'admin'
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'client' | 'provider' | 'admin'
          location?: string | null
          bio?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      services: {
        Row: {
          id: string
          provider_id: string
          category_id: string
          title: string
          description: string | null
          price: number
          price_unit: string
          duration_minutes: number | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          slug: string
        }
        Insert: { name: string; icon?: string; slug: string }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          provider_id: string
          service_id: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          scheduled_date: string
          scheduled_time: string | null
          address: string | null
          notes: string | null
          client_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'image'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          provider_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
  }
}