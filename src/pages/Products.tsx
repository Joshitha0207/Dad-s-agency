import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryFilter } from '../components/product/CategoryFilter';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { categoryService } from '../services/categoryService';
import { BackButton } from '../components/ui/BackButton';

export const Products: React.FC = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedProductType, setSelectedProductType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await categoryService.getCategories();
      const catNames = cats.filter(c => c.is_enabled).map(c => c.name);
      setCategoriesList(catNames);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derive unique product types for quick filter
  const productTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((p) => {
      if (p.product_type) types.add(p.product_type);
    });
    return Array.from(types);
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Product Type Filter
      if (selectedProductType !== 'All' && p.product_type !== selectedProductType) {
        return false;
      }
      // Stock availability filter
      if (inStockOnly && (!p.is_available || p.stock_quantity <= 0)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        const matchType = p.product_type.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat && !matchType) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedProductType, inStockOnly, searchTerm]);

  return (
    <div className="space-y-8 py-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex items-center gap-3">
        <BackButton />
      </div>

      {/* Header Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Browse Our Products 🍦
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Fresh Ice Creams, Dairy Products & Chocolates from Dad's Agency
        </p>
      </div>

      {/* Category Filter & Search Bar */}
      <CategoryFilter
        categories={categoriesList.length > 0 ? categoriesList : ['Ice Cream', 'Dairy', 'Chocolates']}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Secondary Product Type and Stock Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-gray-500 uppercase shrink-0">Type:</span>
          <button
            onClick={() => setSelectedProductType('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedProductType === 'All' ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Types
          </button>
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedProductType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedProductType === type ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-pink-600 rounded-md border-pink-300 focus:ring-pink-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 max-w-md mx-auto my-12 space-y-4">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-3xl mx-auto">
            🍦
          </div>
          <h3 className="font-bold text-lg text-gray-900">No products found</h3>
          <p className="text-xs text-gray-500">
            We couldn't find any products matching your current category or search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedProductType('All');
              setSearchTerm('');
              setInStockOnly(false);
            }}
            className="px-5 py-2.5 bg-pink-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-pink-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCartSuccess={addToast} />
          ))}
        </div>
      )}
    </div>
  );
};
