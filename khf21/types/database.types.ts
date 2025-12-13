// Supabase Database Types
// 世界旅行すごろくゲーム

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
      airports: {
        Row: {
          id: string
          code: string
          name: string
          name_ja: string | null
          city: string
          country: string
          latitude: number
          longitude: number
          region: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          name_ja?: string | null
          city: string
          country: string
          latitude: number
          longitude: number
          region?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          name_ja?: string | null
          city?: string
          country?: string
          latitude?: number
          longitude?: number
          region?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      airlines: {
        Row: {
          id: string
          code: string
          name: string
          name_ja: string | null
          country: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          name_ja?: string | null
          country: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          name_ja?: string | null
          country?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      airline_routes: {
        Row: {
          id: string
          airline_id: string | null
          origin_airport_id: string | null
          destination_airport_id: string | null
          distance_km: number
          flight_time_hours: number | null
          board_spaces: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          airline_id?: string | null
          origin_airport_id?: string | null
          destination_airport_id?: string | null
          distance_km: number
          flight_time_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          airline_id?: string | null
          origin_airport_id?: string | null
          destination_airport_id?: string | null
          distance_km?: number
          flight_time_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      ports: {
        Row: {
          id: string
          code: string
          name: string
          name_ja: string | null
          city: string
          country: string
          latitude: number
          longitude: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          name_ja?: string | null
          city: string
          country: string
          latitude: number
          longitude: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          name_ja?: string | null
          city?: string
          country?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
      }
      ship_routes: {
        Row: {
          id: string
          origin_port_id: string | null
          destination_port_id: string | null
          distance_km: number
          sailing_time_hours: number | null
          board_spaces: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          origin_port_id?: string | null
          destination_port_id?: string | null
          distance_km: number
          sailing_time_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          origin_port_id?: string | null
          destination_port_id?: string | null
          distance_km?: number
          sailing_time_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      attractions: {
        Row: {
          id: string
          name: string
          name_ja: string
          category: 'world_heritage' | 'scenic_spot' | 'landmark'
          description: string | null
          city: string | null
          country: string
          latitude: number | null
          longitude: number | null
          image_url: string | null
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ja: string
          category: 'world_heritage' | 'scenic_spot' | 'landmark'
          description?: string | null
          city?: string | null
          country: string
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ja?: string
          category?: 'world_heritage' | 'scenic_spot' | 'landmark'
          description?: string | null
          city?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      stars: {
        Row: {
          id: string
          name: string
          name_ja: string | null
          category: 'musician' | 'artist' | 'movie_star' | 'athlete'
          description: string | null
          nationality: string | null
          portrait_url: string | null
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ja?: string | null
          category: 'musician' | 'artist' | 'movie_star' | 'athlete'
          description?: string | null
          nationality?: string | null
          portrait_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ja?: string | null
          category?: 'musician' | 'artist' | 'movie_star' | 'athlete'
          description?: string | null
          nationality?: string | null
          portrait_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      arts: {
        Row: {
          id: string
          name: string
          name_ja: string
          category: 'concert' | 'musical' | 'performance' | 'street_art'
          description: string | null
          venue: string | null
          city: string | null
          country: string | null
          image_url: string | null
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ja: string
          category: 'concert' | 'musical' | 'performance' | 'street_art'
          description?: string | null
          venue?: string | null
          city?: string | null
          country?: string | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ja?: string
          category?: 'concert' | 'musical' | 'performance' | 'street_art'
          description?: string | null
          venue?: string | null
          city?: string | null
          country?: string | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      gourmet: {
        Row: {
          id: string
          name: string
          name_ja: string
          description: string | null
          city: string | null
          country: string
          cuisine_type: string | null
          image_url: string | null
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ja: string
          description?: string | null
          city?: string | null
          country: string
          cuisine_type?: string | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ja?: string
          description?: string | null
          city?: string | null
          country?: string
          cuisine_type?: string | null
          image_url?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      troubles: {
        Row: {
          id: string
          name: string
          name_ja: string
          category: 'theft' | 'robbery' | 'flight_delay' | 'hijack' | 'engine_failure' | 'shipwreck' | 'pirate' | 'fire'
          description: string
          severity: number
          image_url: string | null
          impressed_points_loss: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ja: string
          category: 'theft' | 'robbery' | 'flight_delay' | 'hijack' | 'engine_failure' | 'shipwreck' | 'pirate' | 'fire'
          description: string
          severity?: number
          image_url?: string | null
          impressed_points_loss?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ja?: string
          category?: 'theft' | 'robbery' | 'flight_delay' | 'hijack' | 'engine_failure' | 'shipwreck' | 'pirate' | 'fire'
          description?: string
          severity?: number
          image_url?: string | null
          impressed_points_loss?: number
          created_at?: string
          updated_at?: string
        }
      }
      trouble_resolutions: {
        Row: {
          id: string
          trouble_id: string | null
          helper_type: string
          resolution_text: string
          encouragement_text: string | null
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trouble_id?: string | null
          helper_type: string
          resolution_text: string
          encouragement_text?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trouble_id?: string | null
          helper_type?: string
          resolution_text?: string
          encouragement_text?: string | null
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      impressed_scenarios: {
        Row: {
          id: string
          title: string
          category: 'attraction' | 'star' | 'art' | 'gourmet' | 'trouble_resolution'
          related_id: string | null
          scenario_text: string
          impressed_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: 'attraction' | 'star' | 'art' | 'gourmet' | 'trouble_resolution'
          related_id?: string | null
          scenario_text: string
          impressed_points: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: 'attraction' | 'star' | 'art' | 'gourmet' | 'trouble_resolution'
          related_id?: string | null
          scenario_text?: string
          impressed_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      giver_scenarios: {
        Row: {
          id: string
          title: string
          location_type: 'airport' | 'flight' | 'port' | 'ship' | 'restaurant' | 'concert_hall' | 'museum'
          situation_text: string
          action_options: Json
          giver_points: number
          feedback_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          location_type: 'airport' | 'flight' | 'port' | 'ship' | 'restaurant' | 'concert_hall' | 'museum'
          situation_text: string
          action_options: Json
          giver_points: number
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          location_type?: 'airport' | 'flight' | 'port' | 'ship' | 'restaurant' | 'concert_hall' | 'museum'
          situation_text?: string
          action_options?: Json
          giver_points?: number
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      encouragement_gratitude_scenarios: {
        Row: {
          id: string
          category: 'gratitude_happy' | 'gratitude_help' | 'encouragement'
          subcategory: string | null
          trigger_type: 'phone' | 'email' | 'message' | 'diary' | 'photo' | 'letter' | 'encounter' | 'video_call'
          trigger_from: string | null
          travel_situation: string
          background_story: string
          message_text: string
          location_context: string | null
          impressed_points: number
          giver_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: 'gratitude_happy' | 'gratitude_help' | 'encouragement'
          subcategory?: string | null
          trigger_type: 'phone' | 'email' | 'message' | 'diary' | 'photo' | 'letter' | 'encounter' | 'video_call'
          trigger_from?: string | null
          travel_situation: string
          background_story: string
          message_text: string
          location_context?: string | null
          impressed_points?: number
          giver_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: 'gratitude_happy' | 'gratitude_help' | 'encouragement'
          subcategory?: string | null
          trigger_type?: 'phone' | 'email' | 'message' | 'diary' | 'photo' | 'letter' | 'encounter' | 'video_call'
          trigger_from?: string | null
          travel_situation?: string
          background_story?: string
          message_text?: string
          location_context?: string | null
          impressed_points?: number
          giver_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      game_period_settings: {
        Row: {
          id: string
          period_name: string
          period_name_ja: string
          total_days: number
          created_at: string
        }
        Insert: {
          id?: string
          period_name: string
          period_name_ja: string
          total_days: number
          created_at?: string
        }
        Update: {
          id?: string
          period_name?: string
          period_name_ja?: string
          total_days?: number
          created_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string | null
          period_setting_id: string | null
          start_date: string
          total_days: number
          elapsed_days: number
          current_location_type: 'airport' | 'port' | 'flight' | 'ship'
          current_airport_id: string | null
          current_port_id: string | null
          impressed_points: number
          giver_points: number
          total_points: number
          status: 'active' | 'completed' | 'abandoned'
          completed_at: string | null
          player_nickname: string | null
          player_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          period_setting_id?: string | null
          start_date?: string
          total_days: number
          elapsed_days?: number
          current_location_type?: 'airport' | 'port' | 'flight' | 'ship'
          current_airport_id?: string | null
          current_port_id?: string | null
          impressed_points?: number
          giver_points?: number
          status?: 'active' | 'completed' | 'abandoned'
          completed_at?: string | null
          player_nickname?: string | null
          player_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          period_setting_id?: string | null
          start_date?: string
          total_days?: number
          elapsed_days?: number
          current_location_type?: 'airport' | 'port' | 'flight' | 'ship'
          current_airport_id?: string | null
          current_port_id?: string | null
          impressed_points?: number
          giver_points?: number
          status?: 'active' | 'completed' | 'abandoned'
          completed_at?: string | null
          player_nickname?: string | null
          player_color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      game_progress: {
        Row: {
          id: string
          game_session_id: string | null
          sequence_number: number
          destination_type: 'airport' | 'port'
          destination_airport_id: string | null
          destination_port_id: string | null
          distance_km: number
          stay_days: number
          arrival_date: string
          departure_date: string | null
          impressed_points_gained: number
          giver_points_gained: number
          created_at: string
        }
        Insert: {
          id?: string
          game_session_id?: string | null
          sequence_number: number
          destination_type: 'airport' | 'port'
          destination_airport_id?: string | null
          destination_port_id?: string | null
          distance_km: number
          stay_days: number
          arrival_date: string
          departure_date?: string | null
          impressed_points_gained?: number
          giver_points_gained?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_session_id?: string | null
          sequence_number?: number
          destination_type?: 'airport' | 'port'
          destination_airport_id?: string | null
          destination_port_id?: string | null
          distance_km?: number
          stay_days?: number
          arrival_date?: string
          departure_date?: string | null
          impressed_points_gained?: number
          giver_points_gained?: number
          created_at?: string
        }
      }
      event_history: {
        Row: {
          id: string
          game_session_id: string | null
          game_progress_id: string | null
          event_type: string
          related_table: string | null
          related_id: string | null
          event_text: string | null
          impressed_points: number
          giver_points: number
          occurred_at: string
        }
        Insert: {
          id?: string
          game_session_id?: string | null
          game_progress_id?: string | null
          event_type: string
          related_table?: string | null
          related_id?: string | null
          event_text?: string | null
          impressed_points?: number
          giver_points?: number
          occurred_at?: string
        }
        Update: {
          id?: string
          game_session_id?: string | null
          game_progress_id?: string | null
          event_type?: string
          related_table?: string | null
          related_id?: string | null
          event_text?: string | null
          impressed_points?: number
          giver_points?: number
          occurred_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_stay_days: {
        Args: {
          distance_km: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Specific type exports for convenience
export type Airport = Tables<'airports'>
export type Airline = Tables<'airlines'>
export type AirlineRoute = Tables<'airline_routes'>
export type Port = Tables<'ports'>
export type ShipRoute = Tables<'ship_routes'>
export type Attraction = Tables<'attractions'>
export type Star = Tables<'stars'>
export type Art = Tables<'arts'>
export type Gourmet = Tables<'gourmet'>
export type Trouble = Tables<'troubles'>
export type TroubleResolution = Tables<'trouble_resolutions'>
export type ImpressedScenario = Tables<'impressed_scenarios'>
export type GiverScenario = Tables<'giver_scenarios'>
export type EncouragementGratitudeScenario = Tables<'encouragement_gratitude_scenarios'>
export type GamePeriodSetting = Tables<'game_period_settings'>
export type GameSession = Tables<'game_sessions'>
export type GameProgress = Tables<'game_progress'>
export type EventHistory = Tables<'event_history'>
