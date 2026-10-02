import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, Lock, ArrowRight, IceCream, AlertCircle, ShieldCheck, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BackButton } from '../components/ui/BackButton';

export const Login: React.FC = () => {
  const { loginCustomer, isAdminLoggedIn, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const identifier = loginMethod === 'phone' ? phoneNumber : email;
    const res = await loginCustomer(identifier, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials.');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-12 space-y-4">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>

      {isAdminLoggedIn && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-3xl flex items-center justify-between gap-3 text-purple-900 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
            <span>You are currently logged in as <strong>Shop Admin</strong>.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/dashboard"
              className="px-3 py-1 bg-purple-600 text-white font-extrabold rounded-full hover:bg-purple-700 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={logoutAdmin}
              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-full transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white mx-auto shadow-md shadow-pink-200">
            <IceCream className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back! 🍦</h1>
          <p className="text-xs text-gray-500 font-medium">Log in to Dad's Agency with your registered mobile number</p>
        </div>

        {from === '/checkout' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs font-semibold">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Login to your customer account to place your order! Your cart is saved.</span>
          </div>
        )}

        {/* Login Method Toggle */}
        <div className="grid grid-cols-2 p-1 bg-pink-50/80 rounded-2xl border border-pink-100">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('phone');
              setError(null);
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'phone'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile Number</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setError(null);
            }}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'email'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === 'phone' ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Registered Mobile Number
              </label>
              <div className="relative flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500 bg-gray-50">
                <span className="inline-flex items-center px-3.5 bg-pink-50 text-xs font-bold text-pink-700 border-r border-gray-200 shrink-0">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  autoFocus
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm font-semibold text-gray-900 focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Enter your 10-digit registered Indian mobile number</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Log In with Registered Mobile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-pink-50 text-center space-y-2">
          <p className="text-xs text-gray-500">Don't have a registered account yet?</p>
          <Link
            to="/signup"
            state={location.state}
            className="inline-block w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-full transition-colors border border-pink-200"
          >
            Create Account with Mobile Number 🍦
          </Link>

          <div className="pt-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-purple-700 font-extrabold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Are you the Store Manager? Login as Admin here 🔑</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
