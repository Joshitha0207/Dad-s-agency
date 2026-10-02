import { Order, OrderItem, OrderStatus, PaymentStatus } from '../types/order';
import { productService } from './productService';
import { INITIAL_ORDERS } from '../lib/initialData';
import { generateOrderNumber } from '../utils/formatting';
import { api } from './api';

const LOCAL_STORAGE_KEY = 'dads_agency_orders';

const getLocalOrders = (): Order[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ORDERS;
  }
};

const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
};

export interface CreateOrderPayload {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  deliverySlot?: string;
  paymentMethod: 'COD' | 'UPI';
  upiReference?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: 'Your cart is empty 🍦' };
    }
    if (!payload.deliveryAddress) {
      return { success: false, error: 'Delivery address is required.' };
    }

    // Call backend API first
    try {
      const res = await api.post<{ success: boolean; order: Order }>('/api/orders', payload);
      if (res.success && res.order) {
        // Also cache locally
        const local = getLocalOrders();
        saveLocalOrders([res.order, ...local.filter((o) => o.id !== res.order.id)]);
        return { success: true, order: res.order };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Server order creation failed.';
      if (!errMsg.includes('Failed to fetch')) {
        return { success: false, error: errMsg };
      }
      console.warn('Backend order call failed, attempting local fallback:', err);
    }

    // Fallback local creation
    const products = await productService.getProducts();
    let calculatedSubtotal = 0;
    const orderItemsToInsert: Omit<OrderItem, 'id' | 'order_id'>[] = [];

    for (const item of payload.items) {
      const dbProduct = products.find((p) => p.id === item.productId);
      if (!dbProduct) {
        return { success: false, error: `Product no longer available.` };
      }
      if (!dbProduct.is_available || dbProduct.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `Sorry, "${dbProduct.name}" only has ${dbProduct.stock_quantity} available in stock.`
        };
      }

      const itemTotalPrice = dbProduct.price * item.quantity;
      calculatedSubtotal += itemTotalPrice;

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        product_image: dbProduct.image_url,
        quantity: item.quantity,
        unit_price: dbProduct.price,
        total_price: itemTotalPrice
      });
    }

    const deliveryFee = 30;
    const grandTotal = calculatedSubtotal + deliveryFee;
    const orderNum = generateOrderNumber();
    const createdAt = new Date().toISOString();

    const localOrder: Order = {
      id: `ord-${Date.now()}`,
      customer_id: payload.customerId,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      order_number: orderNum,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total_amount: grandTotal,
      payment_method: payload.paymentMethod,
      payment_status: payload.paymentMethod === 'UPI' && payload.upiReference ? 'Paid' : 'Pending' as PaymentStatus,
      order_status: 'Pending' as OrderStatus,
      delivery_address: payload.deliveryAddress,
      delivery_instructions: payload.deliveryInstructions || '',
      delivery_slot: payload.deliverySlot || 'Instant Cold-Delivery (30-45 mins)',
      upi_reference: payload.upiReference || '',
      created_at: createdAt,
      items: orderItemsToInsert.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
        order_id: `ord-${Date.now()}`
      }))
    };

    const localOrders = getLocalOrders();
    saveLocalOrders([localOrder, ...localOrders]);
    return { success: true, order: localOrder };
  },

  async getMyOrders(customerId: string, email?: string, phone?: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId);
      if (email) params.append('email', email);
      if (phone) params.append('phone', phone);

      const res = await api.get<{ success: boolean; orders: Order[] }>(`/api/orders/my-orders?${params.toString()}`);
      if (res.success && Array.isArray(res.orders)) {
        return res.orders;
      }
    } catch (err) {
      console.warn('Backend getMyOrders failed, using local orders:', err);
    }

    const local = getLocalOrders();
    return local.filter((o) => o.customer_id === customerId || (email && o.customer_email === email) || (phone && o.customer_phone === phone));
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getAllOrders();
    return orders.find((o) => o.id === orderId || o.order_number === orderId) || null;
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const res = await api.get<{ success: boolean; orders: Order[] }>('/api/orders');
      if (res.success && Array.isArray(res.orders)) {
        return res.orders;
      }
    } catch (err) {
      console.warn('Backend getAllOrders failed, using local orders:', err);
    }

    return getLocalOrders();
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const res = await api.put<{ success: boolean }>(`/api/orders/${orderId}/status`, { status });
      if (res.success) {
        return true;
      }
    } catch (err) {
      console.warn('Backend updateOrderStatus failed:', err);
    }

    const local = getLocalOrders();
    const index = local.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      local[index].order_status = status;
      local[index].updated_at = new Date().toISOString();
      saveLocalOrders(local);
      return true;
    }
    return false;
  },

  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    try {
      const res = await api.put<{ success: boolean }>(`/api/orders/${orderId}/payment`, { status });
      if (res.success) {
        return true;
      }
    } catch (err) {
      console.warn('Backend updatePaymentStatus failed:', err);
    }

    const local = getLocalOrders();
    const index = local.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      local[index].payment_status = status;
      local[index].updated_at = new Date().toISOString();
      saveLocalOrders(local);
      return true;
    }
    return false;
  }
};
