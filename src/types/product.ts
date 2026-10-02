export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  product_type: string; // Cup, Cone, Bar, Stick, Family Pack, Tub, Bottle, Packet, Box, Piece, Kg, Litre
  price: number;
  mrp: number;
  image_url: string;
  stock_quantity: number;
  low_stock_limit: number;
  unit: string; // e.g., '100ml', '500g', 'pack', 'piece'
  is_available: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export type ProductType = 
  | 'Cup' 
  | 'Cone' 
  | 'Bar' 
  | 'Stick' 
  | 'Family Pack' 
  | 'Tub' 
  | 'Sundae' 
  | 'Bottle' 
  | 'Packet' 
  | 'Box' 
  | 'Piece' 
  | 'Kg' 
  | 'Litre';
