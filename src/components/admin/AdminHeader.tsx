import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { BackButton } from '../ui/BackButton';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Go to Customer Storefront Button */}
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-full text-xs font-extrabold transition-all shadow-2xs"
          title="Go to customer website / storefront"
        >
          <Store className="w-3.5 h-3.5 text-pink-600" />
          <span>Go to Customer Store 🛒</span>
        </Link>

        {/* Admin Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-extrabold transition-all shadow-2xs"
          title="Log out of admin session and switch account"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Logout Admin</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};
