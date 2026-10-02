import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  IceCream,
  Store
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Shop Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 shrink-0">
      <div>
        {/* Admin Header / Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <IceCream className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-none text-white">Dad's Agency</h2>
              <span className="text-[11px] font-semibold text-pink-400 tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront Link & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-pink-400 bg-pink-950/30 hover:bg-pink-900/40 transition-colors border border-pink-900/50"
        >
          <Store className="w-5 h-5" />
          <span>Go to Public Store 🛒</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
};

