import React from 'react';
import { Search } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search ice cream flavors, fresh dairy, chocolates..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-pink-200 rounded-full shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-900 placeholder-gray-400 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-pink-500 hover:text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full"
          >
            Clear
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Pill Category List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2 no-scrollbar">
        <button
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            selectedCategory === 'All'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
              : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
          }`}
        >
          ✨ All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
            }`}
          >
            {getCategoryIcon(cat)} {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

const getCategoryIcon = (category: string): string => {
  const catLower = category.toLowerCase();
  if (catLower.includes('cup') || catLower.includes('tub') || catLower.includes('pack')) return '🍨';
  if (catLower.includes('cone') || catLower.includes('sundae')) return '🍦';
  if (catLower.includes('stick') || catLower.includes('bar')) return '🍧';
  if (catLower.includes('ice cream')) return '🍦';
  if (catLower.includes('milk') || catLower.includes('curd') || catLower.includes('dairy') || catLower.includes('butter') || catLower.includes('paneer') || catLower.includes('cheese')) return '🥛';
  if (catLower.includes('chocolate') || catLower.includes('silk') || catLower.includes('kitkat')) return '🍫';
  return '❤️';
};
