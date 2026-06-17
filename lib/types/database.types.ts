export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          timezone: string
          locale: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          locale?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          locale?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          address: string | null
          city: string | null
          country: string | null
          latitude: number | null
          longitude: number | null
          total_area_sqm: number | null
          cover_image_url: string | null
          timezone: string
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          latitude?: number | null
          longitude?: number | null
          total_area_sqm?: number | null
          cover_image_url?: string | null
          timezone?: string
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          latitude?: number | null
          longitude?: number | null
          total_area_sqm?: number | null
          cover_image_url?: string | null
          timezone?: string
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      parcels: {
        Row: {
          id: string
          property_id: string
          name: string
          description: string | null
          area_sqm: number | null
          boundary_geojson: Json | null
          color: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          description?: string | null
          area_sqm?: number | null
          boundary_geojson?: Json | null
          color?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          description?: string | null
          area_sqm?: number | null
          boundary_geojson?: Json | null
          color?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      zones: {
        Row: {
          id: string
          property_id: string
          parcel_id: string | null
          name: string
          description: string | null
          type: Database['public']['Enums']['zone_type']
          area_sqm: number | null
          boundary_geojson: Json | null
          color: string | null
          icon: string | null
          sort_order: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          parcel_id?: string | null
          name: string
          description?: string | null
          type?: Database['public']['Enums']['zone_type']
          area_sqm?: number | null
          boundary_geojson?: Json | null
          color?: string | null
          icon?: string | null
          sort_order?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          parcel_id?: string | null
          name?: string
          description?: string | null
          type?: Database['public']['Enums']['zone_type']
          area_sqm?: number | null
          boundary_geojson?: Json | null
          color?: string | null
          icon?: string | null
          sort_order?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          property_id: string
          zone_id: string | null
          name: string
          description: string | null
          category: Database['public']['Enums']['asset_category']
          subcategory: string | null
          manufacturer: string | null
          model: string | null
          serial_number: string | null
          purchase_date: string | null
          purchase_price: number | null
          current_value: number | null
          warranty_expiry: string | null
          condition: string | null
          location_description: string | null
          latitude: number | null
          longitude: number | null
          image_urls: string[] | null
          metadata: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          zone_id?: string | null
          name: string
          description?: string | null
          category?: Database['public']['Enums']['asset_category']
          subcategory?: string | null
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          current_value?: number | null
          warranty_expiry?: string | null
          condition?: string | null
          location_description?: string | null
          latitude?: number | null
          longitude?: number | null
          image_urls?: string[] | null
          metadata?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          zone_id?: string | null
          name?: string
          description?: string | null
          category?: Database['public']['Enums']['asset_category']
          subcategory?: string | null
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          current_value?: number | null
          warranty_expiry?: string | null
          condition?: string | null
          location_description?: string | null
          latitude?: number | null
          longitude?: number | null
          image_urls?: string[] | null
          metadata?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      asset_qr_codes: {
        Row: {
          id: string
          asset_id: string
          property_id: string
          code: string
          qr_image_url: string | null
          label: string | null
          is_active: boolean
          last_scanned_at: string | null
          scan_count: number
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          property_id: string
          code?: string
          qr_image_url?: string | null
          label?: string | null
          is_active?: boolean
          last_scanned_at?: string | null
          scan_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          property_id?: string
          code?: string
          qr_image_url?: string | null
          label?: string | null
          is_active?: boolean
          last_scanned_at?: string | null
          scan_count?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          property_id: string
          zone_id: string | null
          asset_id: string | null
          assigned_to: string | null
          contractor_id: string | null
          title: string
          description: string | null
          status: Database['public']['Enums']['task_status']
          priority: Database['public']['Enums']['task_priority']
          due_date: string | null
          completed_at: string | null
          recurrence_rule: string | null
          estimated_hours: number | null
          actual_hours: number | null
          estimated_cost: number | null
          actual_cost: number | null
          tags: string[] | null
          attachments: Json | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          zone_id?: string | null
          asset_id?: string | null
          assigned_to?: string | null
          contractor_id?: string | null
          title: string
          description?: string | null
          status?: Database['public']['Enums']['task_status']
          priority?: Database['public']['Enums']['task_priority']
          due_date?: string | null
          completed_at?: string | null
          recurrence_rule?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          estimated_cost?: number | null
          actual_cost?: number | null
          tags?: string[] | null
          attachments?: Json | null
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          zone_id?: string | null
          asset_id?: string | null
          assigned_to?: string | null
          contractor_id?: string | null
          title?: string
          description?: string | null
          status?: Database['public']['Enums']['task_status']
          priority?: Database['public']['Enums']['task_priority']
          due_date?: string | null
          completed_at?: string | null
          recurrence_rule?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          estimated_cost?: number | null
          actual_cost?: number | null
          tags?: string[] | null
          attachments?: Json | null
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      sensors: {
        Row: {
          id: string
          property_id: string
          zone_id: string | null
          asset_id: string | null
          name: string
          description: string | null
          type: Database['public']['Enums']['sensor_type']
          external_id: string | null
          manufacturer: string | null
          model: string | null
          firmware_version: string | null
          unit: string | null
          min_value: number | null
          max_value: number | null
          alert_low: number | null
          alert_high: number | null
          sampling_interval_seconds: number
          battery_level: number | null
          last_seen_at: string | null
          is_active: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          zone_id?: string | null
          asset_id?: string | null
          name: string
          description?: string | null
          type?: Database['public']['Enums']['sensor_type']
          external_id?: string | null
          manufacturer?: string | null
          model?: string | null
          firmware_version?: string | null
          unit?: string | null
          min_value?: number | null
          max_value?: number | null
          alert_low?: number | null
          alert_high?: number | null
          sampling_interval_seconds?: number
          battery_level?: number | null
          last_seen_at?: string | null
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          zone_id?: string | null
          asset_id?: string | null
          name?: string
          description?: string | null
          type?: Database['public']['Enums']['sensor_type']
          external_id?: string | null
          manufacturer?: string | null
          model?: string | null
          firmware_version?: string | null
          unit?: string | null
          min_value?: number | null
          max_value?: number | null
          alert_low?: number | null
          alert_high?: number | null
          sampling_interval_seconds?: number
          battery_level?: number | null
          last_seen_at?: string | null
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      telemetry: {
        Row: {
          id: string
          sensor_id: string
          property_id: string
          value: number
          raw_payload: Json | null
          quality: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          sensor_id: string
          property_id: string
          value: number
          raw_payload?: Json | null
          quality?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          sensor_id?: string
          property_id?: string
          value?: number
          raw_payload?: Json | null
          quality?: number | null
          recorded_at?: string
          created_at?: string
        }
      }
      automations: {
        Row: {
          id: string
          property_id: string
          name: string
          description: string | null
          is_active: boolean
          trigger_type: string
          trigger_config: Json
          conditions: Json | null
          actions: Json
          last_triggered_at: string | null
          trigger_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          description?: string | null
          is_active?: boolean
          trigger_type: string
          trigger_config: Json
          conditions?: Json | null
          actions: Json
          last_triggered_at?: string | null
          trigger_count?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          trigger_type?: string
          trigger_config?: Json
          conditions?: Json | null
          actions?: Json
          last_triggered_at?: string | null
          trigger_count?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          property_id: string
          asset_id: string | null
          zone_id: string | null
          uploaded_by: string
          name: string
          description: string | null
          category: string | null
          file_url: string
          file_name: string
          file_size_bytes: number | null
          mime_type: string | null
          tags: string[] | null
          expiry_date: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          asset_id?: string | null
          zone_id?: string | null
          uploaded_by: string
          name: string
          description?: string | null
          category?: string | null
          file_url: string
          file_name: string
          file_size_bytes?: number | null
          mime_type?: string | null
          tags?: string[] | null
          expiry_date?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          asset_id?: string | null
          zone_id?: string | null
          uploaded_by?: string
          name?: string
          description?: string | null
          category?: string | null
          file_url?: string
          file_name?: string
          file_size_bytes?: number | null
          mime_type?: string | null
          tags?: string[] | null
          expiry_date?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contractors: {
        Row: {
          id: string
          property_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          specialties: string[] | null
          address: string | null
          notes: string | null
          rating: number | null
          is_preferred: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          specialties?: string[] | null
          address?: string | null
          notes?: string | null
          rating?: number | null
          is_preferred?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          specialties?: string[] | null
          address?: string | null
          notes?: string | null
          rating?: number | null
          is_preferred?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_records: {
        Row: {
          id: string
          property_id: string
          asset_id: string | null
          zone_id: string | null
          task_id: string | null
          contractor_id: string | null
          performed_by: string | null
          title: string
          description: string | null
          maintenance_type: string
          performed_at: string
          next_due_at: string | null
          cost: number | null
          labor_hours: number | null
          parts_used: Json | null
          attachments: Json | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          asset_id?: string | null
          zone_id?: string | null
          task_id?: string | null
          contractor_id?: string | null
          performed_by?: string | null
          title: string
          description?: string | null
          maintenance_type: string
          performed_at: string
          next_due_at?: string | null
          cost?: number | null
          labor_hours?: number | null
          parts_used?: Json | null
          attachments?: Json | null
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          asset_id?: string | null
          zone_id?: string | null
          task_id?: string | null
          contractor_id?: string | null
          performed_by?: string | null
          title?: string
          description?: string | null
          maintenance_type?: string
          performed_at?: string
          next_due_at?: string | null
          cost?: number | null
          labor_hours?: number | null
          parts_used?: Json | null
          attachments?: Json | null
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          property_id: string | null
          title: string
          body: string
          type: string
          category: string | null
          action_url: string | null
          metadata: Json | null
          is_read: boolean
          read_at: string | null
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id?: string | null
          title: string
          body: string
          type: string
          category?: string | null
          action_url?: string | null
          metadata?: Json | null
          is_read?: boolean
          read_at?: string | null
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string | null
          title?: string
          body?: string
          type?: string
          category?: string | null
          action_url?: string | null
          metadata?: Json | null
          is_read?: boolean
          read_at?: string | null
          is_archived?: boolean
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          property_id: string
          user_id: string
          role: string
          content: string
          model: string | null
          tokens_used: number | null
          context_snapshot: Json | null
          attachments: Json | null
          parent_message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          role: string
          content: string
          model?: string | null
          tokens_used?: number | null
          context_snapshot?: Json | null
          attachments?: Json | null
          parent_message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          role?: string
          content?: string
          model?: string | null
          tokens_used?: number | null
          context_snapshot?: Json | null
          attachments?: Json | null
          parent_message_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      zone_type:
        | 'forest'
        | 'greenhouse'
        | 'orchard'
        | 'lake'
        | 'garden'
        | 'house'
        | 'driveway'
        | 'smart_home'
        | 'custom'
      asset_category:
        | 'device'
        | 'plant'
        | 'equipment'
        | 'vehicle'
        | 'furniture'
        | 'structure'
        | 'other'
      task_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
      task_priority: 'low' | 'normal' | 'high' | 'urgent'
      sensor_type:
        | 'temperature'
        | 'humidity'
        | 'co2'
        | 'moisture'
        | 'motion'
        | 'door'
        | 'light'
        | 'water_level'
        | 'custom'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ---------------------------------------------------------------------------
// Convenience type aliases
// ---------------------------------------------------------------------------

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// ---------------------------------------------------------------------------
// Named row types for direct import
// ---------------------------------------------------------------------------

export type Profile = Tables<'profiles'>
export type Property = Tables<'properties'>
export type Parcel = Tables<'parcels'>
export type Zone = Tables<'zones'>
export type Asset = Tables<'assets'>
export type AssetQRCode = Tables<'asset_qr_codes'>
export type Task = Tables<'tasks'>
export type Sensor = Tables<'sensors'>
export type Telemetry = Tables<'telemetry'>
export type Automation = Tables<'automations'>
export type Document = Tables<'documents'>
export type Contractor = Tables<'contractors'>
export type MaintenanceRecord = Tables<'maintenance_records'>
export type Notification = Tables<'notifications'>
export type ChatMessage = Tables<'chat_messages'>

// ---------------------------------------------------------------------------
// Named enum types
// ---------------------------------------------------------------------------

export type ZoneType = Enums<'zone_type'>
export type AssetCategory = Enums<'asset_category'>
export type TaskStatus = Enums<'task_status'>
export type TaskPriority = Enums<'task_priority'>
export type SensorType = Enums<'sensor_type'>
