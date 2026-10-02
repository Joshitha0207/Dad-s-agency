import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CUSTOMERS, INITIAL_ORDERS } from './src/lib/initialData';
import { generateOrderNumber } from './src/utils/formatting';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Interface for backend store
interface StoreData {
  customers: Array<{
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
  }>;
  products: Array<any>;
  categories: Array<any>;
  orders: Array<any>;
  settings: {
    shopName: string;
    address: string;
    phone: string;
    ownerWhatsApp: string;
    instagram: string;
    deliveryFee: number;
  };
  whatsappLogs: Array<{
    id: string;
    orderId: string;
    orderNumber: string;
    recipientPhone: string;
    message: string;
    sentAt: string;
  }>;
}

// Ensure database file and initial data exist
function initDb(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure defaults for any missing keys
      if (!parsed.customers) parsed.customers = INITIAL_CUSTOMERS;
      if (!parsed.products) parsed.products = INITIAL_PRODUCTS;
      if (!parsed.categories) parsed.categories = INITIAL_CATEGORIES;
      if (!parsed.orders) parsed.orders = INITIAL_ORDERS;
      if (!parsed.settings) {
        parsed.settings = {
          shopName: "Dad's Agency",
          address: 'Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu',
          phone: '9843041633',
          ownerWhatsApp: '9843041633',
          instagram: 'https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x',
          deliveryFee: 30
        };
      }
      if (!parsed.whatsappLogs) parsed.whatsappLogs = [];
      return parsed;
    } catch (err) {
      console.error('Error reading db, reinitializing:', err);
    }
  }

  const initialData: StoreData = {
    customers: INITIAL_CUSTOMERS,
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: INITIAL_ORDERS,
    settings: {
      shopName: "Dad's Agency",
      address: 'Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu',
      phone: '9843041633',
      ownerWhatsApp: '9843041633',
      instagram: 'https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x',
      deliveryFee: 30
    },
    whatsappLogs: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let db = initDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db:', err);
  }
}

