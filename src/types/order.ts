export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'UPI';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_number: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_address: string;
  delivery_instructions?: string;
  delivery_slot?: string;
  upi_reference?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}
