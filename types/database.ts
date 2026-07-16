export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          district: string | null
          id: string
          is_default: boolean
          label: string
          location: unknown
          postal_code: string | null
          region: string
          street: string
          street_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string
          location?: unknown
          postal_code?: string | null
          region: string
          street: string
          street_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean
          label?: string
          location?: unknown
          postal_code?: string | null
          region?: string
          street?: string
          street_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          reason: string
        }
        Insert: {
          action: string
          admin_id: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          reason: string
        }
        Update: {
          action?: string
          admin_id?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analyses: {
        Row: {
          confidence: number
          created_at: string
          id: string
          is_fallback: boolean
          model: string | null
          provider: string
          request_id: string
          required_skills: string[]
          suggested_category_id: string | null
          summary: string
          visible_risks: string[]
        }
        Insert: {
          confidence: number
          created_at?: string
          id?: string
          is_fallback?: boolean
          model?: string | null
          provider: string
          request_id: string
          required_skills?: string[]
          suggested_category_id?: string | null
          summary: string
          visible_risks?: string[]
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          is_fallback?: boolean
          model?: string | null
          provider?: string
          request_id?: string
          required_skills?: string[]
          suggested_category_id?: string | null
          summary?: string
          visible_risks?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analyses_suggested_category_id_fkey"
            columns: ["suggested_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_events: {
        Row: {
          actor_id: string
          booking_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["booking_status"] | null
          id: string
          note_language: string | null
          note_original: string | null
          to_status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          actor_id: string
          booking_id: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["booking_status"] | null
          id?: string
          note_language?: string | null
          note_original?: string | null
          to_status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          actor_id?: string
          booking_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["booking_status"] | null
          id?: string
          note_language?: string | null
          note_original?: string | null
          to_status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_status_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancelled_reason: string | null
          created_at: string
          customer_id: string
          id: string
          idempotency_key: string
          price_centavos: number
          request_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          worker_id: string
          worker_service_id: string
        }
        Insert: {
          cancelled_reason?: string | null
          created_at?: string
          customer_id: string
          id?: string
          idempotency_key: string
          price_centavos: number
          request_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          worker_id: string
          worker_service_id: string
        }
        Update: {
          cancelled_reason?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          idempotency_key?: string
          price_centavos?: number
          request_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          worker_id?: string
          worker_service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_worker_service_id_fkey"
            columns: ["worker_service_id"]
            isOneToOne: false
            referencedRelation: "worker_services"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_records: {
        Row: {
          amount_centavos: number
          booking_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          idempotency_key: string | null
          method: string
          status: Database["public"]["Enums"]["cash_status"]
          updated_at: string
        }
        Insert: {
          amount_centavos: number
          booking_id: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          method?: string
          status?: Database["public"]["Enums"]["cash_status"]
          updated_at?: string
        }
        Update: {
          amount_centavos?: number
          booking_id?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          method?: string
          status?: Database["public"]["Enums"]["cash_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_records_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      identity_verifications: {
        Row: {
          back_path: string
          front_path: string
          id: string
          id_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_path: string | null
          status: Database["public"]["Enums"]["verification_status"]
          submitted_at: string
          user_id: string
          version: number
        }
        Insert: {
          back_path: string
          front_path: string
          id?: string
          id_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_path?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string
          user_id: string
          version?: number
        }
        Update: {
          back_path?: string
          front_path?: string
          id?: string
          id_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_path?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "identity_verifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          booking_alerts: boolean
          message_alerts: boolean
          promotions: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_alerts?: boolean
          message_alerts?: boolean
          promotions?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_alerts?: boolean
          message_alerts?: boolean
          promotions?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          avatar_path: string | null
          birthday: string | null
          created_at: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          middle_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          avatar_path?: string | null
          birthday?: string | null
          created_at?: string
          first_name?: string
          gender?: string | null
          id: string
          last_name?: string
          middle_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          avatar_path?: string | null
          birthday?: string | null
          created_at?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          middle_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          algorithm_version: string
          availability_score: number
          created_at: string
          distance_score: number
          experience_score: number
          explanation: string
          id: string
          rank: number
          rating_score: number
          request_id: string
          skill_score: number
          total_score: number
          worker_id: string
        }
        Insert: {
          algorithm_version?: string
          availability_score: number
          created_at?: string
          distance_score: number
          experience_score: number
          explanation: string
          id?: string
          rank: number
          rating_score: number
          request_id: string
          skill_score: number
          total_score: number
          worker_id: string
        }
        Update: {
          algorithm_version?: string
          availability_score?: number
          created_at?: string
          distance_score?: number
          experience_score?: number
          explanation?: string
          id?: string
          rank?: number
          rating_score?: number
          request_id?: string
          skill_score?: number
          total_score?: number
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          is_hidden: boolean
          rating: number
          updated_at: string
          worker_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_hidden?: boolean
          rating: number
          updated_at?: string
          worker_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_hidden?: boolean
          rating?: number
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      route_snapshots: {
        Row: {
          booking_id: string
          calculated_at: string
          destination: unknown
          distance_meters: number
          duration_seconds: number
          geometry: Json | null
          id: string
          origin: unknown
          provider: string
          status: Database["public"]["Enums"]["route_status"]
          worker_location_snapshot: boolean
        }
        Insert: {
          booking_id: string
          calculated_at?: string
          destination: unknown
          distance_meters: number
          duration_seconds: number
          geometry?: Json | null
          id?: string
          origin: unknown
          provider: string
          status: Database["public"]["Enums"]["route_status"]
          worker_location_snapshot?: boolean
        }
        Update: {
          booking_id?: string
          calculated_at?: string
          destination?: unknown
          distance_meters?: number
          duration_seconds?: number
          geometry?: Json | null
          id?: string
          origin?: unknown
          provider?: string
          status?: Database["public"]["Enums"]["route_status"]
          worker_location_snapshot?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "route_snapshots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_request_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          object_path: string
          owner_id: string
          request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_type?: string
          object_path: string
          owner_id: string
          request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          object_path?: string
          owner_id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_request_media_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_media_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          address_id: string
          assigned_worker_id: string | null
          category_id: string
          created_at: string
          customer_id: string
          description_language: string
          description_original: string
          id: string
          location: unknown
          parts_description: string | null
          parts_known: boolean | null
          published_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency: string
        }
        Insert: {
          address_id: string
          assigned_worker_id?: string | null
          category_id: string
          created_at?: string
          customer_id: string
          description_language?: string
          description_original: string
          id?: string
          location: unknown
          parts_description?: string | null
          parts_known?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency: string
        }
        Update: {
          address_id?: string
          assigned_worker_id?: string | null
          category_id?: string
          created_at?: string
          customer_id?: string
          description_language?: string
          description_original?: string
          id?: string
          location?: unknown
          parts_description?: string | null
          parts_known?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_applications: {
        Row: {
          base_location: unknown
          created_at: string
          experience_summary: string
          experience_years: number
          id: string
          rating: number
          rejection_reason: string | null
          review_count: number
          reviewed_at: string | null
          reviewed_by: string | null
          service_radius_meters: number
          status: Database["public"]["Enums"]["worker_application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          base_location?: unknown
          created_at?: string
          experience_summary: string
          experience_years?: number
          id?: string
          rating?: number
          rejection_reason?: string | null
          review_count?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_radius_meters?: number
          status?: Database["public"]["Enums"]["worker_application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          base_location?: unknown
          created_at?: string
          experience_summary?: string
          experience_years?: number
          id?: string
          rating?: number
          rejection_reason?: string | null
          review_count?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_radius_meters?: number
          status?: Database["public"]["Enums"]["worker_application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_availability: {
        Row: {
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          weekday: number
          worker_id: string
        }
        Insert: {
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          weekday: number
          worker_id: string
        }
        Update: {
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          weekday?: number
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_availability_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_services: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          price_centavos: number
          title: string
          updated_at: string
          worker_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price_centavos: number
          title: string
          updated_at?: string
          worker_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price_centavos?: number
          title?: string
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_services_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_translations: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          model: string | null
          original_text: string
          provider: string
          source_language: string
          status: Database["public"]["Enums"]["translation_status"]
          target_language: string
          translated_text: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          model?: string | null
          original_text: string
          provider: string
          source_language: string
          status: Database["public"]["Enums"]["translation_status"]
          target_language: string
          translated_text?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          model?: string | null
          original_text?: string
          provider?: string
          source_language?: string
          status?: Database["public"]["Enums"]["translation_status"]
          target_language?: string
          translated_text?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_correct_service_price: {
        Args: {
          next_price_centavos: number
          reason: string
          service_uuid: string
        }
        Returns: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          price_centavos: number
          title: string
          updated_at: string
          worker_id: string
        }
        SetofOptions: {
          from: "*"
          to: "worker_services"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_moderate_review: {
        Args: { hidden: boolean; reason: string; review_uuid: string }
        Returns: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          is_hidden: boolean
          rating: number
          updated_at: string
          worker_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reviews"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_override_booking: {
        Args: {
          booking_uuid: string
          next_status: Database["public"]["Enums"]["booking_status"]
          reason: string
        }
        Returns: {
          cancelled_reason: string | null
          created_at: string
          customer_id: string
          id: string
          idempotency_key: string
          price_centavos: number
          request_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          worker_id: string
          worker_service_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_review_identity: {
        Args: {
          decision: Database["public"]["Enums"]["verification_status"]
          reason: string
          verification_uuid: string
        }
        Returns: {
          back_path: string
          front_path: string
          id: string
          id_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_path: string | null
          status: Database["public"]["Enums"]["verification_status"]
          submitted_at: string
          user_id: string
          version: number
        }
        SetofOptions: {
          from: "*"
          to: "identity_verifications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_review_worker: {
        Args: {
          application_uuid: string
          decision: Database["public"]["Enums"]["worker_application_status"]
          reason: string
        }
        Returns: {
          base_location: unknown
          created_at: string
          experience_summary: string
          experience_years: number
          id: string
          rating: number
          rejection_reason: string | null
          review_count: number
          reviewed_at: string | null
          reviewed_by: string | null
          service_radius_meters: number
          status: Database["public"]["Enums"]["worker_application_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "worker_applications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_set_account_status: {
        Args: {
          next_status: Database["public"]["Enums"]["account_status"]
          reason: string
          user_uuid: string
        }
        Returns: {
          account_status: Database["public"]["Enums"]["account_status"]
          avatar_path: string | null
          birthday: string | null
          created_at: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          middle_name: string | null
          phone: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_set_cash_status: {
        Args: {
          cash_uuid: string
          next_status: Database["public"]["Enums"]["cash_status"]
          reason: string
        }
        Returns: {
          amount_centavos: number
          booking_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          idempotency_key: string | null
          method: string
          status: Database["public"]["Enums"]["cash_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "cash_records"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_set_category_active: {
        Args: { active: boolean; category_uuid: string; reason: string }
        Returns: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "categories"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      confirm_cash: {
        Args: { booking_uuid: string; request_key: string }
        Returns: {
          amount_centavos: number
          booking_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          idempotency_key: string | null
          method: string
          status: Database["public"]["Enums"]["cash_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "cash_records"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_worker_id: { Args: never; Returns: string }
      generate_recommendations: {
        Args: { request_uuid: string }
        Returns: {
          algorithm_version: string
          availability_score: number
          created_at: string
          distance_score: number
          experience_score: number
          explanation: string
          id: string
          rank: number
          rating_score: number
          request_id: string
          skill_score: number
          total_score: number
          worker_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "recommendations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_booking_route_context: {
        Args: { booking_uuid: string }
        Returns: Json
      }
      get_booking_service_address: {
        Args: { booking_uuid: string }
        Returns: string
      }
      get_my_private_profile: {
        Args: never
        Returns: {
          account_status: Database["public"]["Enums"]["account_status"]
          avatar_path: string | null
          birthday: string | null
          created_at: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          middle_name: string | null
          phone: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_request_coordinates: { Args: { request_uuid: string }; Returns: Json }
      has_approved_id: { Args: { user_uuid?: string }; Returns: boolean }
      has_role: {
        Args: { wanted: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_active_account: { Args: { user_uuid?: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      publish_request: {
        Args: { request_uuid: string }
        Returns: {
          address_id: string
          assigned_worker_id: string | null
          category_id: string
          created_at: string
          customer_id: string
          description_language: string
          description_original: string
          id: string
          location: unknown
          parts_description: string | null
          parts_known: boolean | null
          published_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency: string
        }
        SetofOptions: {
          from: "*"
          to: "service_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      save_route_snapshot: {
        Args: {
          booking_uuid: string
          destination_lat: number
          destination_lon: number
          distance_value: number
          duration_value: number
          is_worker_snapshot?: boolean
          origin_lat: number
          origin_lon: number
          provider_name: string
          route_geometry: Json
          route_state: Database["public"]["Enums"]["route_status"]
        }
        Returns: {
          booking_id: string
          calculated_at: string
          destination: unknown
          distance_meters: number
          duration_seconds: number
          geometry: Json | null
          id: string
          origin: unknown
          provider: string
          status: Database["public"]["Enums"]["route_status"]
          worker_location_snapshot: boolean
        }
        SetofOptions: {
          from: "*"
          to: "route_snapshots"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      save_workflow_translation: {
        Args: {
          entity_kind: string
          entity_uuid: string
          model_name?: string
          original_value: string
          provider_name: string
          source_lang: string
          target_lang: string
          translated_value: string
          translation_state: Database["public"]["Enums"]["translation_status"]
        }
        Returns: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          model: string | null
          original_text: string
          provider: string
          source_language: string
          status: Database["public"]["Enums"]["translation_status"]
          target_language: string
          translated_text: string | null
        }
        SetofOptions: {
          from: "*"
          to: "workflow_translations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      select_worker: {
        Args: {
          request_key: string
          request_uuid: string
          worker_service_uuid: string
        }
        Returns: {
          cancelled_reason: string | null
          created_at: string
          customer_id: string
          id: string
          idempotency_key: string
          price_centavos: number
          request_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          worker_id: string
          worker_service_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_review: {
        Args: { booking_uuid: string; review_comment?: string; stars: number }
        Returns: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          is_hidden: boolean
          rating: number
          updated_at: string
          worker_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reviews"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_booking: {
        Args: {
          booking_uuid: string
          next_status: Database["public"]["Enums"]["booking_status"]
          note?: string
          note_lang?: string
        }
        Returns: {
          cancelled_reason: string | null
          created_at: string
          customer_id: string
          id: string
          idempotency_key: string
          price_centavos: number
          request_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          worker_id: string
          worker_service_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      account_status: "active" | "suspended" | "deactivated"
      app_role: "customer" | "worker" | "admin"
      booking_status:
        | "scheduled"
        | "accepted"
        | "en_route"
        | "arrived"
        | "in_progress"
        | "pending_confirmation"
        | "completed"
        | "cancelled"
      cash_status: "unpaid" | "paid" | "disputed" | "void"
      request_status: "draft" | "searching" | "assigned" | "cancelled"
      route_status: "complete" | "estimated" | "failed"
      translation_status: "complete" | "partial" | "failed"
      verification_status:
        | "pending"
        | "approved"
        | "rejected"
        | "resubmission_required"
      worker_application_status:
        | "pending"
        | "approved"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_status: ["active", "suspended", "deactivated"],
      app_role: ["customer", "worker", "admin"],
      booking_status: [
        "scheduled",
        "accepted",
        "en_route",
        "arrived",
        "in_progress",
        "pending_confirmation",
        "completed",
        "cancelled",
      ],
      cash_status: ["unpaid", "paid", "disputed", "void"],
      request_status: ["draft", "searching", "assigned", "cancelled"],
      route_status: ["complete", "estimated", "failed"],
      translation_status: ["complete", "partial", "failed"],
      verification_status: [
        "pending",
        "approved",
        "rejected",
        "resubmission_required",
      ],
      worker_application_status: [
        "pending",
        "approved",
        "rejected",
        "suspended",
      ],
    },
  },
} as const

