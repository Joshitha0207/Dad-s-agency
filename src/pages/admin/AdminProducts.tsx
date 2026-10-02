import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Edit3, Trash2, Search, Upload, X, Check, Image as ImageIcon, Star } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Product, ProductType } from '../../types/product';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency, calculateDiscount } from '../../utils/formatting';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Ice Cream');
  const [productType, setProductType] = useState<ProductType>('Cup');
  const [price, setPrice] = useState<number>(40);
  const [mrp, setMrp] = useState<number>(50);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [lowStockLimit, setLowStockLimit] = useState<number>(5);
  const [unit, setUnit] = useState('100ml');
  const [rating, setRating] = useState<number>(4.8);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories()
    ]);
    setProducts(prods);
    setCategories(cats.map((c) => c.name));
    setLoading(false);
  };

  const location = useLocation();

  useEffect(() => {
    fetchProductsAndCategories();
    if (location.search.includes('action=add')) {
      openAddModal();
    }
  }, [location.search]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory(categories[0] || 'Ice Cream');
    setProductType('Cup');
    setPrice(40);
    setMrp(50);
    setStockQuantity(20);
    setLowStockLimit(5);
    setUnit('100ml');
    setRating(4.8);
    setIsAvailable(true);
    setImageUrl('https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setProductType(p.product_type as ProductType);
    setPrice(p.price);
    setMrp(p.mrp);
    setStockQuantity(p.stock_quantity);
    setLowStockLimit(p.low_stock_limit || 5);
    setUnit(p.unit);
    setRating(p.rating || 5.0);
    setIsAvailable(p.is_available);
    setImageUrl(p.image_url);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await productService.uploadProductImage(file);
      setImageUrl(url);
      addToast('Product image uploaded successfully!');
    } catch {
      addToast('Image upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      product_type: productType,
      price: Number(price),
      mrp: Number(mrp),
      stock_quantity: Number(stockQuantity),
      low_stock_limit: Number(lowStockLimit),
      unit: unit.trim(),
      rating: Number(rating),
      is_available: isAvailable && Number(stockQuantity) > 0,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80'
    };

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, payload);
      addToast('Product updated successfully.');
    } else {
      await productService.createProduct(payload);
      addToast('New product added successfully!');
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchProductsAndCategories();
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      await productService.deleteProduct(id);
      addToast(`Deleted "${prodName}".`);
      fetchProductsAndCategories();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.product_type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Product Management" subtitle="Add, edit, change prices, update stock and upload product images" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product 🍦</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / MRP</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredProducts.map((p) => {
                    const discount = calculateDiscount(p.mrp, p.price);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80">
                        <td className="p-4">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-pink-50 border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          {p.name}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {p.product_type} • {p.unit}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-pink-600">{p.category}</td>
                        <td className="p-4">
                          <span className="font-extrabold text-gray-900 block">{formatCurrency(p.price)}</span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatCurrency(p.mrp)} ({discount}% OFF)
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${
                              p.stock_quantity <= p.low_stock_limit ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {p.stock_quantity} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.is_available && p.stock_quantity > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.is_available && p.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editingProduct ? 'Edit Product 🍦' : 'Add New Product 🍦'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80'}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-pink-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL or upload file..."
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chocolate Ice Cream Cup"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Rich and creamy chocolate ice cream made with real cocoa."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  >
                    {['Cup', 'Cone', 'Bar', 'Stick', 'Family Pack', 'Tub', 'Sundae', 'Bottle', 'Packet', 'Box', 'Piece', 'Kg', 'Litre'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Label</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="100ml, 500g, 1 piece..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Low Stock Alert Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={lowStockLimit}
                    onChange={(e) => setLowStockLimit(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500"
                  />
                  <label htmlFor="isAvailable" className="text-xs font-bold text-gray-800 cursor-pointer">
                    Product Available for Order
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-md"
                >
                  {saving ? 'Saving Product...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
