export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  password?: string;
  address: string;
  role: 'customer' | 'admin';
  is_disabled?: boolean;
  created_at: string;
  updated_at?: string;
  total_orders?: number;
  total_spent?: number;
}
