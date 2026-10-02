import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Lock, MapPin, IceCream, AlertCircle, Sparkles, Eye, EyeOff, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { BackButton } from '../components/ui/BackButton';
import { cleanPhoneNumber } from '../utils/validation';

export const Signup: React.FC = () => {
  const { signupCustomer } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Vivekanandar Nagar, College Road, Tiruppur');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = cleanPhoneNumber(phone);
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    const res = await signupCustomer({
      fullName: fullName.trim(),
      phone: clean,
      password,
      confirmPassword,
      address: address.trim(),
      email: email.trim() || undefined
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
      return;
    }

    addToast(`Account created successfully with mobile +91 ${clean}! Welcome to Dad's Agency 🍦`);

    const target = location.state?.from?.pathname || (items.length > 0 ? '/checkout' : '/');
    setTimeout(() => {
      navigate(target, { replace: true });
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-10 space-y-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center justify-between">
        <BackButton />
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white mx-auto shadow-md shadow-pink-200">
            <IceCream className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Create Customer Account 🍦</h1>
          <p className="text-xs text-gray-500 font-medium">
            Register with your mobile number & password for fast ordering & WhatsApp updates
          </p>
        </div>

        {items.length > 0 && (
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl flex items-center gap-2 text-pink-900 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Create an account now to complete your order for {items.length} item{items.length > 1 ? 's' : ''}!</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Registered Mobile Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Mobile Number <span className="text-pink-600">*</span>
                </label>
                {phone.length === 10 && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> 10 Digits Valid
                  </span>
                )}
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
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Password <span className="text-gray-400 font-normal">(min 6 chars)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Email Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional, or defaults to your mobile ID"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street, Vivekanandar Nagar / College Road, Tiruppur"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Account & Register Mobile</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-pink-50 text-center">
          <p className="text-xs text-gray-500">
            Already have a registered account?{' '}
            <Link to="/login" className="font-extrabold text-pink-600 hover:underline">
              Log in with Mobile Number
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