function cleanPhone(phone: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  return digits;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // AUTH & CUSTOMER ENDPOINTS
  // ==========================================

  // Customer registration
  app.post('/api/auth/register', (req, res) => {
    const { fullName, phone, password, address, email } = req.body;
    if (!fullName || !phone || !password) {
      return res.status(400).json({ success: false, error: 'Full name, mobile number, and password are required.' });
    }

    const cleaned = cleanPhone(phone);
    if (cleaned.length !== 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    // Check if phone number already registered
    const exists = db.customers.find((c) => cleanPhone(c.phone) === cleaned);
    if (exists) {
      return res.status(409).json({
        success: false,
        error: `Mobile number ${cleaned} is already registered! Please log in with your password.`
      });
    }

    const newCustomer = {
      id: `cust-${Date.now()}`,
      full_name: fullName.trim(),
      phone: cleaned,
      password: password,
      email: (email || `${cleaned}@dadsagency.com`).trim(),
      address: (address || 'Vivekanandar Nagar, College Road, Tiruppur').trim(),
      role: 'customer' as const,
      created_at: new Date().toISOString(),
      total_orders: 0,
      total_spent: 0
    };

    db.customers.unshift(newCustomer);
    saveDb();

    // Do not leak password back to client
    const { password: _, ...customerSafe } = newCustomer;
    return res.status(201).json({ success: true, customer: customerSafe });
  });

  // Customer login
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Mobile number / email and password are required.' });
    }

    const trimmed = identifier.trim();
    const cleaned = cleanPhone(trimmed);

    let customer = null;
    if (cleaned.length === 10) {
      customer = db.customers.find((c) => cleanPhone(c.phone) === cleaned);
    }
    if (!customer) {
      customer = db.customers.find((c) => c.email.toLowerCase() === trimmed.toLowerCase());
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: cleaned.length === 10
          ? `Mobile number ${cleaned} is not registered yet. Please create an account.`
          : 'No account found with this email or mobile number.'
      });
    }

    if (customer.is_disabled) {
      return res.status(403).json({ success: false, error: 'Your account is disabled. Please contact support.' });
    }

    const expectedPassword = customer.password || 'password123';
    if (password !== expectedPassword) {
      return res.status(401).json({ success: false, error: 'Incorrect password for registered mobile number.' });
    }

    const { password: _, ...customerSafe } = customer;
    return res.json({ success: true, customer: customerSafe });
  });

  // Get all customers (admin)
  app.get('/api/auth/customers', (_req, res) => {
    const safeCustomers = db.customers.map(({ password: _, ...c }) => c);
    return res.json({ success: true, customers: safeCustomers });
  });

  // Update customer profile
  app.put('/api/auth/profile/:id', (req, res) => {
    const { id } = req.params;
    const { full_name, phone, address, email } = req.body;

    const index = db.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    if (phone) {
      const cleaned = cleanPhone(phone);
      if (cleaned.length === 10) {
        db.customers[index].phone = cleaned;
      }
    }
    if (full_name) db.customers[index].full_name = full_name.trim();
    if (address) db.customers[index].address = address.trim();
    if (email) db.customers[index].email = email.trim();
    db.customers[index].updated_at = new Date().toISOString();

    saveDb();
    const { password: _, ...customerSafe } = db.customers[index];
    return res.json({ success: true, customer: customerSafe });
  });

  // ==========================================
  // PRODUCTS ENDPOINTS
  // ==========================================

  app.get('/api/products', (_req, res) => {
    return res.json({ success: true, products: db.products });
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    return res.json({ success: true, product });
  });

  app.post('/api/products', (req, res) => {
    const newProduct = {
      ...req.body,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    saveDb();
    return res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', (req, res) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Product not found.' });

    db.products[index] = {
      ...db.products[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    saveDb();
    return res.json({ success: true, product: db.products[index] });
  });

  app.delete('/api/products/:id', (req, res) => {
    db.products = db.products.filter((p) => p.id !== req.params.id);
    saveDb();
    return res.json({ success: true });
  });

  // ==========================================
  // CATEGORIES ENDPOINTS
  // ==========================================

  app.get('/api/categories', (_req, res) => {
    return res.json({ success: true, categories: db.categories });
  });

  app.post('/api/categories', (req, res) => {
    const { name, display_order, is_active } = req.body;
    const slug = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: `cat-${Date.now()}`,
      name: name || 'New Category',
      slug,
      display_order: Number(display_order) || 0,
      is_active: is_active !== false,
      created_at: new Date().toISOString()
    };
    db.categories.push(newCat);
    saveDb();
    return res.json({ success: true, category: newCat });
  });

  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Category not found' });
    db.categories[index] = { ...db.categories[index], ...req.body };
    saveDb();
    return res.json({ success: true, category: db.categories[index] });
  });

  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    db.categories = db.categories.filter((c) => c.id !== id);
    saveDb();
    return res.json({ success: true });
  });

  // ==========================================
  // ORDERS ENDPOINTS
  // ==========================================

  app.get('/api/orders', (_req, res) => {
    return res.json({ success: true, orders: db.orders });
  });

  app.get('/api/orders/my-orders', (req, res) => {
    const { customerId, phone, email } = req.query as { customerId?: string; phone?: string; email?: string };
    const cleanP = phone ? cleanPhone(phone) : '';

    const matched = db.orders.filter((o) => {
      if (customerId && o.customer_id === customerId) return true;
      if (cleanP && cleanPhone(o.customer_phone) === cleanP) return true;
      if (email && o.customer_email && o.customer_email.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });

    return res.json({ success: true, orders: matched });
  });

  app.post('/api/orders', (req, res) => {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryInstructions,
      deliverySlot,
      paymentMethod,
      upiReference,
      items
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain items.' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, error: 'Delivery address is required.' });
    }

    // Authoritative calculation of prices and inventory check
    let calculatedSubtotal = 0;
    const orderItems: Array<any> = [];

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ success: false, error: 'Product not available.' });
      }
      if (!product.is_available || product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Sorry, "${product.name}" only has ${product.stock_quantity} left in stock.`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;
      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: itemTotal
      });
    }

    // Deduct stock authoritatively
    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock_quantity = Math.max(0, product.stock_quantity - item.quantity);
        if (product.stock_quantity === 0) {
          product.is_available = false;
        }
      }
    }

    const deliveryFee = db.settings.deliveryFee || 30;
    const totalAmount = calculatedSubtotal + deliveryFee;
    const orderId = `ord-${Date.now()}`;
    const orderNum = generateOrderNumber();
    const createdAt = new Date().toISOString();

    const newOrder = {
      id: orderId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail || '',
      customer_phone: cleanPhone(customerPhone),
      order_number: orderNum,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      payment_method: paymentMethod || 'COD',
      payment_status: paymentMethod === 'UPI' && upiReference ? 'Paid' : 'Pending',
      order_status: 'Pending',
      delivery_address: deliveryAddress,
      delivery_instructions: deliveryInstructions || '',
      delivery_slot: deliverySlot || 'Instant Cold-Delivery (30-45 mins)',
      upi_reference: upiReference ? String(upiReference).trim() : '',
      created_at: createdAt,
      items: orderItems
    };

    db.orders.unshift(newOrder);

    // Update customer stats
    const custIndex = db.customers.findIndex((c) => c.id === customerId || cleanPhone(c.phone) === cleanPhone(customerPhone));
    if (custIndex !== -1) {
      db.customers[custIndex].total_orders = (db.customers[custIndex].total_orders || 0) + 1;
      db.customers[custIndex].total_spent = (db.customers[custIndex].total_spent || 0) + totalAmount;
    }

    // Log WhatsApp notification record for owner
    db.whatsappLogs.unshift({
      id: `wlog-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      recipientPhone: db.settings.ownerWhatsApp,
      message: `Order #${newOrder.order_number} placed by ${newOrder.customer_name} (${newOrder.customer_phone}) for ₹${newOrder.total_amount}`,
      sentAt: createdAt
    });

    saveDb();
    return res.status(201).json({ success: true, order: newOrder });
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

    order.order_status = status;
    order.updated_at = new Date().toISOString();
    saveDb();
    return res.json({ success: true, order });
  });

  app.put('/api/orders/:id/payment', (req, res) => {
    const { status } = req.body;
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

    order.payment_status = status;
    order.updated_at = new Date().toISOString();
    saveDb();
    return res.json({ success: true, order });
  });

  // ==========================================
  // SETTINGS & WHATSAPP ENDPOINTS
  // ==========================================

  app.get('/api/settings', (_req, res) => {
    return res.json({ success: true, settings: db.settings });
  });

  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDb();
    return res.json({ success: true, settings: db.settings });
  });

  app.post('/api/whatsapp/notify-owner', (req, res) => {
    const { orderId, orderNumber, message, recipientPhone } = req.body;
    const log = {
      id: `wlog-${Date.now()}`,
      orderId: orderId || '',
      orderNumber: orderNumber || '',
      recipientPhone: recipientPhone || db.settings.ownerWhatsApp,
      message: message || '',
      sentAt: new Date().toISOString()
    };
    db.whatsappLogs.unshift(log);
    saveDb();
    return res.json({ success: true, log });
  });

  app.get('/api/whatsapp/logs', (_req, res) => {
    return res.json({ success: true, logs: db.whatsappLogs });
  });

  // ==========================================
  // VITE DEV SERVER INTEGRATION (SPA)
  // ==========================================
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Backend API and UI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
