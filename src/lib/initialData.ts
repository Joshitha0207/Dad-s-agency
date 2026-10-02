import { Product } from '../types/product';
import { Category } from '../types/category';
import { Order } from '../types/order';
import { CustomerProfile } from '../types/customer';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Ice Cream', slug: 'ice-cream', description: 'Delicious creamy ice creams in all flavors', icon: '🍦', display_order: 1, is_enabled: true },
  { id: 'cat-2', name: 'Dairy', slug: 'dairy', description: 'Fresh farm milk, curd, paneer, butter and cheese', icon: '🥛', display_order: 2, is_enabled: true },
  { id: 'cat-3', name: 'Chocolates', slug: 'chocolates', description: 'Premium chocolates, Silk, KitKat and delights', icon: '🍫', display_order: 3, is_enabled: true }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Belgian Chocolate Ice Cream Cup',
    description: 'Rich, smooth Belgian chocolate ice cream in a handy cup. Prepared with pure cream.',
    category: 'Ice Cream',
    product_type: 'Cup',
    price: 40,
    mrp: 50,
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 35,
    low_stock_limit: 5,
    unit: '120ml',
    is_available: true,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Royal Vanilla Ice Cream Cone',
    description: 'Crispy waffle cone filled with double vanilla bean ice cream and chocolate drizzle.',
    category: 'Ice Cream',
    product_type: 'Cone',
    price: 35,
    mrp: 40,
    image_url: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 28,
    low_stock_limit: 5,
    unit: '110ml',
    is_available: true,
    rating: 4.7,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Butterscotch Family Pack',
    description: 'Crunchy butterscotch praline pieces blended into rich caramel ice cream. Perfect for family!',
    category: 'Ice Cream',
    product_type: 'Family Pack',
    price: 180,
    mrp: 210,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 12,
    low_stock_limit: 3,
    unit: '750ml',
    is_available: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Mango Alphonsa Ice Cream Tub',
    description: 'Authentic Alphonso mango pulp crafted into luscious tropical ice cream.',
    category: 'Ice Cream',
    product_type: 'Tub',
    price: 220,
    mrp: 250,
    image_url: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 10,
    low_stock_limit: 4,
    unit: '1000ml',
    is_available: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Choco Crunch Ice Cream Bar',
    description: 'Crunchy chocolate shell dipped with roasted almonds over vanilla ice cream stick.',
    category: 'Ice Cream',
    product_type: 'Bar',
    price: 50,
    mrp: 60,
    image_url: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 22,
    low_stock_limit: 5,
    unit: '80ml',
    is_available: true,
    rating: 4.6,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Strawberry Delight Ice Cream Stick',
    description: 'Real strawberry fruit swirl ice cream on stick. Kids favorite!',
    category: 'Ice Cream',
    product_type: 'Stick',
    price: 30,
    mrp: 35,
    image_url: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 4,
    low_stock_limit: 5,
    unit: '70ml',
    is_available: true,
    rating: 4.5,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Special Loaded Brownie Sundae',
    description: 'Fudge brownie cubes topped with vanilla & chocolate scoops, hot fudge & nuts.',
    category: 'Ice Cream',
    product_type: 'Sundae',
    price: 120,
    mrp: 140,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 15,
    low_stock_limit: 3,
    unit: '1 Serving',
    is_available: true,
    rating: 5.0,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Fresh Pure Milk Packet',
    description: 'Pasteurised full cream fresh farm milk delivered cool every morning.',
    category: 'Dairy',
    product_type: 'Packet',
    price: 30,
    mrp: 32,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 60,
    low_stock_limit: 10,
    unit: '500ml',
    is_available: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Fresh Farm Thick Curd',
    description: 'Thick, creamy, set curd made from pure cow milk. Perfect for meals.',
    category: 'Dairy',
    product_type: 'Packet',
    price: 35,
    mrp: 35,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 45,
    low_stock_limit: 8,
    unit: '500g',
    is_available: true,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Fresh Soft Malai Paneer',
    description: 'Soft, moist and spongy paneer cubes ideal for curries and snacks.',
    category: 'Dairy',
    product_type: 'Packet',
    price: 110,
    mrp: 120,
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 18,
    low_stock_limit: 5,
    unit: '200g',
    is_available: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'Pasteurised Salted Butter Block',
    description: 'Pure cream salted butter for rich baking, rotis and spreading.',
    category: 'Dairy',
    product_type: 'Box',
    price: 56,
    mrp: 58,
    image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 25,
    low_stock_limit: 5,
    unit: '100g',
    is_available: true,
    rating: 4.7,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Process Cheese Slices Pack',
    description: 'Creamy melted cheese slices for sandwiches, burgers and toasts.',
    category: 'Dairy',
    product_type: 'Packet',
    price: 140,
    mrp: 150,
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 14,
    low_stock_limit: 4,
    unit: '200g (10 Slices)',
    is_available: true,
    rating: 4.6,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-13',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    description: 'Silky, smooth milk chocolate that melts in your mouth.',
    category: 'Chocolates',
    product_type: 'Piece',
    price: 175,
    mrp: 180,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 30,
    low_stock_limit: 5,
    unit: '150g',
    is_available: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-14',
    name: 'Nestle KitKat 4-Finger Bar',
    description: 'Crispy wafer fingers covered with smooth milk chocolate. Have a break!',
    category: 'Chocolates',
    product_type: 'Piece',
    price: 30,
    mrp: 30,
    image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 50,
    low_stock_limit: 10,
    unit: '38g',
    is_available: true,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-15',
    name: 'Ferrero Rocher Hazelnut Box',
    description: 'Whole crunchy hazelnut in delicious creamy filling enclosed in crisp wafer shell.',
    category: 'Chocolates',
    product_type: 'Box',
    price: 350,
    mrp: 399,
    image_url: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&w=600&q=80',
    stock_quantity: 8,
    low_stock_limit: 3,
    unit: '16 Pieces',
    is_available: true,
    rating: 5.0,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    customer_id: 'cust-1',
    customer_name: 'Anand Kumar',
    customer_email: 'anand@example.com',
    customer_phone: '9876543210',
    order_number: 'DAD-2026-0001',
    subtotal: 215,
    delivery_fee: 30,
    total_amount: 245,
    payment_method: 'UPI',
    payment_status: 'Paid',
    order_status: 'Out for Delivery',
    delivery_address: '15, Vivekanandar Nagar Main Rd, College Road, Tiruppur',
    delivery_instructions: 'Please call before arriving',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-1',
        product_id: 'prod-1',
        product_name: 'Belgian Chocolate Ice Cream Cup',
        quantity: 2,
        unit_price: 40,
        total_price: 80
      },
      {
        id: 'item-2',
        order_id: 'ord-1',
        product_id: 'prod-13',
        product_name: 'Cadbury Dairy Milk Silk Chocolate',
        quantity: 1,
        unit_price: 135,
        total_price: 135
      }
    ]
  },
  {
    id: 'ord-2',
    customer_id: 'cust-2',
    customer_name: 'Priya Sundaram',
    customer_email: 'priya@example.com',
    customer_phone: '9842109876',
    order_number: 'DAD-2026-0002',
    subtotal: 180,
    delivery_fee: 30,
    total_amount: 210,
    payment_method: 'COD',
    payment_status: 'Pending',
    order_status: 'Preparing',
    delivery_address: 'Flat 302, Green Acres Apt, College Road, Tiruppur',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    items: [
      {
        id: 'item-3',
        order_id: 'ord-2',
        product_id: 'prod-3',
        product_name: 'Butterscotch Family Pack',
        quantity: 1,
        unit_price: 180,
        total_price: 180
      }
    ]
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    email: 'anand@example.com',
    full_name: 'Anand Kumar',
    phone: '9876543210',
    password: 'password123',
    address: '15, Vivekanandar Nagar Main Rd, College Road, Tiruppur',
    role: 'customer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    total_orders: 3,
    total_spent: 680
  },
  {
    id: 'cust-2',
    email: 'priya@example.com',
    full_name: 'Priya Sundaram',
    phone: '9842109876',
    password: 'password123',
    address: 'Flat 302, Green Acres Apt, College Road, Tiruppur',
    role: 'customer',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    total_orders: 2,
    total_spent: 420
  }
];

export const SQL_SCHEMA_SETUP_SCRIPT = `-- SQL Schema for Dad's Agency - Run this in Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer',
  is_disabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  product_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  image_url TEXT,
  stock_quantity INT DEFAULT 0,
  low_stock_limit INT DEFAULT 5,
  unit TEXT DEFAULT 'piece',
  is_available BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 30,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  order_status TEXT DEFAULT 'Pending',
  delivery_address TEXT NOT NULL,
  delivery_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public reads for categories & products
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

-- Allow authenticated users to manage their profiles & orders
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR customer_id IS NULL);
CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Users create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Create Storage Bucket 'product-images' if not exists
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
`;
