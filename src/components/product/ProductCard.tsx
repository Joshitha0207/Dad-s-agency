import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Tag } from 'lucide-react';
import { Product } from '../../types/product';
import { formatCurrency, calculateDiscount } from '../../utils/formatting';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onAddToCartSuccess?: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCartSuccess }) => {
  const { addToCart } = useCart();
  const discount = calculateDiscount(product.mrp, product.price);
  const isOutOfStock = !product.is_available || product.stock_quantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    if (onAddToCartSuccess) {
      onAddToCartSuccess(`🍦 "${product.name}" added to cart!`);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl p-4 border border-pink-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-pink-50/50 mb-3">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-pink-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-pink-100">
            {product.category}
          </span>

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {discount}% OFF
            </span>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-pink-600 uppercase tracking-wider">
              {product.product_type} • {product.unit}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-pink-600 transition-colors">
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add Button */}
      <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {isOutOfStock ? '0 available' : `${product.stock_quantity} in stock`}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all transform active:scale-95 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-200 hover:shadow-lg'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
