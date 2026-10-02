export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  display_order?: number;
  is_enabled: boolean;
  created_at?: string;
}
