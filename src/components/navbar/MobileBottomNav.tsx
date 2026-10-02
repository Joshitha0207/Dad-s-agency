import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItemCount } = useCart();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            isActive('/') ? 'text-pink-600 font-bold' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            isActive('/products') ? 'text-pink-600 font-bold' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Categories</span>
        </Link>

        <Link
          to="/cart"
          className={`relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            isActive('/cart') ? 'text-pink-600 font-bold' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </Link>

        <Link
          to="/my-orders"
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            isActive('/my-orders') ? 'text-pink-600 font-bold' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px]">Orders</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            isActive('/profile') ? 'text-pink-600 font-bold' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
