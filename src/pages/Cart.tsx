import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Lock, UserCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatting';
import { BackButton } from '../components/ui/BackButton';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, grandTotal } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-100 shadow-xl space-y-6">
        <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto">
          🍦
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">Your cart is empty 🍦</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Looks like you haven't added anything yet. Choose from our delicious ice creams, fresh dairy and chocolates!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-pink-200 transition-all transform active:scale-95"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-4">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Your Shopping Cart</span> 🍦
            </h1>
            <p className="text-xs text-gray-500 font-medium">Review your fresh treats before checking out</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-full"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-pink-50 border border-pink-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                    {item.category} • {item.unit}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base">{item.productName}</h3>
                  <p className="text-xs text-gray-500 font-semibold">{formatCurrency(item.price)} each</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-50">
                {/* Quantity Controls */}
                <div className="flex items-center border border-pink-200 rounded-full bg-pink-50/50">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:text-pink-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-extrabold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:text-pink-600"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <span className="text-base font-extrabold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Remove item button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-700 pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add more items</span>
          </Link>
        </div>

        {/* Order Calculation Summary */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xl space-y-6 sticky top-24">
          <h2 className="font-extrabold text-lg text-gray-900 border-b border-pink-50 pb-3">
            Order Summary 🍦
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Items Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600 font-medium">
              <div>
                <span>Delivery Fee</span>
                <span className="block text-[10px] text-pink-600 font-semibold">Tiruppur Standard Rate</span>
              </div>
              <span className="font-bold text-gray-900">{formatCurrency(deliveryFee)}</span>
            </div>

            <div className="pt-3 border-t border-pink-100 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-gray-900">Grand Total</span>
              <span className="text-2xl font-black text-pink-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-full shadow-xl shadow-pink-200 transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{customer ? 'Proceed to Checkout' : 'Proceed to Checkout 🔑'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!customer ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Account Login Required to Order</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  You can freely add items to your cart! When proceeding to checkout, you will be prompted to log in or create an account to place your order.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Logged in as <strong>{customer.full_name}</strong></span>
            </div>
          )}

          <p className="text-[11px] text-gray-400 text-center font-medium">
            Cash on Delivery & UPI supported at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
