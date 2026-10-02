import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IceCream, Phone, MapPin, Instagram, Sparkles, ArrowRight, Heart, ShieldCheck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { CuteIceCreamAnimation } from '../components/home/CuteIceCreamAnimation';

export const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const featuredIceCreams = products.filter((p) => p.category === 'Ice Cream').slice(0, 4);
  const featuredDairy = products.filter((p) => p.category === 'Dairy').slice(0, 4);
  const featuredChocolates = products.filter((p) => p.category === 'Chocolates').slice(0, 4);

  return (
    <div className="space-y-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 text-white p-6 sm:p-10 md:p-12 lg:p-14 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-20 top-10 w-40 h-40 bg-pink-300/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-pink-50 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Tiruppur's Favorite Shop</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Dad's Agency <span className="inline-block animate-pulse">🍦</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-pink-100">
              Ice Creams, Chocolates & Dairy Delights
            </p>

            <p className="text-sm sm:text-base text-pink-50/90 font-medium leading-relaxed max-w-xl">
              Fresh treats for every mood ❤️ Delivered fast right to your doorstep in Tiruppur. Enjoy authentic ice cream cones, family tubs, fresh farm milk, paneer, and rich chocolates!
            </p>

            {/* Location & Phone Quick Cards */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Vivekanandar Nagar, College Road, Tiruppur</span>
              </div>
              <a
                href="tel:9843241633"
                className="flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 hover:bg-black/25 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>9843241633</span>
              </a>
            </div>

            {/* Action Call-to-action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 hover:bg-pink-50 font-extrabold text-base rounded-full shadow-xl transition-all transform active:scale-95 group"
              >
                <span>Order Now 🍦</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://www.instagram.com/jagannathen?igsh=cjhlaGRtaWUyMG8x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm rounded-full border border-white/30 transition-all"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>

          {/* Cute Animated Mascot on Right */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <CuteIceCreamAnimation />
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/products?category=Ice Cream"
          className="group bg-gradient-to-br from-pink-50 to-rose-100/60 p-6 rounded-3xl border border-pink-200/60 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-3xl">🍦</span>
            <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-pink-600 transition-colors">
              Ice Creams
            </h3>
            <p className="text-xs text-gray-600">Cups, Cones, Tubs, Sticks & Sundaes</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/products?category=Dairy"
          className="group bg-gradient-to-br from-amber-50 to-orange-100/60 p-6 rounded-3xl border border-amber-200/60 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-3xl">🥛</span>
            <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-amber-600 transition-colors">
              Fresh Dairy
            </h3>
            <p className="text-xs text-gray-600">Milk, Thick Curd, Paneer, Butter & Cheese</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/products?category=Chocolates"
          className="group bg-gradient-to-br from-purple-50 to-pink-100/60 p-6 rounded-3xl border border-purple-200/60 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-3xl">🍫</span>
            <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
              Chocolates
            </h3>
            <p className="text-xs text-gray-600">Cadbury Silk, KitKat & Premium Treats</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </section>

      {/* Delivery Highlights Banner */}
      <section className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
            <IceCream className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Direct Delivery in Tiruppur</h3>
            <p className="text-xs text-gray-500">
              Only <strong>₹30 Delivery Fee</strong> on all orders! Chilled & fresh to your door.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900">Need help with an order?</p>
            <p className="text-xs text-pink-600 font-semibold">Call 9843241633</p>
          </div>
          <a
            href="tel:9843241633"
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full shadow-md transition-colors"
          >
            Call Shop Now
          </a>
        </div>
      </section>

      {/* Featured Ice Creams */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Delicious Ice Creams</span> 🍦
            </h2>
            <p className="text-xs text-gray-500 font-medium">Popular ice cream cups, cones, bars and tubs</p>
          </div>
          <Link
            to="/products?category=Ice Cream"
            className="text-xs font-extrabold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-full"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredIceCreams.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCartSuccess={addToast} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Dairy */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Farm Fresh Dairy</span> 🥛
            </h2>
            <p className="text-xs text-gray-500 font-medium">Daily milk, curd, malai paneer, butter & cheese</p>
          </div>
          <Link
            to="/products?category=Dairy"
            className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full"
          >
            <span>View All Dairy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDairy.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCartSuccess={addToast} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Chocolates */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Chocolates & Treats</span> 🍫
            </h2>
            <p className="text-xs text-gray-500 font-medium">Cadbury Silk, KitKat and hazelnut boxes</p>
          </div>
          <Link
            to="/products?category=Chocolates"
            className="text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full"
          >
            <span>View All Chocolates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredChocolates.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCartSuccess={addToast} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold">
          <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
          <span>Made with Love in Tiruppur</span>
        </div>
        <h2 className="text-3xl font-extrabold">Why Order from Dad's Agency?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto pt-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">🍦</div>
            <h3 className="font-bold text-base mb-1">100% Pure & Fresh</h3>
            <p className="text-xs text-pink-100">Top-quality ice cream and farm-fresh dairy direct from trusted suppliers.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">🛵</div>
            <h3 className="font-bold text-base mb-1">Fast Express Delivery</h3>
            <p className="text-xs text-pink-100">Flat ₹30 delivery fee across Vivekanandar Nagar and College Road area.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-bold text-base mb-1">Friendly Neighborhood Shop</h3>
            <p className="text-xs text-pink-100">Personal service, fair pricing, and delicious snacks for your family.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
