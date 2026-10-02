import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Clock, CheckCircle2, ArrowRight, Truck, Check, Sparkles, MessageSquare } from 'lucide-react';
import { Order, OrderStatus } from '../types/order';
import { orderService } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/formatting';
import { BackButton } from '../components/ui/BackButton';
import { WhatsAppOrderCard } from '../components/common/WhatsAppOrderCard';
import { getOwnerWhatsAppNumber } from '../utils/whatsapp';

export const MyOrders: React.FC = () => {
  const { customer } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const isNewOrderPlaced = location.state?.newOrderPlaced;
  const newOrderNum = location.state?.orderNum;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;
      setLoading(true);
      const data = await orderService.getMyOrders(customer.id, customer.email);
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]); // Select latest order by default
      }
      setLoading(false);
    };
    fetchOrders();
  }, [customer]);

  if (!customer) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 text-center border border-pink-100 shadow-xl space-y-4">
        <span className="text-4xl">🔐</span>
        <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
        <p className="text-xs text-gray-500">Log in to view your previous ice cream & dairy orders.</p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold text-xs shadow-md"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-100 shadow-xl space-y-6">
        <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto">
          ❤️
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">No orders yet ❤️</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your first ice-cream order is waiting! Order fresh ice creams, farm dairy & chocolates now.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-pink-200"
        >
          <span>Order Now 🍦</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* New order placed banner */}
      {isNewOrderPlaced && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-lg">Order Placed Successfully! ❤️</h3>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              Order <strong>#{newOrderNum}</strong> is confirmed. Order details have been sent to Dad's Agency shop owner at <strong>+91 {getOwnerWhatsAppNumber()}</strong> via WhatsApp!
            </p>
          </div>
          <span className="text-3xl shrink-0">📲</span>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>My Orders & Live Tracking</span> 📦
          </h1>
          <p className="text-xs text-gray-500 font-medium">Track your active order status and view history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Order Selection List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Order History</h2>
          {orders.map((o) => {
            const isSelected = selectedOrder?.id === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-pink-50/80 border-pink-400 shadow-sm'
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900">{o.order_number}</span>
                  <OrderStatusBadge status={o.order_status} />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{formatDate(o.created_at)}</span>
                  <span className="font-extrabold text-gray-900">{formatCurrency(o.total_amount)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Order Tracking & Details */}
        {selectedOrder && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-50 pb-4">
              <div>
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                  Order #{selectedOrder.order_number}
                </span>
                <h2 className="text-xl font-extrabold text-gray-900">{formatDate(selectedOrder.created_at)}</h2>
              </div>
              <OrderStatusBadge status={selectedOrder.order_status} size="large" />
            </div>

            {/* Visual Order Tracker */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Live Tracking</h3>
              <OrderTracker status={selectedOrder.order_status} />
            </div>

            {/* Shop Owner WhatsApp Notification Details */}
            <WhatsAppOrderCard order={selectedOrder} />

            {/* Order Items Table */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Ordered Products</h3>
              <div className="divide-y divide-pink-50 border border-pink-100 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover bg-pink-50"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <span className="font-bold text-gray-900 block">{item.product_name}</span>
                        <span className="text-gray-400">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900">{formatCurrency(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Calculation breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-pink-50 text-xs">
              <div>
                <span className="font-bold text-gray-700 uppercase block mb-1">Delivery Address</span>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {selectedOrder.delivery_address}
                </p>
                {selectedOrder.delivery_instructions && (
                  <p className="text-[11px] text-pink-600 font-semibold mt-1">
                    Note: {selectedOrder.delivery_instructions}
                  </p>
                )}
              </div>

              <div className="space-y-2 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-pink-600">{formatCurrency(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-bold uppercase">{selectedOrder.payment_method} ({selectedOrder.payment_status})</span>
                </div>
                {selectedOrder.upi_reference && (
                  <div className="flex justify-between text-purple-800 text-[11px] font-mono">
                    <span>UPI Reference</span>
                    <span className="font-bold">{selectedOrder.upi_reference}</span>
                  </div>
                )}
                {selectedOrder.delivery_slot && (
                  <div className="flex justify-between text-gray-600 text-[11px]">
                    <span>Timing Slot</span>
                    <span className="font-semibold text-pink-700">{selectedOrder.delivery_slot}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-pink-200 flex justify-between font-black text-sm text-gray-900">
                  <span>Total Paid/Payable</span>
                  <span className="text-pink-600">{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Visual Order Tracking Stepper
const OrderTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  
  if (status === 'Cancelled') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs font-bold text-rose-700">
        ❌ This order was cancelled.
      </div>
    );
  }

  const currentIdx = steps.indexOf(status);

  return (
    <div className="bg-pink-50/60 p-6 rounded-2xl border border-pink-100 space-y-6">
      <div className="relative flex items-center justify-between max-w-xl mx-auto">
        {/* Connecting progress line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0">
          <div
            className="h-full bg-pink-600 transition-all duration-500"
            style={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-300'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-pink-200 scale-110' : ''}`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-bold mt-2 text-center max-w-[60px] ${
                  isCurrent ? 'text-pink-700 font-extrabold' : isDone ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs font-semibold text-pink-700 bg-white p-2.5 rounded-xl border border-pink-100 shadow-2xs">
        {status === 'Pending' && '⏳ Order received by Dad\'s Agency. Waiting for shop confirmation.'}
        {status === 'Confirmed' && '✅ Order confirmed by shop owner!'}
        {status === 'Preparing' && '🍦 Preparing your fresh ice creams and dairy treats...'}
        {status === 'Out for Delivery' && '🛵 Delivery executive is out with your chilled package!'}
        {status === 'Delivered' && '❤️ Order delivered! Enjoy your delicious treats!'}
      </div>
    </div>
  );
};

const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'normal' | 'large' }> = ({ status, size = 'normal' }) => {
  let color = 'bg-amber-100 text-amber-800 border-amber-200';
  if (status === 'Confirmed' || status === 'Preparing') color = 'bg-blue-100 text-blue-800 border-blue-200';
  if (status === 'Out for Delivery') color = 'bg-purple-100 text-purple-800 border-purple-200';
  if (status === 'Delivered') color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'Cancelled') color = 'bg-rose-100 text-rose-800 border-rose-200';

  return (
    <span
      className={`font-bold rounded-full border ${color} ${
        size === 'large' ? 'text-xs px-3.5 py-1' : 'text-[10px] px-2.5 py-0.5'
      }`}
    >
      {status}
    </span>
  );
};
