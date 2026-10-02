import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Download, IndianRupee, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminService, SalesReportData } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatting';
import { exportSalesReportToExcel } from '../../utils/exportUtils';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

const CATEGORY_COLORS = ['#ec4899', '#f59e0b', '#a855f7', '#10b981'];
const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'];

export const AdminReports: React.FC = () => {
  const [report, setReport] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const data = await adminService.getSalesReport();
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleExport = () => {
    if (!report) return;
    exportSalesReportToExcel(report);
    addToast('Sales report exported to Excel!');
  };

  if (loading || !report) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  const categoryChartData = Object.entries(report.salesByCategory).map(([category, revenue]) => ({
    category,
    revenue
  }));

  const statusChartData = Object.entries(report.statusBreakdown).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Sales Reports & Analytics" subtitle="Revenue insights, category distribution & top selling treats" />

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Export Button Header */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report to Excel</span>
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Revenue</span>
            <p className="text-3xl font-black text-gray-900">{formatCurrency(report.totalRevenue)}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Completed Orders</span>
            <p className="text-3xl font-black text-gray-900">{report.totalOrdersCount}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase">Average Order Value</span>
            <p className="text-3xl font-black text-pink-600">{formatCurrency(report.averageOrderValue)}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales by Category Bar Chart */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              <span>Revenue by Category (₹)</span>
            </h2>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #fbcfe8' }}
                  />
                  <Bar dataKey="revenue" fill="#ec4899" radius={[8, 8, 0, 0]}>
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Pie Chart */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span>Order Status Distribution</span>
            </h2>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Top Selling Products</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {report.topProducts.map((p, idx) => (
                  <tr key={p.name} className="hover:bg-gray-50">
                    <td className="p-3 font-black text-pink-600">#{idx + 1}</td>
                    <td className="p-3 font-bold">{p.name}</td>
                    <td className="p-3 font-bold">{p.qty} units</td>
                    <td className="p-3 font-extrabold text-emerald-600">{formatCurrency(p.revenue)}</td>
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
