import { Order } from '../types/order';
import { formatCurrency, formatDate } from './formatting';

export const DEFAULT_OWNER_PHONE = '9843041633'; // Dad's Agency shop owner in Tiruppur
export const OWNER_WHATSAPP_STORAGE_KEY = 'dads_agency_owner_whatsapp';

export const getOwnerWhatsAppNumber = (): string => {
  try {
    const saved = localStorage.getItem(OWNER_WHATSAPP_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }
  return DEFAULT_OWNER_PHONE;
};

export const setOwnerWhatsAppNumber = (phone: string) => {
  localStorage.setItem(OWNER_WHATSAPP_STORAGE_KEY, phone.replace(/\D/g, ''));
};

/**
 * Generates formatted text message for WhatsApp to be received by the shop owner
 */
export const buildOwnerWhatsAppOrderMessage = (order: Order): string => {
  const itemsText = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product_name}*\n   Qty: ${item.quantity} × ${formatCurrency(item.unit_price)} = ${formatCurrency(item.total_price)}`
    )
    .join('\n');

  return `🚨 *NEW ORDER RECEIVED - DAD'S AGENCY* 🍦
━━━━━━━━━━━━━━━━━━━━━
📦 *Order #:* ${order.order_number}
📅 *Date & Time:* ${formatDate(order.created_at)}
💳 *Payment:* ${order.payment_method} (${order.payment_status})${order.upi_reference ? `\n   *UPI Ref / UTR:* ${order.upi_reference}` : ''}
⚡ *Order Status:* ${order.order_status}${order.delivery_slot ? `\n🚚 *Delivery Slot:* ${order.delivery_slot}` : ''}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer_name}
• *Registered Mobile:* ${order.customer_phone}
• *Email:* ${order.customer_email || 'Not provided'}
📍 *Delivery Address:*
${order.delivery_address}
${order.delivery_instructions ? `📝 *Note:* ${order.delivery_instructions}\n` : ''}
🛒 *ORDER ITEMS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatCurrency(order.subtotal)}
🚚 *Delivery Fee:* ${formatCurrency(order.delivery_fee)}
⭐ *TOTAL AMOUNT PAYABLE:* ${formatCurrency(order.total_amount)}
━━━━━━━━━━━━━━━━━━━━━
🛵 *Action Required:* Please confirm order preparation & dispatch!`;
};

/**
 * Generates formatted text message for customer on WhatsApp
 */
export const buildCustomerWhatsAppOrderMessage = (order: Order): string => {
  return `🍦 *Dad's Agency - Order Confirmation* ❤️
Hello *${order.customer_name}*,

Thank you for ordering with Dad's Agency!
Your order *#${order.order_number}* has been received.

📦 *Total Amount:* ${formatCurrency(order.total_amount)}
💳 *Payment:* ${order.payment_method}
📍 *Delivery To:* ${order.delivery_address}

We are preparing your fresh treats. For quick questions, reply to this message!`;
};

/**
 * Creates a valid WhatsApp click-to-chat URL with international country code
 */
export const createWhatsAppUrl = (phoneNumber: string, message: string): string => {
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  // Default to Indian country code 91 if 10-digit number
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
};

/**
 * Sends/opens WhatsApp message to the shop owner
 */
export const sendOrderToOwnerWhatsApp = (order: Order, targetPhone?: string): { success: boolean; url: string } => {
  const ownerPhone = targetPhone || getOwnerWhatsAppNumber();
  const message = buildOwnerWhatsAppOrderMessage(order);
  const url = createWhatsAppUrl(ownerPhone, message);

  // Record dispatch on backend
  try {
    fetch('/api/whatsapp/notify-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        message,
        recipientPhone: ownerPhone
      })
    }).catch(() => {
      // ignore network errors
    });
  } catch {
    // ignore
  }

  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked, user can click manual button
      return { success: true, url };
    }
  } catch (e) {
    console.warn('Could not auto-open WhatsApp window:', e);
  }

  return { success: true, url };
};
