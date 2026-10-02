import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Check, X, Tag } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🍦');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fetchCats = async () => {
    setLoading(true);
    const data = await categoryService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('🍦');
    setDisplayOrder(categories.length + 1);
    setIsEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || '🍦');
    setDisplayOrder(cat.display_order || 1);
    setIsEnabled(cat.is_enabled);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, {
        name: name.trim(),
        slug,
        description: description.trim(),
        icon,
        display_order: Number(displayOrder),
        is_enabled: isEnabled
      });
      addToast('Category updated.');
    } else {
      await categoryService.createCategory({
        name: name.trim(),
        slug,
        description: description.trim(),
        icon,
        display_order: Number(displayOrder),
        is_enabled: isEnabled
      });
      addToast('New category created.');
    }

    setIsModalOpen(false);
    fetchCats();
  };

  const handleDelete = async (id: string, catName: string) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      await categoryService.deleteCategory(id);
      addToast(`Deleted category "${catName}".`);
      fetchCats();
    }
  };

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Category Management" subtitle="Manage product categories (Ice Cream, Dairy, Chocolates)" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading categories...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <tr>
                    <th className="p-4">Icon</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Display Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/80">
                      <td className="p-4 text-2xl">{cat.icon || '🍦'}</td>
                      <td className="p-4 font-bold text-gray-900">{cat.name}</td>
                      <td className="p-4 text-gray-500">{cat.description || '-'}</td>
                      <td className="p-4 font-bold">{cat.display_order}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            cat.is_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cat.is_enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ice Cream, Dairy, Chocolates"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🍦, 🥛, 🍫"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catEnabled"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500"
                />
                <label htmlFor="catEnabled" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Category Active
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
