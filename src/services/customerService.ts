import { CustomerProfile } from '../types/customer';
import { INITIAL_CUSTOMERS } from '../lib/initialData';
import { cleanPhoneNumber } from '../utils/validation';
import { api } from './api';

const LOCAL_STORAGE_KEY = 'dads_agency_customers';

const getLocalCustomers = (): CustomerProfile[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

const saveLocalCustomers = (customers: CustomerProfile[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
};

export const customerService = {
  async getProfile(userId: string): Promise<CustomerProfile | null> {
    try {
      const customers = await this.getAllCustomers();
      return customers.find((c) => c.id === userId) || null;
    } catch {
      const local = getLocalCustomers();
      return local.find((c) => c.id === userId) || null;
    }
  },

  async findCustomerByPhone(phone: string): Promise<CustomerProfile | null> {
    const targetDigits = cleanPhoneNumber(phone);
    if (!targetDigits) return null;

    try {
      const customers = await this.getAllCustomers();
      const found = customers.find((c) => cleanPhoneNumber(c.phone || '') === targetDigits);
      if (found) return found;
    } catch {
      // ignore
    }

    const local = getLocalCustomers();
    return (
      local.find((c) => {
        const cDigits = cleanPhoneNumber(c.phone || '');
        return cDigits === targetDigits;
      }) || null
    );
  },

  async findCustomerByEmail(email: string): Promise<CustomerProfile | null> {
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) return null;

    try {
      const customers = await this.getAllCustomers();
      const found = customers.find((c) => c.email.toLowerCase() === targetEmail);
      if (found) return found;
    } catch {
      // ignore
    }

    const local = getLocalCustomers();
    return local.find((c) => c.email.toLowerCase() === targetEmail) || null;
  },

  async findCustomerByIdentifier(identifier: string): Promise<CustomerProfile | null> {
    const trimmed = identifier.trim();
    if (!trimmed) return null;

    const digitsOnly = cleanPhoneNumber(trimmed);
    if (digitsOnly.length >= 10) {
      const byPhone = await this.findCustomerByPhone(digitsOnly);
      if (byPhone) return byPhone;
    }

    return this.findCustomerByEmail(trimmed);
  },

  async createOrUpdateCustomer(profile: CustomerProfile): Promise<CustomerProfile> {
    try {
      const res = await api.post<{ success: boolean; customer: CustomerProfile }>('/api/auth/register', {
        fullName: profile.full_name,
        phone: profile.phone,
        password: profile.password || 'password123',
        address: profile.address,
        email: profile.email
      });
      if (res.customer) {
        return res.customer;
      }
    } catch (err) {
      console.warn('Backend register call failed, using local store:', err);
    }

    const local = getLocalCustomers();
    const index = local.findIndex((c) => c.id === profile.id || cleanPhoneNumber(c.phone) === cleanPhoneNumber(profile.phone));
    if (index !== -1) {
      local[index] = { ...local[index], ...profile, updated_at: new Date().toISOString() };
      saveLocalCustomers(local);
      return local[index];
    } else {
      local.unshift(profile);
      saveLocalCustomers(local);
      return profile;
    }
  },

  async updateProfile(userId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
    try {
      const res = await api.put<{ success: boolean; customer: CustomerProfile }>(`/api/auth/profile/${userId}`, updates);
      if (res.customer) {
        return res.customer;
      }
    } catch (err) {
      console.warn('Backend profile update failed, using local store:', err);
    }

    const local = getLocalCustomers();
    const index = local.findIndex((c) => c.id === userId);
    if (index !== -1) {
      const updated = { ...local[index], ...updates, updated_at: new Date().toISOString() };
      local[index] = updated;
      saveLocalCustomers(local);
      return updated;
    }
    return null;
  },

  async getAllCustomers(): Promise<CustomerProfile[]> {
    try {
      const res = await api.get<{ success: boolean; customers: CustomerProfile[] }>('/api/auth/customers');
      if (res.success && Array.isArray(res.customers)) {
        return res.customers;
      }
    } catch (err) {
      console.warn('Backend customers fetch failed, using local store:', err);
    }

    return getLocalCustomers();
  },

  async getCustomers(): Promise<CustomerProfile[]> {
    return this.getAllCustomers();
  },

  async setAccountStatus(userId: string, isDisabled: boolean): Promise<boolean> {
    const updated = await this.updateProfile(userId, { is_disabled: isDisabled });
    return Boolean(updated);
  }
};
