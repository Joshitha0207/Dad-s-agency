import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, IceCream, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export const Navbar: React.FC = () => {
  const { customer, logoutCustomer, isAdminLoggedIn, logoutAdmin } = useAuth();
  const { totalItemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
      {/* Top Banner with Location and Contact */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span>📍 Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a href="tel:9843241633" className="flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" />
              <span>9843241633</span>
            </a>
            <a
              href="https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
              <IceCream className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-pink-600 transition-colors">
                Dad's Agency <span className="text-pink-500">🍦</span>
              </span>
              <p className="text-[10px] text-pink-600 font-semibold uppercase tracking-wider -mt-1">
                Ice Cream • Dairy • Chocolates
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-pink-50/70 p-1.5 rounded-full border border-pink-100">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                isActive('/') ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products?category=Ice Cream"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                location.search.includes('Ice%20Cream') ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Ice Cream
            </Link>
            <Link
              to="/products?category=Dairy"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                location.search.includes('Dairy') ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Dairy
            </Link>
            <Link
              to="/products?category=Chocolates"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                location.search.includes('Chocolates') ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Chocolates
            </Link>
            {customer && (
              <Link
                to="/my-orders"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive('/my-orders') ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Admin Portal Shortcut & Logout when Admin is logged in */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 p-1 rounded-full">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-800 px-3 py-1 bg-white rounded-full shadow-2xs hover:bg-purple-100 transition-colors"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logoutAdmin();
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-full hover:bg-rose-100/60 transition-colors"
                  title="Logout Admin session"
                >
                  <LogOut className="w-3 h-3 text-rose-600" />
                  <span>Logout Admin</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-pink-600 px-2.5 py-1 rounded-full hover:bg-pink-50 transition-colors"
                title="Admin Portal Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-pink-100/70 hover:bg-pink-200/80 text-pink-700 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Customer Auth Actions */}
            {customer ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-800 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors border border-pink-200"
                >
                  <User className="w-4 h-4 text-pink-600" />
                  <span className="max-w-[120px] truncate">Hi, {customer.full_name.split(' ')[0]} 👋</span>
                </Link>
                <button
                  onClick={logoutCustomer}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-pink-200 transition-all transform active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
