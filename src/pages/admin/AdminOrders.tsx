import React, { useState, useEffect } from 'react';
import { Search, Eye, Printer, Filter, CheckCircle2, X, MessageSquare, ExternalLink } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { generateOrderPdfInvoice } from '../../utils/exportUtils';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';
import { WhatsAppOrderCard } from '../../components/common/WhatsAppOrderCard';
import { sendOrderToOwnerWhatsApp, createWhatsAppUrl, buildCustomerWhatsAppOrderMessage } from '../../utils/whatsapp';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Order Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await orderService.getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const success = await orderService.updateOrderStatus(orderId, newStatus);
    if (success) {
      addToast(`Order #${orders.find((o) => o.id === orderId)?.order_number || ''} status set to "${newStatus}".`);
      fetchOrders();
      if (viewingOrder?.id === orderId) {
        setViewingOrder({ ...viewingOrder, order_status: newStatus });
      }
    } else {
      addToast('Failed to update status.', 'error');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: PaymentStatus) => {
    const success = await orderService.updatePaymentStatus(orderId, newStatus);
    if (success) {
      addToast(`Payment status updated to "${newStatus}".`);
      fetchOrders();
      if (viewingOrder?.id === orderId) {
        setViewingOrder({ ...viewingOrder, payment_status: newStatus });
      }
    } else {
      addToast('Failed to update payment status.', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter !== 'All' && o.order_status !== selectedStatusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Order Management" subtitle="Manage incoming shop orders and update live delivery status" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
          <div className="relative flex-1 w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, customer name or phone..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors ${
                    selectedStatusFilter === status
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">No orders match your filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/80">
                      <td className="p-4 font-black text-pink-600">{o.order_number}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-gray-900 block">{o.customer_name}</span>
                        <span className="text-[11px] text-gray-500 font-semibold">{o.customer_phone}</span>
                      </td>
                      <td className="p-4 font-extrabold text-gray-900">{formatCurrency(o.total_amount)}</td>
                      <td className="p-4">
                        <span className="uppercase font-bold text-gray-800 block text-xs">{o.payment_method}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            onClick={() => handlePaymentStatusChange(o.id, o.payment_status === 'Paid' ? 'Pending' : 'Paid')}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                              o.payment_status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Click to toggle Paid/Pending"
                          >
                            {o.payment_status}
                          </button>
                        </div>
                        {o.upi_reference && (
                          <span className="text-[10px] font-mono text-purple-700 block truncate max-w-[120px] font-bold" title={`UPI UTR: ${o.upi_reference}`}>
                            UTR: {o.upi_reference}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="px-3 py-1 bg-pink-50 border border-pink-200 text-pink-900 rounded-full text-xs font-extrabold focus:outline-hidden"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-500 font-medium">{formatDate(o.created_at)}</td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            sendOrderToOwnerWhatsApp(o);
                            addToast(`WhatsApp order notification opened for #${o.order_number}`);
                          }}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center"
                          title="Send / Open Order Details on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingOrder(o)}
                          className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors inline-flex items-center"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateOrderPdfInvoice(o)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center"
                          title="Print / Download Invoice PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-pink-600 uppercase">Order #{viewingOrder.order_number}</span>
                <h2 className="text-xl font-extrabold text-gray-900">{formatDate(viewingOrder.created_at)}</h2>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Bar for Admin */}
            <div className="p-3.5 bg-pink-50/70 border border-pink-100 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-900 block">
                Update Order Status:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(viewingOrder.id, st)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      viewingOrder.order_status === st
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-pink-100 border border-pink-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-500 uppercase block mb-1">Customer Details</span>
                <p className="font-extrabold text-gray-900 text-sm">{viewingOrder.customer_name}</p>
                <p className="text-gray-600">Phone: {viewingOrder.customer_phone}</p>
                <p className="text-gray-600">Email: {viewingOrder.customer_email}</p>
                {viewingOrder.delivery_slot && (
                  <p className="text-purple-700 font-bold mt-1">🕒 Slot: {viewingOrder.delivery_slot}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-gray-500 uppercase block mb-1">Payment & Delivery</span>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-gray-900">{viewingOrder.payment_method}</span>
                  <button
                    onClick={() => handlePaymentStatusChange(viewingOrder.id, viewingOrder.payment_status === 'Paid' ? 'Pending' : 'Paid')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                      viewingOrder.payment_status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {viewingOrder.payment_status} (Click to toggle)
                  </button>
                </div>
                {viewingOrder.upi_reference && (
                  <p className="text-purple-800 font-mono font-bold mb-1">
                    UPI Ref: <span className="bg-purple-100 px-1.5 py-0.5 rounded-sm">{viewingOrder.upi_reference}</span>
                  </p>
                )}
                <p className="text-gray-800 font-medium">{viewingOrder.delivery_address}</p>
                {viewingOrder.delivery_instructions && (
                  <p className="text-pink-600 font-semibold mt-1">Note: {viewingOrder.delivery_instructions}</p>
                )}
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase">Ordered Products</h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {viewingOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div>
                      <span className="font-bold text-gray-900 block">{item.product_name}</span>
                      <span className="text-gray-400">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</span>
                    </div>
                    <span className="font-extrabold text-gray-900">{formatCurrency(item.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Notification Card */}
            <WhatsAppOrderCard order={viewingOrder} />

            {/* Calculations */}
            <div className="space-y-1 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(viewingOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatCurrency(viewingOrder.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
                <span>Total Amount</span>
                <span className="text-pink-600">{formatCurrency(viewingOrder.total_amount)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateOrderPdfInvoice(viewingOrder)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-full flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF Bill</span>
                </button>

                <a
                  href={createWhatsAppUrl(viewingOrder.customer_phone, buildCustomerWhatsAppOrderMessage(viewingOrder))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-full flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>
              </div>

              <button
                onClick={() => setViewingOrder(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
