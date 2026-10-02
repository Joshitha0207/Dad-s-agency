import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ShoppingBag, MapPin, Phone, User, CreditCard, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, MessageSquare, ArrowRight, Copy, Check, QrCode, Clock, Truck, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatting';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { BackButton } from '../components/ui/BackButton';
import { sendOrderToOwnerWhatsApp, getOwnerWhatsAppNumber } from '../utils/whatsapp';
import { WhatsAppOrderCard } from '../components/common/WhatsAppOrderCard';
import { Order } from '../types/order';
import { cleanPhoneNumber } from '../utils/validation';

export const Checkout: React.FC = () => {
  const { customer } = useAuth();
  const { items, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(customer?.full_name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [area, setArea] = useState('Vivekanandar Nagar / College Road');
  const [landmark, setLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Instant Cold-Delivery (30-45 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [upiReference, setUpiReference] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Sync customer details when customer profile loads or updates
  useEffect(() => {
    if (customer) {
      if (!fullName) setFullName(customer.full_name || '');
      if (!phone) setPhone(customer.phone || '');
      if (!email) setEmail(customer.email || '');
      if (!address) setAddress(customer.address || '');
    }
  }, [customer]);

  const addToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!customer) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 sm:p-10 text-center border border-pink-100 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
          🔐
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Login Required to Place Order 🍦</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Please log in with your registered mobile number and password to complete your order at Dad's Agency.
          </p>
        </div>

        {items.length > 0 && (
          <div className="p-3 bg-pink-50/80 border border-pink-200 rounded-2xl text-xs font-bold text-pink-800">
            🛒 Your cart contains {items.length} item{items.length > 1 ? 's' : ''} worth {formatCurrency(grandTotal)}! Log in to complete your order.
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Link
            to="/login"
            state={{ from: { pathname: '/checkout' } }}
            className="block w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-black text-xs shadow-lg shadow-pink-200 transition-all transform active:scale-98"
          >
            Login with Registered Mobile Number 📱
          </Link>

          <Link
            to="/signup"
            state={{ from: { pathname: '/checkout' } }}
            className="block w-full py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full font-bold text-xs border border-pink-200 transition-colors"
          >
            Create New Account
          </Link>

          <Link
            to="/cart"
            className="inline-block text-xs text-gray-400 hover:text-gray-600 font-medium pt-2"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  // If order was just placed, display celebratory confirmation with WhatsApp order card
  if (placedOrder) {
    const ownerPhone = getOwnerWhatsAppNumber();
    return (
      <div className="max-w-2xl mx-auto my-8 space-y-6">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-200 animate-bounce">
            🎉
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Order #{placedOrder.order_number} Placed! ❤️
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-lg mx-auto">
              Thank you, <strong>{placedOrder.customer_name}</strong>! Your order details have been packaged and sent to the shop owner on WhatsApp.
            </p>
          </div>

          {/* Prominent WhatsApp Notification to Shop Owner */}
          <WhatsAppOrderCard order={placedOrder} />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate('/my-orders', { state: { newOrderPlaced: true, orderNum: placedOrder.order_number } })}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Live Order & History</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm rounded-full transition-colors text-center"
            >
              Order More Ice Creams 🍦
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 text-center border border-pink-100 shadow-xl space-y-4">
        <span className="text-4xl">🍦</span>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Add some delicious treats before placing an order.</p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold text-xs shadow-md"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = cleanPhoneNumber(phone);
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    setLoading(true);

    const fullDeliveryAddress = `${address.trim()}${area ? `, Area: ${area}` : ''}${
      landmark ? `, Landmark: ${landmark}` : ''
    }, Tiruppur`;

    const res = await orderService.createOrder({
      customerId: customer.id,
      customerName: fullName.trim(),
      customerEmail: email.trim() || `${cleanPhone}@dadsagency.com`,
      customerPhone: cleanPhone,
      deliveryAddress: fullDeliveryAddress,
      deliveryInstructions: deliveryInstructions.trim(),
      deliverySlot,
      paymentMethod,
      upiReference: paymentMethod === 'UPI' ? upiReference.trim() : undefined,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    });

    setLoading(false);

    if (!res.success || !res.order) {
      setError(res.error || 'Failed to place order.');
      addToast(res.error || 'Failed to place order.');
      return;
    }

    // Automatically send order details to shop owner via WhatsApp!
    sendOrderToOwnerWhatsApp(res.order);

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    clearCart();
    setPlacedOrder(res.order);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center gap-3">
        <BackButton label="Back to Cart" to="/cart" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Checkout & Delivery</span> 🛵
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Order details will be sent directly to the shop owner via WhatsApp
          </p>
        </div>
      </div>

      {/* Owner WhatsApp Notification Info Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-between gap-3 text-xs text-emerald-950 font-semibold shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📲</span>
          <div>
            <span>Instant Shop Owner Notification:</span>
            <span className="text-emerald-700 font-normal block sm:inline sm:ml-1">
              Owner receives order details at <strong>+91 {getOwnerWhatsAppNumber()}</strong> via WhatsApp immediately upon placing order.
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Customer & Address Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-pink-600" />
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Registered Mobile Number
                  </label>
                  <span className="text-[10px] text-pink-600 font-bold">Used for WhatsApp Alert</span>
                </div>
                <div className="relative flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500 bg-gray-50">
                  <span className="inline-flex items-center px-3 bg-pink-50 text-xs font-bold text-pink-700 border-r border-gray-200 shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3 py-2.5 bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Email Address <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-600" />
              <span>Delivery Address (Tiruppur)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No, Building, Street, Vivekanandar Nagar / College Road..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near College Road circle..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Delivery Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-pink-600" />
                  <span>Preferred Delivery Timing</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setDeliverySlot('Instant Cold-Delivery (30-45 mins)')}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                      deliverySlot.includes('Instant')
                        ? 'border-pink-600 bg-pink-50/60 text-pink-950 font-bold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-pink-600 shrink-0" />
                    <div>
                      <span className="text-xs block font-bold">⚡ Instant Cold-Delivery</span>
                      <span className="text-[11px] text-gray-500 font-normal">Arrives in 30-45 mins (Chilled pack)</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliverySlot('Evening Slot (5:00 PM - 8:00 PM)')}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                      deliverySlot.includes('Evening')
                        ? 'border-pink-600 bg-pink-50/60 text-pink-950 font-bold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <span className="text-xs block font-bold">🕒 Evening Slot</span>
                      <span className="text-[11px] text-gray-500 font-normal">Between 5:00 PM - 8:00 PM</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g., Leave at doorstep, call on arrival..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-pink-50 pb-3">
              <h2 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-600" />
                <span>Payment Options</span>
              </h2>
              <span className="text-xs font-black text-pink-600">Total: {formatCurrency(grandTotal)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-pink-600 bg-pink-50/50 text-pink-900 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'COD' ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`}>
                  {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <span className="text-sm block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-gray-500 font-normal">Pay cash when delivery arrives</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-pink-600 bg-pink-50/50 text-pink-900 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'UPI' ? 'border-pink-600 bg-pink-600' : 'border-gray-300'}`}>
                  {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <span className="text-sm block">UPI Payment (GPay / PhonePe / Paytm)</span>
                  <span className="text-[11px] text-gray-500 font-normal">Scan QR or tap to pay via UPI</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-5 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Dynamic Real UPI QR Code */}
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-purple-100 shrink-0 text-center space-y-1.5">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `upi://pay?pa=9843241633@upi&pn=${encodeURIComponent("Dad's Agency")}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent("Order Payment")}`
                      )}`}
                      alt="UPI QR Code"
                      className="w-36 h-36 mx-auto rounded-xl"
                    />
                    <span className="text-[10px] font-bold text-gray-500 block">Scan to Pay {formatCurrency(grandTotal)}</span>
                  </div>

                  {/* UPI Details & 1-Click Pay Buttons */}
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Shop UPI ID:</span>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                        <code className="bg-white px-3 py-1 rounded-lg border border-purple-200 font-mono font-black text-sm text-purple-900">
                          9843241633@upi
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('9843241633@upi');
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="p-1.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <a
                        href={`upi://pay?pa=9843241633@upi&pn=${encodeURIComponent("Dad's Agency")}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent("Order Payment")}`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-full shadow-md shadow-purple-200 transition-all flex items-center gap-1.5"
                      >
                        <span>📱 Tap to Pay on UPI App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-purple-800 font-medium">
                      Accepts Google Pay, PhonePe, Paytm, BHIM and all major banking UPI apps.
                    </p>
                  </div>
                </div>

                {/* Optional UTR / Reference Input */}
                <div className="pt-3 border-t border-purple-200/80">
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    UPI Transaction Reference / UTR Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value)}
                    placeholder="e.g. 329182910291 (12 digits from GPay/PhonePe receipt)"
                    className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-[10px] text-purple-700 mt-1">
                    Entering the reference number helps our shop confirm your payment in real-time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xl space-y-6 sticky top-24">
          <h2 className="font-extrabold text-lg text-gray-900 border-b border-pink-50 pb-3 flex items-center justify-between">
            <span>Order Items</span>
            <span className="text-xs bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold">
              {items.length} items
            </span>
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center justify-between text-xs">
                <div className="truncate max-w-[160px]">
                  <span className="font-bold text-gray-900 block truncate">{i.productName}</span>
                  <span className="text-gray-400">Qty: {i.quantity} × {formatCurrency(i.price)}</span>
                </div>
                <span className="font-extrabold text-gray-900">{formatCurrency(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-pink-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-bold text-pink-600">{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-pink-100 flex justify-between items-baseline">
              <span className="text-sm font-black text-gray-900">Total Payable</span>
              <span className="text-2xl font-black text-pink-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-base rounded-full shadow-xl shadow-pink-200 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Place Order & Send WhatsApp ❤️</span>
              </>
            )}
          </button>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span>📲</span>
              <span>Owner WhatsApp Notification:</span>
            </div>
            <p className="text-[10px] text-emerald-700 leading-tight">
              Order details including your registered mobile number will be sent immediately to the shop owner (+91 {getOwnerWhatsAppNumber()}).
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dad's Agency • Tiruppur Order Protection</span>
          </div>
        </div>
      </form>
    </div>
  );
};
