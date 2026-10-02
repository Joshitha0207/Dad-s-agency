import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  IndianRupee,
  Package,
  Users,
  AlertTriangle,
  Clock,
  Truck,
  ArrowRight
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminService, DashboardStats } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatting';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const [data, orders] = await Promise.all([
        adminService.getDashboardStats(),
        orderService.getAllOrders()
      ]);
      setStats(data);
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <AdminHeader title="Dashboard" subtitle="Overview of Dad's Agency sales, orders & inventory" />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Admin Quick Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-pink-950 p-6 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-lg flex items-center justify-center sm:justify-start gap-2">
              <span>Admin Quick Actions</span>
              <span className="text-xs bg-pink-500/30 text-pink-200 border border-pink-400/30 px-2.5 py-0.5 rounded-full font-bold">
                Storefront Control
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Add new ice cream flavors, upload product images, set prices & stock. Changes reflect instantly on the user website!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/products?action=add"
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full text-xs font-extrabold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>+ Add New Product 🍦</span>
            </Link>
            <Link
              to="/admin/products"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full text-xs font-bold transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>

        {/* Low Stock Alert Banner if any products are low stock */}
        {stats.lowStockProducts.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-amber-950 text-base">
                  Low Stock Alert ⚠️ ({stats.lowStockProducts.length} items)
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  Some products are running below their low stock limit: {stats.lowStockProducts.map(p => p.name).slice(0, 3).join(', ')}...
                </p>
              </div>
            </div>
            <Link
              to="/admin/inventory"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              Manage Inventory
            </Link>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Today's Sales</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.todaysSales)}</p>
            <span className="text-[11px] text-gray-400 font-medium">{stats.todaysOrders} orders today</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Today's Orders</span>
              <div className="p-2.5 bg-pink-50 text-pink-600 rounded-2xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.todaysOrders}</p>
            <span className="text-[11px] text-gray-400 font-medium">Out of {stats.totalOrders} total orders</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Pending Orders</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.pendingOrders}</p>
            <span className="text-[11px] text-amber-600 font-bold">Needs shop preparation</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Out for Delivery</span>
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.outForDelivery}</p>
            <span className="text-[11px] text-purple-600 font-bold">In transit to customer</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Sales</span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{formatCurrency(stats.totalSales)}</p>
            <span className="text-[11px] text-gray-400 font-medium">All-time shop revenue</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Customers</span>
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-2xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.totalCustomers}</p>
            <span className="text-[11px] text-gray-400 font-medium">Registered profiles</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Products</span>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.totalProducts}</p>
            <span className="text-[11px] text-gray-400 font-medium">Catalog items</span>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Latest incoming orders at Dad's Agency</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-extrabold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-full"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-extrabold text-pink-600">{o.order_number}</td>
                    <td className="p-3 font-bold">{o.customer_name}</td>
                    <td className="p-3">{o.customer_phone}</td>
                    <td className="p-3 font-bold">{formatCurrency(o.total_amount)}</td>
                    <td className="p-3 uppercase">{o.payment_method}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800">
                        {o.order_status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
