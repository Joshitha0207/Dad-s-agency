import React, { useState, useEffect } from 'react';
import { Search, Download, Users, Mail, Phone, MapPin, Calendar, Package } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CustomerProfile } from '../../types/customer';
import { customerService } from '../../services/customerService';
import { formatDate } from '../../utils/formatting';
import { exportCustomersToExcel } from '../../utils/exportUtils';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleExport = () => {
    exportCustomersToExcel(customers);
    addToast('Exported customer records to Excel!');
  };

  const filtered = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Customer Management" subtitle="Registered customer directory, contact info and order history" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
          <div className="relative flex-1 w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email or phone..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">No customer records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Mobile Number</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Delivery Address</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/80">
                      <td className="p-4 font-extrabold text-gray-900">{c.full_name}</td>
                      <td className="p-4 font-bold text-gray-700">{c.phone}</td>
                      <td className="p-4 text-gray-600">{c.email}</td>
                      <td className="p-4 max-w-xs text-gray-600 truncate">{c.address}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-pink-100 text-pink-800 font-bold rounded-full">
                          {c.total_orders || 1} Orders
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
