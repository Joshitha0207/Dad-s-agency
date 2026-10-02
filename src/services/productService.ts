import { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../lib/initialData';
import { api } from './api';

const LOCAL_STORAGE_KEY = 'dads_agency_products';

const getLocalProducts = (): Product[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const res = await api.get<{ success: boolean; products: Product[] }>('/api/products');
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        saveLocalProducts(res.products);
        return res.products;
      }
    } catch (err) {
      console.warn('Backend products fetch failed, using local store:', err);
    }
    return getLocalProducts();
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await api.get<{ success: boolean; product: Product }>(`/api/products/${id}`);
      if (res.success && res.product) {
        return res.product;
      }
    } catch {
      // ignore
    }
    const local = getLocalProducts();
    return local.find((p) => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      const res = await api.post<{ success: boolean; product: Product }>('/api/products', product);
      if (res.success && res.product) {
        const local = getLocalProducts();
        saveLocalProducts([res.product, ...local]);
        return res.product;
      }
    } catch (err) {
      console.warn('Backend product create failed, using local store:', err);
    }

    const local = getLocalProducts();
    const created: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveLocalProducts([created, ...local]);
    return created;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await api.put<{ success: boolean; product: Product }>(`/api/products/${id}`, updates);
      if (res.success && res.product) {
        const local = getLocalProducts();
        const idx = local.findIndex((p) => p.id === id);
        if (idx !== -1) {
          local[idx] = res.product;
          saveLocalProducts(local);
        }
        return res.product;
      }
    } catch (err) {
      console.warn('Backend product update failed, using local store:', err);
    }

    const local = getLocalProducts();
    const index = local.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = { ...local[index], ...updates, updated_at: new Date().toISOString() };
    local[index] = updated;
    saveLocalProducts(local);
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await api.delete<{ success: boolean }>(`/api/products/${id}`);
      if (res.success) {
        const local = getLocalProducts();
        saveLocalProducts(local.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.warn('Backend product delete failed:', err);
    }

    const local = getLocalProducts();
    const filtered = local.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  async updateStock(id: string, newQuantity: number): Promise<boolean> {
    const isAvailable = newQuantity > 0;
    const res = await this.updateProduct(id, {
      stock_quantity: newQuantity,
      is_available: isAvailable
    });
    return Boolean(res);
  },

  async updateStockQuantity(id: string, newQuantity: number): Promise<boolean> {
    return this.updateStock(id, newQuantity);
  },

  async uploadProductImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async deleteProductImage(_imageUrl: string): Promise<boolean> {
    return true;
  }
};
