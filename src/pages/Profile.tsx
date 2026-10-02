import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Package, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatting';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { BackButton } from '../components/ui/BackButton';

export const Profile: React.FC = () => {
  const { customer, updateCustomerProfile } = useAuth();

  const [fullName, setFullName] = useState(customer?.full_name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  if (!customer) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 text-center border border-pink-100 shadow-xl space-y-4">
        <span className="text-4xl">🔐</span>
        <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
        <p className="text-xs text-gray-500">Log in to view and update your customer profile.</p>
      </div>
    );
  }

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateCustomerProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      address: address.trim()
    });
    setSaving(false);

    if (ok) {
      addToast('Profile details updated successfully! ❤️');
    } else {
      addToast('Failed to update profile.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Customer Profile</span> 👤
          </h1>
          <p className="text-xs text-gray-500 font-medium">Manage your personal information and default delivery address</p>
        </div>
      </div>

      {/* Account Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-pink-600">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <Package className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{customer.total_orders || 1}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider">Account Created</span>
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-sm font-extrabold text-gray-900 pt-1">{formatDate(customer.created_at)}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Account Status</span>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-extrabold text-emerald-600 pt-1">Active Customer</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl space-y-6">
        <h2 className="font-extrabold text-lg text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-pink-600" />
          <span>Personal Information</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Read Only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={customer.email}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Registered Mobile Number <span className="text-pink-600 font-normal lowercase">(used for login & WhatsApp alerts)</span>
              </label>
              <div className="relative flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 bg-gray-50">
                <span className="inline-flex items-center px-3.5 bg-pink-50 text-xs font-bold text-pink-700 border-r border-gray-200 shrink-0">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-pink-50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
