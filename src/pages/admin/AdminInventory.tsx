import React, { useState, useEffect } from 'react';
import { Search, Save, AlertTriangle, Package, Check, RefreshCw } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { ToastContainer, ToastMessage } from '../../components/ui/Toast';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockEdits, setStockEdits] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.getProducts();
    setProducts(data);
    const initialEdits: { [id: string]: number } = {};
    data.forEach((p) => {
      initialEdits[p.id] = p.stock_quantity;
    });
    setStockEdits(initialEdits);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleQuantityChange = (id: string, newQty: number) => {
    setStockEdits((prev) => ({ ...prev, [id]: Math.max(0, newQty) }));
  };

  const handleSaveStock = async (product: Product) => {
    const newQty = stockEdits[product.id];
    if (newQty === undefined) return;

    setSavingId(product.id);
    await productService.updateStockQuantity(product.id, newQty);
    setSavingId(null);
    addToast(`Stock for "${product.name}" updated to ${newQty}.`);
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (showLowStockOnly && p.stock_quantity > p.low_stock_limit) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AdminHeader title="Inventory & Stock Control" subtitle="Monitor stock levels, set low stock thresholds, and update stock counts" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
          <div className="relative flex-1 w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product inventory..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500"
            />
            <span>Show Low Stock Only ⚠️</span>
          </label>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">Loading inventory...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400">No inventory matches filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Threshold</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Adjust Quantity</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock_quantity <= p.low_stock_limit;
                    const currentEdit = stockEdits[p.id] ?? p.stock_quantity;
                    const isChanged = currentEdit !== p.stock_quantity;

                    return (
                      <tr key={p.id} className={isLow ? 'bg-amber-50/40' : 'hover:bg-gray-50/80'}>
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-pink-50"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-gray-900 block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.unit}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-pink-600">{p.category}</td>
                        <td className="p-4 font-bold text-gray-500">{p.low_stock_limit} units</td>
                        <td className="p-4">
                          <span
                            className={`font-black text-sm ${
                              isLow ? 'text-amber-600 flex items-center gap-1' : 'text-emerald-600'
                            }`}
                          >
                            {isLow && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                            {p.stock_quantity}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuantityChange(p.id, currentEdit - 1)}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-md font-extrabold flex items-center justify-center text-gray-700"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentEdit}
                              onChange={(e) => handleQuantityChange(p.id, Number(e.target.value))}
                              className="w-16 text-center py-1 bg-gray-50 border border-gray-200 rounded-md font-bold text-xs"
                            />
                            <button
                              onClick={() => handleQuantityChange(p.id, currentEdit + 1)}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-md font-extrabold flex items-center justify-center text-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleSaveStock(p)}
                            disabled={!isChanged || savingId === p.id}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ml-auto ${
                              isChanged
                                ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-md'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{savingId === p.id ? 'Updating...' : 'Save'}</span>
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
    </div>
  );
};
