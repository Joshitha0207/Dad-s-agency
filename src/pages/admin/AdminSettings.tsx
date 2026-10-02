import React, { useState } from 'react';
import { Store, MapPin, Phone, Instagram, Save, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';
import { getOwnerWhatsAppNumber, setOwnerWhatsAppNumber, createWhatsAppUrl } from '../../utils/whatsapp';

export const AdminSettings: React.FC = () => {
  const [shopName, setShopName] = useState("Dad's Agency");
  const [address, setAddress] = useState('Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu');
  const [phone, setPhone] = useState('9843041633');
  const [ownerWhatsApp, setOwnerWhatsApp] = useState(getOwnerWhatsAppNumber());
  const [instagram, setInstagram] = useState('https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x');
  const [deliveryFee, setDeliveryFee] = useState(30);

  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setOwnerWhatsAppNumber(ownerWhatsApp);
    setTimeout(() => {
      setSaving(false);
      addToast("Dad's Agency shop settings & WhatsApp number updated successfully!");
    }, 600);
  };

  const handleTestWhatsApp = () => {
    const testMsg = `🍦 *TEST NOTIFICATION - DAD'S AGENCY*\nThis is a test notification verifying that the shop owner WhatsApp order alert is configured and working perfectly for +91 ${ownerWhatsApp}!`;
    const url = createWhatsAppUrl(ownerWhatsApp, testMsg);
    window.open(url, '_blank');
  };

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Shop Settings" subtitle="Manage store profile, WhatsApp alert number, and delivery fee" />

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Shop Info Settings Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xs space-y-6">
          <h2 className="font-extrabold text-lg text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Store className="w-5 h-5 text-pink-600" />
            <span>Store Profile & Information</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Shop Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Owner WhatsApp Number (Receives Order Details)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Test WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="relative flex rounded-xl border border-emerald-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 bg-emerald-50/40">
                  <span className="inline-flex items-center px-3 bg-emerald-100 text-xs font-bold text-emerald-800 border-r border-emerald-300 shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={ownerWhatsApp}
                    onChange={(e) => setOwnerWhatsApp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9843041633"
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm font-semibold text-emerald-950 focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-emerald-700 mt-1">
                  Every new customer order placed on the website will be sent directly to this WhatsApp number.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  ></textarea>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instagram Link</label>
                <div className="relative">
                  <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
