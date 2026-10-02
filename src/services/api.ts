/**
 * Backend API Client for Dad's Agency
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({ success: false, error: res.statusText }));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async put<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({ success: false, error: res.statusText }));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json().catch(() => ({ success: false, error: res.statusText }));
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  }
};
