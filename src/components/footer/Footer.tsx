import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, IceCream, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-pink-100 text-gray-800 border-t border-pink-200 mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-500 flex items-center justify-center text-white shadow-md">
                <IceCream className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                Dad's Agency <span className="text-pink-500">🍦</span>
              </span>
            </div>
            <p className="text-sm text-pink-700 font-semibold uppercase tracking-wider">
              Ice Creams • Dairy • Chocolates
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Serving the freshest ice creams, farm-fresh dairy products, and delicious chocolates across Tiruppur!
            </p>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Visit & Contact Us</h3>
            <div className="flex items-start gap-2.5 text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <span>Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
              <Phone className="w-5 h-5 text-pink-600 shrink-0" />
              <a href="tel:9843041633" className="hover:text-pink-600 transition-colors">
                9843041633
              </a>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="tel:9843041633"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Us Now
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919843041633&text=Hi%20Dad's%20Agency!%20I%20have%20an%20inquiry%20regarding%20ice%20cream%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                <span>💬 WhatsApp Us</span>
              </a>
              <a
                href="https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-full text-xs font-bold shadow-sm transition-opacity"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram Page ↗
              </a>
            </div>
          </div>

          {/* Quick Links & Admin Portal */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/products?category=Ice Cream" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Ice Cream Collection
                </Link>
              </li>
              <li>
                <Link to="/products?category=Dairy" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Fresh Dairy Items
                </Link>
              </li>
              <li>
                <Link to="/products?category=Chocolates" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Premium Chocolates
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-700 font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Shop Owner Admin Login 🔐
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>© 2026 Dad's Agency — Fresh treats for every mood ❤️ Vivekanandar Nagar, College Road, Tiruppur.</p>
        </div>
      </div>
    </footer>
  );
};
