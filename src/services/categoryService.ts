import { Category } from '../types/category';
import { INITIAL_CATEGORIES } from '../lib/initialData';
import { api } from './api';

const LOCAL_STORAGE_KEY = 'dads_agency_categories';

const getLocalCategories = (): Category[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

const saveLocalCategories = (categories: Category[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await api.get<{ success: boolean; categories: Category[] }>('/api/categories');
      if (res.success && res.categories && res.categories.length > 0) {
        saveLocalCategories(res.categories);
        return res.categories;
      }
    } catch {
      // fallback
    }
    return getLocalCategories();
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = { ...category, slug };

    try {
      const res = await api.post<{ success: boolean; category: Category }>('/api/categories', newCat);
      if (res.success && res.category) {
        const local = getLocalCategories();
        saveLocalCategories([...local, res.category]);
        return res.category;
      }
    } catch {
      // fallback
    }

    const local = getLocalCategories();
    const created: Category = { ...newCat, id: `cat-${Date.now()}`, created_at: new Date().toISOString() };
    saveLocalCategories([...local, created]);
    return created;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const res = await api.put<{ success: boolean; category: Category }>(`/api/categories/${id}`, updates);
      if (res.success && res.category) {
        const local = getLocalCategories();
        const index = local.findIndex((c) => c.id === id);
        if (index !== -1) {
          local[index] = res.category;
          saveLocalCategories(local);
        }
        return res.category;
      }
    } catch {
      // fallback
    }

    const local = getLocalCategories();
    const index = local.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updated = { ...local[index], ...updates };
    local[index] = updated;
    saveLocalCategories(local);
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await api.delete<{ success: boolean }>(`/api/categories/${id}`);
      if (res.success) {
        const local = getLocalCategories();
        saveLocalCategories(local.filter((c) => c.id !== id));
        return true;
      }
    } catch {
      // fallback
    }

    const local = getLocalCategories();
    const filtered = local.filter((c) => c.id !== id);
    saveLocalCategories(filtered);
    return true;
  }
};
