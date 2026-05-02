export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role_type"]
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["user_role_type"]
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role_type"]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          boxes: number
          boxes_per_crate: number
          crates: number
          id: string
          order_id: string
          product_code: string
          product_id: string
          product_name: string
          remaining_boxes: number
          total_units: number
          unit_price: number
          units_per_box: number
          units_per_crate: number
        }
        Insert: {
          boxes: number
          boxes_per_crate: number
          crates: number
          id?: string
          order_id: string
          product_code: string
          product_id: string
          product_name: string
          remaining_boxes: number
          total_units: number
          unit_price: number
          units_per_box: number
          units_per_crate: number
        }
        Update: {
          boxes?: number
          boxes_per_crate?: number
          crates?: number
          id?: string
          order_id?: string
          product_code?: string
          product_id?: string
          product_name?: string
          remaining_boxes?: number
          total_units?: number
          unit_price?: number
          units_per_box?: number
          units_per_crate?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          created_by: string
          delivered_at: string | null
          delivered_by: string | null
          id: string
          separated_at: string | null
          separated_by: string | null
          status: Database["public"]["Enums"]["order_status"]
          store: Database["public"]["Enums"]["store_type"]
          total_boxes: number
          total_crates: number
          total_remaining_boxes: number
        }
        Insert: {
          created_at?: string
          created_by: string
          delivered_at?: string | null
          delivered_by?: string | null
          id?: string
          separated_at?: string | null
          separated_by?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store: Database["public"]["Enums"]["store_type"]
          total_boxes?: number
          total_crates?: number
          total_remaining_boxes?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          delivered_at?: string | null
          delivered_by?: string | null
          id?: string
          separated_at?: string | null
          separated_by?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          store?: Database["public"]["Enums"]["store_type"]
          total_boxes?: number
          total_crates?: number
          total_remaining_boxes?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          boxes_per_crate: number
          category: Database["public"]["Enums"]["product_category"]
          code: string
          created_at: string
          id: string
          name: string
          unit_price: number
          units_per_box: number
          units_per_crate: number
        }
        Insert: {
          active?: boolean
          boxes_per_crate?: number
          category: Database["public"]["Enums"]["product_category"]
          code: string
          created_at?: string
          id?: string
          name: string
          unit_price?: number
          units_per_box?: number
          units_per_crate?: number
        }
        Update: {
          active?: boolean
          boxes_per_crate?: number
          category?: Database["public"]["Enums"]["product_category"]
          code?: string
          created_at?: string
          id?: string
          name?: string
          unit_price?: number
          units_per_box?: number
          units_per_crate?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role_type"]
      }
      is_admin_or_suporte: { Args: { _user_id: string }; Returns: boolean }
      is_suporte: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      order_status: "criado" | "separado" | "entregue"
      product_category:
        | "picole-creme"
        | "picole-fruta"
        | "picole-fruta-calda"
        | "picole-creme-speciale"
        | "picole-ituzinho"
        | "picole-kids"
        | "picole-super-barrita"
        | "picole-barrita"
        | "picole-bombom"
        | "picole-la-sobremesa"
        | "picole-los-palitos"
        | "picole-diamond"
        | "picole-grego"
        | "picole-zero"
        | "picole-seletto"
        | "picole-chocotine"
        | "picole-linha-mais"
        | "picole-pet"
        | "sorvete-pote-2l"
        | "sorvete-classico-1-5l"
        | "sorvete-napolitano"
        | "sorvete-grand-nevado"
        | "sorvete-torta"
        | "sorvete-sundae"
        | "sorvete-napolicup"
        | "sorvete-copinho-gourmet"
        | "sorvete-best-cup"
        | "sorvete-zero"
        | "sorvete-kids"
        | "acai"
        | "camisetas"
        | "acessorios"
        | "torrone"
        | "cobertura"
        | "wafer"
        | "isopor"
        | "casquinha"
        | "tubon"
        | "balas-doces"
        | "salgadinhos"
        | "revenda"
        | "extras"
      store_type: "morretes" | "meia_praia" | "pereque" | "centro"
      user_role_type:
        | "conferente"
        | "logistica"
        | "entregador"
        | "admin"
        | "suporte"
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
  public: {
    Enums: {
      order_status: ["criado", "separado", "entregue"],
      product_category: [
        "picole-creme",
        "picole-fruta",
        "picole-fruta-calda",
        "picole-creme-speciale",
        "picole-ituzinho",
        "picole-kids",
        "picole-super-barrita",
        "picole-barrita",
        "picole-bombom",
        "picole-la-sobremesa",
        "picole-los-palitos",
        "picole-diamond",
        "picole-grego",
        "picole-zero",
        "picole-seletto",
        "picole-chocotine",
        "picole-linha-mais",
        "picole-pet",
        "sorvete-pote-2l",
        "sorvete-classico-1-5l",
        "sorvete-napolitano",
        "sorvete-grand-nevado",
        "sorvete-torta",
        "sorvete-sundae",
        "sorvete-napolicup",
        "sorvete-copinho-gourmet",
        "sorvete-best-cup",
        "sorvete-zero",
        "sorvete-kids",
        "acai",
        "camisetas",
        "acessorios",
        "torrone",
        "cobertura",
        "wafer",
        "isopor",
        "casquinha",
        "tubon",
        "balas-doces",
        "salgadinhos",
        "revenda",
        "extras",
      ],
      store_type: ["morretes", "meia_praia", "pereque", "centro"],
      user_role_type: [
        "conferente",
        "logistica",
        "entregador",
        "admin",
        "suporte",
      ],
    },
  },
} as const
