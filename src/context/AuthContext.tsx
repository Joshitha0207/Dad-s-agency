import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile } from '../types/customer';
import { customerService } from '../services/customerService';
import { validateSignup, cleanPhoneNumber } from '../utils/validation';
import { api } from '../services/api';

export interface SignupData {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  email?: string;
}

interface AuthContextType {
  customer: CustomerProfile | null;
  isAdminLoggedIn: boolean;
  loading: boolean;
  loginCustomer: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupCustomer: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => Promise<void>;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => Promise<boolean>;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('dads_agency_current_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      // If customer in localStorage, refresh against backend
      const saved = localStorage.getItem('dads_agency_current_customer');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.id) {
            const fresh = await customerService.getProfile(parsed.id);
            if (fresh) {
              setCustomer(fresh);
              localStorage.setItem('dads_agency_current_customer', JSON.stringify(fresh));
            }
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Log in customer using Registered Mobile Number (or Email) and Password
   */
  const loginCustomer = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      return { success: false, error: 'Please enter your registered mobile number.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Try backend authentication first
    try {
      const res = await api.post<{ success: boolean; customer: CustomerProfile }>('/api/auth/login', {
        identifier: trimmedId,
        password: pass
      });
      if (res.success && res.customer) {
        setCustomer(res.customer);
        localStorage.setItem('dads_agency_current_customer', JSON.stringify(res.customer));
        return { success: true };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Invalid login credentials.';
      // If server returned specific 401/404/409/403, propagate server message
      if (errMsg && !errMsg.includes('Failed to fetch') && !errMsg.includes('NetworkError')) {
        return { success: false, error: errMsg };
      }
    }

    // Fallback local check if offline
    const cleanPhone = cleanPhoneNumber(trimmedId);
    let matchedCustomer: CustomerProfile | null = null;

    if (cleanPhone.length === 10) {
      matchedCustomer = await customerService.findCustomerByPhone(cleanPhone);
    }
    if (!matchedCustomer) {
      matchedCustomer = await customerService.findCustomerByEmail(trimmedId);
    }

    if (!matchedCustomer) {
      return {
        success: false,
        error: cleanPhone.length === 10
          ? `Mobile number ${cleanPhone} is not registered yet. Please create an account.`
          : 'No account found with this email or mobile number.'
      };
    }

    if (matchedCustomer.is_disabled) {
      return { success: false, error: 'Your account is disabled. Please contact Dad\'s Agency support.' };
    }

    const expectedPassword = matchedCustomer.password || 'password123';
    if (pass !== expectedPassword) {
      return { success: false, error: 'Incorrect password for registered mobile number. Please try again.' };
    }

    setCustomer(matchedCustomer);
    localStorage.setItem('dads_agency_current_customer', JSON.stringify(matchedCustomer));
    return { success: true };
  };

  /**
   * Register a new customer account with Mobile Number, Password, Name, and Address
   */
  const signupCustomer = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const val = validateSignup(data);
    if (!val.isValid) {
      return { success: false, error: val.error };
    }

    const cleanPhone = cleanPhoneNumber(data.phone);

    // Call backend registration
    try {
      const res = await api.post<{ success: boolean; customer: CustomerProfile }>('/api/auth/register', {
        fullName: data.fullName.trim(),
        phone: cleanPhone,
        password: data.password,
        address: data.address.trim(),
        email: data.email?.trim() || `${cleanPhone}@dadsagency.com`
      });

      if (res.success && res.customer) {
        setCustomer(res.customer);
        localStorage.setItem('dads_agency_current_customer', JSON.stringify(res.customer));
        return { success: true };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Registration failed.';
      if (errMsg && !errMsg.includes('Failed to fetch')) {
        return { success: false, error: errMsg };
      }
    }

    // Local account fallback
    const newProfile: CustomerProfile = {
      id: `cust-${Date.now()}`,
      email: data.email?.trim() || `${cleanPhone}@dadsagency.com`,
      full_name: data.fullName.trim(),
      phone: cleanPhone,
      password: data.password,
      address: data.address.trim(),
      role: 'customer',
      created_at: new Date().toISOString(),
      total_orders: 0,
      total_spent: 0
    };

    await customerService.createOrUpdateCustomer(newProfile);
    setCustomer(newProfile);
    localStorage.setItem('dads_agency_current_customer', JSON.stringify(newProfile));
    return { success: true };
  };

  const logoutCustomer = async () => {
    setCustomer(null);
    localStorage.removeItem('dads_agency_current_customer');
  };

  const updateCustomerProfile = async (updates: Partial<CustomerProfile>): Promise<boolean> => {
    if (!customer) return false;
    const updated = await customerService.updateProfile(customer.id, updates);
    if (updated) {
      setCustomer(updated);
      localStorage.setItem('dads_agency_current_customer', JSON.stringify(updated));
      return true;
    }
    return false;
  };

  const loginAdmin = (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    if (
      (cleanUser === 'admin' || cleanUser === '9843241633' || cleanUser === '9843041633' || cleanUser === 'owner') &&
      (pass === 'admin123' || pass === 'password123')
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAdminLoggedIn,
        loading,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        updateCustomerProfile,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
